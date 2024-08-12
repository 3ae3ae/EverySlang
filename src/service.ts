import axios from "axios";
import { wordDto } from "./model";
import t_u_f from "./thumb_up_FILL.svg";
import t_u from "./thumb_up.svg";
import t_d from "./thumb_down.svg";
import t_d_f from "./thumb_down_FILL.svg";
import DOMPurify from "dompurify";
import { Dialog } from "./dialog";
import { makeElement } from "./utils";

const BaseUrl = import.meta.env.VITE_SERVER;
const ax = axios.create({ baseURL: BaseUrl, withCredentials: true });
const cards: Map<number, number> = new Map();

export {
  disableAccount,
  makeElement,
  getProfile,
  login,
  getWords,
  addWordCards,
  removeAllCards,
  createWord,
  validateNickname,
  registerMember,
  getNickname,
};

const $askDelete = new Dialog(() => {}, {
  title: "단어를 삭제하시겠습니까?",
  content: "다음 단어를 삭제합니다.",
  hasCancel: true,
});

async function getProfile(
  $like: HTMLSpanElement,
  $dislike: HTMLSpanElement,
  $words: HTMLSpanElement,
  name: string
) {
  const res = await ax.get("/profile/" + name);
  const ret: { [key: string]: string } = res.data;
  $like.textContent = ret.like;
  $dislike.textContent = ret.dislike;
  $words.textContent = ret.words.replace(/\.,\./g, ", ");
}

async function disableAccount() {
  const { data } = await ax.get(`/disableAccount`, {
    withCredentials: true,
  });
  if (data === "OK") return true;
  else return false;
}

async function getNickname($user: HTMLDivElement) {
  const { data } = await ax.get("/nickname");
  console.log(data);
  if (data !== "No Name") {
    const $details = makeElement("details", {
      attribute: "style",
      value: "position: absolute; right: 0; top: 0; width: 96.5px; padding: 0;",
    });
    $details.appendChild(
      makeElement("summary", {
        textContent: data,
        attribute: "style",
        value: "list-style: none;",
      })
    );
    const $ul = $details.appendChild(
      makeElement("ul", {
        attribute: "style",
        value: "list-style: none; margin-bottom: 0;",
      })
    );
    $ul.append(
      makeElement("li", {
        child: makeElement("a", {
          attribute: "href",
          value: "profile.html",
          textContent: "프로필 페이지",
        }),
      }),
      makeElement("li", {
        child: makeElement("a", {
          attribute: "href",
          value: "nickname.html",
          textContent: "닉네임 변경",
        }),
      }),
      makeElement("li", {
        child: makeElement("a", {
          attribute: "href",
          value: "logout.html",
          textContent: "로그아웃",
        }),
      }),
      makeElement("li", {
        child: makeElement("a", {
          attribute: ["href", "id"],
          value: ["disableAccount.html", "quit"],
          textContent: "회원 탈퇴",
        }),
      })
    );
    $user.appendChild($details);
    return data;
  } else {
    console.log("로그인");
    $user.appendChild(
      makeElement("a", {
        textContent: "로그인",
        class: "button",
        attribute: ["href", "style"],
        value: ["login.html", "position: absolute; top: 0; left: 0;"],
      })
    );
    return "No Name";
  }
}
//w.isLike 1: like 0: dislike -1: none
function makeHeader(w: wordDto) {
  const $word = makeElement("h3", { textContent: w.word });

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
  $loading.textContent = "Loading...";
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
    const $card = makeElement("article");
    const $delete =
      w.deletable === "OK"
        ? (makeElement("button", {
            textContent: "삭제하기",
            class: "button button-outline",
          }) as HTMLButtonElement)
        : (undefined as undefined);
    if ($delete) {
      const box = makeElement("div", {
        class: "container",
        attribute: "style",
        value: "display: flex; justify-content: flex-end;",
        child: $delete,
      });

      $card.appendChild(box);
    }
    const [$header, $like, $dislike] = makeHeader(w);
    const $member = document.createElement("footer");
    $member.appendChild(
      makeElement("a", {
        attribute: ["style", "href"],
        value: [
          "text-decoration: none;",
          "profile.html?username=" + w.nickname,
        ],
        textContent: "by " + w.nickname,
      })
    );
    const [body, ex] = w.meaning.split("/** every slang spacer*/");
    const $body = makeElement("body", {
      child: [
        makeElement("span", { textContent: body, class: "word-contents" }),
        makeElement("br"),
        makeElement("small", { textContent: ex, class: "word-contents" }),
      ],
    });
    $card.append($header, document.createElement("hr"), $body, $member);
    $frag.appendChild($card);
    cards.set(w.word_id, w.isLike);
    addClickListener($like, $dislike, w.word_id, w.word, $delete);
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
  const $example = $form["example"];
  if ($word.value.length > 30) {
    window.alert("단어는 30자 이내여아합니다.");
    return;
  } else if ($meaning.value.length > 200) {
    window.alert("설명은 200자 이내여아합니다.");
    return;
  } else if ($example.value.length > 200) {
    window.alert("예문은 200자 이내여아합니다.");
    return;
  }
  if ($word.value.length === 0) {
    window.alert("내용을 입력해주세요.");
    return;
  } else if ($meaning.value.length === 0) {
    window.alert("설명을 입력해주세요.");
    return;
  }
  if (
    checkXSS($word.value) ||
    checkXSS($meaning.value) ||
    checkXSS($example.value)
  ) {
    window.alert("XSS 스크립트가 발견되었습니다.");
    return;
  }
  $form.submit();
}

// async function showDeleteDialog(
//   $dialog: HTMLDialogElement,
//   $document: HTMLElement,
//   word: string,
//   word_id: number
// ) {
//   const $title = $dialog.getElementsByTagName("h2")[0] as HTMLHeadingElement;
//   const $content = $dialog.getElementsByTagName("p")[0] as HTMLParagraphElement;
//   $title.textContent = "단어를 삭제하시겠습니까?";
//   $content.textContent = "다음 단어를 삭제합니다: " + word;
//   document.getElementById("wordId")!.textContent = word_id.toString();
//   $document.classList.add("modal-is-open", "modal-is-opening");
//   setTimeout(() => {
//     $document.classList.remove("modal-is-opening");
//   }, 500);
//   $dialog.showModal();
// }

async function addClickListener(
  $like: HTMLElement,
  $dislike: HTMLElement,
  word_id: number,
  word: string,
  $delete?: HTMLButtonElement
) {
  if ($delete) {
    $delete.addEventListener("click", async () => {
      console.log("asd");
      $askDelete.$content.textContent = `다음 단어를 삭제합니다. : ${word}`;
      $askDelete.confirm = async () => {
        await ax.get(`/removeword/${word_id}`, {
          withCredentials: true,
        });
        window.location.href = window.location.href;
      };
      $askDelete.showDialog();
    });
  }
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

async function login() {
  const params = {
    client_id: import.meta.env.VITE_REST_KEY,
    redirect_uri: import.meta.env.VITE_SERVER + "/login",
    response_type: "code",
  };

  axios.get("https://kauth.kakao.com/oauth/authorize", {
    params,
  });
}
