import { registerMember, validateNickname, showDialog } from "./service";

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

const $dialogConfirmButton = document.getElementById(
  "confirm"
) as HTMLButtonElement;
const $dialogCancelButton = document.getElementById(
  "cancel"
) as HTMLButtonElement;

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
    showDialog(true, $dialog);
  } else {
    showDialog(false, $dialog);
  }
});

$dialogCancelButton.addEventListener("click", async (e) => {
  e.preventDefault();
  $dialog.setAttribute("open", "false");
});
$dialogConfirmButton.addEventListener("click", async (e) => {
  e.preventDefault();
  $dialog.setAttribute("open", "false");
});
