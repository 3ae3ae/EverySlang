import axios from "axios";
import { wordDto } from "./model";

const BaseUrl = "http://localhost:3000";
const ax = axios.create({ baseURL: BaseUrl });
const cards: HTMLElement[] = [];

async function getWords(keyword: String, page: Number) {
  const wordPerPage = 10;
  const { data } = await ax.get("/search", { params: { keyword, page } });
  if ([...data].length < wordPerPage) {
    return [data, "end"];
  } else {
    return [data, "notEnd"];
  }
}

async function addWordCards(words: wordDto[]) {
  const $frag = new DocumentFragment();
  for (const w of words) {
    const $card = document.createElement("article");
    $card.innerHTML = `<header>${w.word}</header>
        <body>
          ${w.meaning}
        </body>`;
    $frag.appendChild($card);
    cards.push($card);
  }
  const $div = document.getElementById("cards");
  $div?.appendChild($frag);
}

function removeAllCards() {
  const $div = document.getElementById("cards")!;
  // $div.textContent = "";
  // $div.setAttribute("aria-busy", "false");
}

export { getWords, addWordCards, removeAllCards };
