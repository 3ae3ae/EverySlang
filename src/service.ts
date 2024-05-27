import axios from "axios";
import { wordDto } from "./model";
import t_u_f from "./thumb_up_FILL.svg";
import t_u from "./thumb_up.svg";
import t_d from "./thumb_down.svg";
import t_d_f from "./thumb_down_FILL.svg";
import DOMPurify from "dompurify";

const BaseUrl = import.meta.env.VITE_SERVER;
const ax = axios.create({ baseURL: BaseUrl, withCredentials: true });
const cards: Map<number, number> = new Map();

export {
  login,
  getWords,
  addWordCards,
  removeAllCards,
  createWord,
  validateNickname,
  registerMember,
  showDialog,
  closeDialog,
  getNickname,
};
async function getNickname($login: HTMLAnchorElement) {
  const { data } = await ax.get("/nickname");
  if (data !== "No Name") {
    $login.textContent = data;
    $login.href = "#";
  }
}
//w.isLike 1: like 0: dislike -1: none
function makeHeader(w: wordDto) {
  const $word = document.createElement("span");
  $word.innerText = w.word;

  const $likeImage = document.createElement("img");
  let tmp = w.isLike === 1 ? t_u_f : t_u;
  $likeImage.setAttribute("src", tmp);
  const $like = document.createElement("span");
  $like.appendChild(document.createTextNode(w.like_amount + "\u00a0"));
  $like.appendChild($likeImage);

  const $dislikeImage = document.createElement("img");
  tmp = w.isLike === 0 ? t_d_f : t_d;
  $dislikeImage.setAttribute("src", tmp);
  const $dislike = document.createElement("span");
  $dislike.appendChild(document.createTextNode(w.dislike_amount + "\u00a0"));
  $dislike.appendChild($dislikeImage);

  const $div = document.createElement("div");
  $div.appendChild($like);
  $div.appendChild(document.createTextNode("\u00a0\u00a0"));
  $div.appendChild($dislike);

  const $flex = document.createElement("div");
  $flex.setAttribute("style", "display: flex; justify-content: space-between;");

  $flex.appendChild($word);
  $flex.appendChild($div);

  return [$flex, $like, $dislike];
}

async function getWords(keyword: string, page: Number, $div: HTMLElement) {
  const wordPerPage = 10;
  const $loading = document.createElement("div");
  $loading.setAttribute("aria-busy", "true");
  $div.appendChild($loading);
  const { data } = await ax.get("/search", { params: { keyword, page } });
  console.log([...data]);
  $div.removeChild($loading);
  if ([...data].length < wordPerPage) {
    return [data, "end"];
  } else {
    return [data, "notEnd"];
  }
}

async function addWordCards(words: wordDto[], $div: HTMLElement) {
  const $frag = new DocumentFragment();
  for (const w of words) {
    const $card = document.createElement("article");
    const [$header, $like, $dislike] = makeHeader(w);
    const $body = document.createElement("body");
    const $member = document.createElement("footer");
    $member.textContent = w.nickname;
    $body.innerText = w.meaning;
    $card.appendChild($header);
    $card.appendChild($body);
    $card.appendChild($member);
    $frag.appendChild($card);
    cards.set(w.word_id, w.isLike);
    addClickListener($like, $dislike, w.word_id);
  }
  $div.appendChild($frag);
}

async function removeAllCards($div: HTMLElement) {
  $div.replaceChildren();
}

const checkXSS = (input: string) => input !== DOMPurify.sanitize(input);

async function createWord($form: HTMLFormElement) {
  const $word = $form["word"];
  const $meaning = $form["meaning"];
  if ($word.value.length > 30) {
    window.alert("단어는 30자 이내여아합니다.");
    return;
  } else if ($meaning.value.length > 100) {
    window.alert("설명은 100자 이내여아합니다.");
    return;
  }
  if ($word.value.length === 0) {
    window.alert("내용을 입력해주세요.");
    return;
  } else if ($meaning.value.length === 0) {
    window.alert("설명을 입력해주세요.");
    return;
  }
  if (checkXSS($word.value) || checkXSS($meaning.value)) {
    window.alert("XSS 스크립트가 발견되었습니다.");
    return;
  }
  $form.submit();
}

async function addClickListener(
  $like: HTMLElement,
  $dislike: HTMLElement,
  word_id: number
) {
  $like.addEventListener("click", async () => {
    const vote = cards.get(word_id); // vote가 1이면 like, 0이면 dislike, -1이면 기본 상태
    if (vote === 1) {
      $like.firstChild!.nodeValue =
        (Number($like.firstChild?.nodeValue) - 1).toString() + "\u00a0";
      cards.set(word_id, -1);
      ax.put("/removevote", { word_id, vote: "like" });
    } else if (vote === 0) {
      $like.firstChild!.nodeValue =
        (Number($like.firstChild?.nodeValue) + 1).toString() + "\u00a0";
      $dislike.firstChild!.nodeValue =
        (Number($dislike.firstChild?.nodeValue) - 1).toString() + "\u00a0";
      cards.set(word_id, 1);
      ax.put("/vote", { word_id, vote: "like" });
    } else {
      $like.firstChild!.nodeValue =
        (Number($like.firstChild?.nodeValue) + 1).toString() + "\u00a0";
      cards.set(word_id, 1);
      ax.put("/vote", { word_id, vote: "like" });
    }
    setImage($like, $dislike, word_id);
  });

  $dislike.addEventListener("click", async () => {
    const vote = cards.get(word_id);
    if (vote === 1) {
      $like.firstChild!.nodeValue =
        (Number($like.firstChild?.nodeValue) - 1).toString() + "\u00a0";
      $dislike.firstChild!.nodeValue =
        (Number($dislike.firstChild?.nodeValue) + 1).toString() + "\u00a0";
      cards.set(word_id, 0);
      ax.put("/vote", { word_id, vote: "dislike" });
    } else if (vote === 0) {
      $dislike.firstChild!.nodeValue =
        (Number($dislike.firstChild?.nodeValue) - 1).toString() + "\u00a0";
      cards.set(word_id, -1);
      ax.put("/removevote", { word_id, vote: "dislike" });
    } else {
      $dislike.firstChild!.nodeValue =
        (Number($dislike.firstChild?.nodeValue) + 1).toString() + "\u00a0";
      cards.set(word_id, 0);
      ax.put("/vote", { word_id, vote: "dislike" });
    }
    setImage($like, $dislike, word_id);
  });
}

function setImage($like: HTMLElement, $dislike: HTMLElement, word_id: number) {
  const vote = cards.get(word_id);
  const $likeImage = $like.querySelector("img");
  const $dislikeImage = $dislike.querySelector("img");
  if (vote === 1) {
    $likeImage?.setAttribute("src", t_u_f);
    $dislikeImage?.setAttribute("src", t_d);
  } else if (vote === 0) {
    $likeImage?.setAttribute("src", t_u);
    $dislikeImage?.setAttribute("src", t_d_f);
  } else {
    $likeImage?.setAttribute("src", t_u);
    $dislikeImage?.setAttribute("src", t_d);
  }
}

async function validateNickname(name: string) {
  if (checkXSS(name)) return false;
  const res = await ax.get("/validateNickname", { params: { name } });
  if (res.data) return true;
  else return false;
}

async function registerMember(name: string) {
  const result = await ax.post("/registerMember", { name });
  console.log(result.data);
  if (result.data === "OK") {
    return true;
  } else return false;
}

async function showDialog(
  ok: boolean,
  $dialog: HTMLDialogElement,
  $document: HTMLElement
) {
  const $title = $dialog.getElementsByTagName("h2")[0] as HTMLHeadingElement;
  const $content = $dialog.getElementsByTagName("p")[0] as HTMLParagraphElement;
  const $comfirmButton = $dialog.getElementsByTagName(
    "button"
  )[1] as HTMLButtonElement;
  if (ok) {
    $title.textContent = "회원가입이 완료되었습니다.";
    $content.textContent = "메인 페이지로 이동합니다.";
    $comfirmButton.hidden = false;
  } else {
    $title.textContent = "회원 가입에 실패하였습니다.";
    $content.textContent = "메인 페이지로 이동합니다.";
    $comfirmButton.hidden = false;
  }
  $document.classList.add("modal-is-open", "modal-is-opening");
  setTimeout(() => {
    $document.classList.remove("modal-is-opening");
  }, 500);
  $dialog.showModal();
}

async function closeDialog(
  $dialog: HTMLDialogElement,
  $document: HTMLElement,
  location: string
) {
  $document.classList.add("modal-is-closing");
  setTimeout(() => {
    $document.classList.remove("modal-is-closing", "modal-is-open");
  }, 500);
  $dialog.close();
  document.location.href = location;
}

async function login($img: HTMLImageElement) {
  const params = {
    client_id: import.meta.env.VITE_REST_KEY,
    redirect_uri: import.meta.env.VITE_SERVER + "/login",
    response_type: "code",
  };

  axios.get("https://kauth.kakao.com/oauth/authorize", {
    params,
  });
}
