import {
  registerMember,
  validateNickname,
  showDialog,
  closeDialog,
} from "./service";

const $duplicationButton: HTMLButtonElement = document.getElementById(
  "duplication check"
) as HTMLButtonElement;
const $nickname: HTMLInputElement = document.getElementById(
  "nickname"
) as HTMLInputElement;
const $buttonContent = $duplicationButton.getElementsByTagName(
  "span"
)[0] as HTMLSpanElement;
const $submit = document.getElementById("submit") as HTMLInputElement;
const $dialog = document.getElementsByTagName("dialog")[0] as HTMLDialogElement;
const $close = document.getElementById("close") as HTMLButtonElement;

const $document = document.documentElement;

const $dialogConfirmButton = document.getElementById(
  "confirm"
) as HTMLButtonElement;

$close.addEventListener("click", (e) => {
  closeDialog($dialog, $document, "index.html");
});

$dialogConfirmButton.addEventListener("click", (e) => {
  closeDialog($dialog, $document, "index.html");
});

$duplicationButton?.addEventListener("click", async (e) => {
  e.preventDefault();
  const name = $nickname.value;
  $duplicationButton.setAttribute("aria-busy", "true");
  const valid = await validateNickname(name);
  if (valid) {
    $duplicationButton.setAttribute("aria-busy", "false");
    $buttonContent.textContent = "✅ 사용 가능";
    $submit.disabled = false;
  } else {
    $duplicationButton.setAttribute("aria-busy", "false");
    $buttonContent.textContent = "❌ 사용 불가";
    $submit.disabled = true;
  }
});

$nickname.addEventListener("input", (_) => {
  $duplicationButton.setAttribute("aria-busy", "false");
  $buttonContent.textContent = "중복 확인";
  $submit.disabled = true;
});

$submit.addEventListener("click", async (e) => {
  e.preventDefault();
  if (await registerMember($nickname.value)) {
    showDialog(true, $dialog, $document);
  } else {
    showDialog(false, $dialog, $document);
  }
});

// $dialogCancelButton.addEventListener("click", async (e) => {
//   e.preventDefault();
//   $dialog.setAttribute("open", "false");
// });
// $dialogConfirmButton.addEventListener("click", async (e) => {
//   e.preventDefault();
//   $dialog.setAttribute("open", "false");
// });
