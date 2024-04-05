import axios from "axios";
import { wordDto } from "./model";
import t_u_f from "./thumb_up_FILL.svg";
import t_u from "./thumb_up.svg";
import t_d from "./thumb_down.svg";
import t_d_f from "./thumb_down_FILL.svg";
import DOMPurify from "dompurify";

const BaseUrl = "http://localhost:3000";
const ax = axios.create({ baseURL: BaseUrl });
const cards: Map<number, number> = new Map();

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
    $body.innerText = w.meaning;
    $card.appendChild($header);
    $card.appendChild($body);
    $frag.appendChild($card);
    cards.set(w.word_id, w.isLike);
    addClickListener($like, $dislike, w.word_id);
  }
  $div.appendChild($frag);
}

async function removeAllCards($div: HTMLElement) {
  $div.replaceChildren();
}

async function createWord(
  $word: HTMLInputElement,
  $meaning: HTMLTextAreaElement
) {
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

  await ax.post("/create", {
    word: DOMPurify.sanitize($word.value),
    meaning: DOMPurify.sanitize($meaning.value),
  });
  location.replace("index.html");
}

export { getWords, addWordCards, removeAllCards, createWord };

async function addClickListener(
  $like: HTMLElement,
  $dislike: HTMLElement,
  word_id: number
) {
  $like.addEventListener("click", async () => {
    const id = cards.get(word_id);
    if (id === 1) {
      $like.firstChild!.nodeValue =
        (Number($like.firstChild?.nodeValue) - 1).toString() + "\u00a0";
      cards.set(word_id, -1);
      await ax.put("/removevote", { word_id, vote: "like" });
    } else if (id === 0) {
      $like.firstChild!.nodeValue =
        (Number($like.firstChild?.nodeValue) + 1).toString() + "\u00a0";
      $dislike.firstChild!.nodeValue =
        (Number($dislike.firstChild?.nodeValue) - 1).toString() + "\u00a0";
      cards.set(word_id, 1);
      await ax.put("/vote", { word_id, vote: "like" });
    } else {
      $like.firstChild!.nodeValue =
        (Number($like.firstChild?.nodeValue) + 1).toString() + "\u00a0";
      cards.set(word_id, 1);
      (await ax.put("/vote", { word_id, vote: "like" })) + "\u00a0";
    }
    setImage($like, $dislike, word_id);
  });

  $dislike.addEventListener("click", async () => {
    const id = cards.get(word_id);
    if (id === 1) {
      $like.firstChild!.nodeValue =
        (Number($like.firstChild?.nodeValue) - 1).toString() + "\u00a0";
      $dislike.firstChild!.nodeValue =
        (Number($dislike.firstChild?.nodeValue) + 1).toString() + "\u00a0";
      cards.set(word_id, 0);
      await ax.put("/vote", { word_id, vote: "dislike" });
    } else if (id === 0) {
      $dislike.firstChild!.nodeValue =
        (Number($dislike.firstChild?.nodeValue) - 1).toString() + "\u00a0";
      cards.set(word_id, -1);
      await ax.put("/removevote", { word_id, vote: "dislike" });
    } else {
      $dislike.firstChild!.nodeValue =
        (Number($dislike.firstChild?.nodeValue) + 1).toString() + "\u00a0";
      cards.set(word_id, 0);
      await ax.put("/vote", { word_id, vote: "dislike" });
    }
    setImage($like, $dislike, word_id);
  });
}

function setImage($like: HTMLElement, $dislike: HTMLElement, word_id: number) {
  const id = cards.get(word_id);
  const $likeImage = $like.querySelector("img");
  const $dislikeImage = $dislike.querySelector("img");
  if (id === 1) {
    $likeImage?.setAttribute("src", t_u_f);
    $dislikeImage?.setAttribute("src", t_d);
  } else if (id === 0) {
    $likeImage?.setAttribute("src", t_u);
    $dislikeImage?.setAttribute("src", t_d_f);
  } else {
    $likeImage?.setAttribute("src", t_u);
    $dislikeImage?.setAttribute("src", t_d);
  }
}
