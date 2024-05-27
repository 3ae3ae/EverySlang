import { showDialog, closeDialog } from "./service";

const $dialog = document.getElementsByTagName("dialog")[0] as HTMLDialogElement;
const $close = document.getElementById("close") as HTMLButtonElement;

const $document = document.documentElement;

const $dialogConfirmButton = document.getElementById(
  "confirm"
) as HTMLButtonElement;

$close.addEventListener("click", (e) => {
  closeDialog($dialog, $document, "login.html");
});

$dialogConfirmButton.addEventListener("click", (e) => {
  closeDialog($dialog, $document, "login.html");
});
