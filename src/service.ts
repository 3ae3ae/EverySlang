import axios from "axios";
import { wordDto } from "./model";
import { flex_between, wrapImage, wrapWith } from "./elements";
import t_u_f from "./thumb_up_FILL.svg";
import t_u from "./thumb_up.svg";
import t_d from "./thumb_down.svg";
import t_d_f from "./thumb_down_FILL.svg";

const BaseUrl = "http://localhost:3000";
const ax = axios.create({ baseURL: BaseUrl });
const cards: HTMLElement[] = [];

const wrapWithHeader = (text: String) => wrapWith("header", text);
const wrapWithSpan = (text: String) => wrapWith("span", text);
const wrapWithDiv = (text: String) => wrapWith("div", text);

function makeHeader(w: wordDto) {
  const word = wrapWithSpan(w.word);
  const likeImage = wrapImage(w.isLike === "1" ? t_u_f : t_u);
  const dislikeImage = wrapImage(w.isLike === "0" ? t_d_f : t_d);
  const like = wrapWithSpan(w.like_amount + "&nbsp;" + likeImage);
  const dislike = wrapWithSpan(w.dislike_amount + "&nbsp;" + dislikeImage);
  const vote = wrapWithDiv(like + "&nbsp;&nbsp;" + dislike);
  const flex = flex_between(word, vote);
  return wrapWithHeader(flex);
}

async function getWords(keyword: String, page: Number, $div: HTMLElement) {
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
    $card.innerHTML = `${makeHeader(w)}
        <body>
          ${w.meaning}
        </body>`;
    $frag.appendChild($card);
    cards.push($card);
  }
  $div.appendChild($frag);
}

async function removeAllCards($div: HTMLElement) {
  $div.replaceChildren();
}

export { getWords, addWordCards, removeAllCards };
