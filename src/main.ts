import { getWords, addWordCards, removeAllCards, getNickname } from "./service";
import DOMPurify from "dompurify";
import { cleanURL } from "./utils";

let canScrolling = true;

const $input: HTMLInputElement = document.getElementById(
  "search"
) as HTMLInputElement;

const $searchButton: HTMLButtonElement = document.getElementById(
  "search-button"
) as HTMLButtonElement;

const $user: HTMLDivElement = document.getElementById("user") as HTMLDivElement;

const $addWordButton: HTMLButtonElement = document.getElementById(
  "add"
) as HTMLButtonElement;

getNickname($user);
const $div = document.getElementById("cards");
let page = 0;

async function getAndAddWordCards(page: number) {
  const data = await getWords(DOMPurify.sanitize($input.value), page, $div!);
  addWordCards(data[0], $div!);
  if (data[1] === "end") return -1;
  return ++page;
}

async function render() {
  cleanURL();
  const path = window.location.pathname;
  removeAllCards($div!);
  $input.value = path.slice(1);
  page = 0;
  page = await getAndAddWordCards(page);
}

window.addEventListener("popstate", async (_) => {
  render();
});

$input?.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    removeAllCards($div!);
    history.pushState(null, "", "/" + $input.value);
    page = 0;
    page = await getAndAddWordCards(page);
  }
});

$searchButton.addEventListener("click", async () => {
  canScrolling = false;
  window.scrollTo({ top: 0 });
  removeAllCards($div!);
  history.pushState(null, "", "/" + $input.value);
  page = 0;
  page = await getAndAddWordCards(page);
  canScrolling = true;
});

$addWordButton.addEventListener("click", () => {
  window.location.href = "createWord.html";
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
render();
