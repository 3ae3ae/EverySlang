import { registerMember, validateNickname } from "./service";
import { Dialog } from "./dialog";
import { cleanURL } from "./utils";

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

const $document = document.documentElement;

const limit = (name: string) => /^[a-z\d]{3,10}$/g.test(name);

const $trueDialog = new Dialog(
  () => {
    window.location.href = "index.html";
  },
  {
    hasCancel: false,
    content: "메인 페이지로 이동합니다.",
    title: "닉네임 저장에 성공했습니다.",
  },
  () => {
    window.location.href = "index.html";
  }
);
const $falseDialog = new Dialog(
  () => {
    window.location.href = "index.html";
  },
  {
    hasCancel: false,
    content: "메인 페이지로 이동합니다.",
    title: "닉네임 저장 중 오류가 발생했습니다.",
  },
  () => {
    window.location.href = "index.html";
  }
);

$document.addEventListener("keydown", (_) => {
  $duplicationButton.disabled = !limit($nickname.value);
});

$document.addEventListener("click", (_) => {
  $duplicationButton.disabled = !limit($nickname.value);
});

$nickname.addEventListener("input", (_) => {
  $duplicationButton.disabled = !limit($nickname.value);
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
    $trueDialog.showDialog();
  } else {
    $falseDialog.showDialog();
  }
});

cleanURL();
