import "./pico-main/css/pico.min.css";
import { getWords, addWordCards, removeAllCards } from "./service";

const $input: HTMLInputElement = document.querySelector(
  "#search input"
) as HTMLInputElement;

const $searchButton: HTMLButtonElement = document.querySelector(
  "#search button"
) as HTMLButtonElement;

const $div = document.getElementById("cards");
let page = 0;

async function getAndAddWordCards(page: number) {
  const data = await getWords($input.value, page, $div!);
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
  removeAllCards($div!);
  page = 0;
  page = await getAndAddWordCards(page);
});

window.addEventListener("scroll", async () => {
  let fullHeight = document.documentElement.scrollHeight;
  let myHeight =
    document.documentElement.scrollTop + document.documentElement.clientHeight;
  let halfScreen = document.documentElement.clientHeight;
  if (fullHeight <= myHeight + halfScreen) {
    if (page !== -1) {
      page = await getAndAddWordCards(page);
    }
  }
});
