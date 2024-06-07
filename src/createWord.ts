import { createWord } from "./service";
import { cleanURL } from "./utils";
const $form: HTMLFormElement = document.getElementById(
  "createWord"
) as HTMLFormElement;

// const $word = document.getElementById("word") as HTMLInputElement;
// const $meaning = document.getElementById("meaning") as HTMLTextAreaElement;

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await createWord($form);
});
cleanURL();
