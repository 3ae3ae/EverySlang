import "./pico-main/css/pico.min.css";
import { createWord } from "./service";
const $form: HTMLFormElement = document.getElementById(
  "createWord"
) as HTMLFormElement;

const $word = document.getElementById("word") as HTMLInputElement;
const $meaning = document.getElementById("meaning") as HTMLTextAreaElement;

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await createWord($word, $meaning);
});
