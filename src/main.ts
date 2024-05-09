import { getWords, addWordCards, removeAllCards } from "./service";
import DOMPurify from "dompurify";

let canScrolling = true;

const $input: HTMLInputElement = document.querySelector(
  "#search input"
) as HTMLInputElement;

const $searchButton: HTMLButtonElement = document.querySelector(
  "#search button"
) as HTMLButtonElement;

const $div = document.getElementById("cards");
let page = 0;

async function getAndAddWordCards(page: number) {
  const data = await getWords(DOMPurify.sanitize($input.value), page, $div!);
  addWordCards(data[0], $div!);
  if (data[1] === "end") return -1;
  return ++page;
}

$input?.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    removeAllCards($div!);
    page = 0;
    page = await getAndAddWordCards(page);
  }
});

$searchButton.addEventListener("click", async () => {
  canScrolling = false;
  window.scrollTo({ top: 0 });
  removeAllCards($div!);
  page = 0;
  page = await getAndAddWordCards(page);
  canScrolling = true;
});

window.addEventListener("scroll", async () => {
  if (canScrolling) {
    canScrolling = false;
    let fullHeight = document.documentElement.scrollHeight;
    let myHeight =
      document.documentElement.scrollTop +
      document.documentElement.clientHeight;
    let oneThirdScreen = document.documentElement.clientHeight / 3;
    if (fullHeight <= myHeight + oneThirdScreen) {
      if (page !== -1) {
        page = await getAndAddWordCards(page);
      }
    }
    canScrolling = true;
  }
});
