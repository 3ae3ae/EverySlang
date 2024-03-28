import "./pico-main/css/pico.min.css";
import { getWords, addWordCards, removeAllCards } from "./service";

const $input: HTMLInputElement = document.getElementById(
  "search"
) as HTMLInputElement;

$input?.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const words = await getWords($input.value, 0);
    addWordCards(words[0]);
  } else if (e.key === "8") {
    removeAllCards();
  } else console.log(e.key);
});
