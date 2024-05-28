import { closeDialog } from "./service";

const $dialog = document.getElementsByTagName("dialog")[0] as HTMLDialogElement;
const $close = document.getElementById("close") as HTMLButtonElement;

const $document = document.documentElement;

const $dialogConfirmButton = document.getElementById(
  "confirm"
) as HTMLButtonElement;

$dialog.showModal();

$close.addEventListener("click", (_) => {
  closeDialog($dialog, $document, "login.html");
});

$dialogConfirmButton.addEventListener("click", (_) => {
  closeDialog($dialog, $document, "login.html");
});
