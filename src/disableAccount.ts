import { Dialog } from "./dialog";
import { cleanURL } from "./utils";
import { disableAccount } from "./service";

const $fail = new Dialog(
  () => {
    window.location.href = "logout.html";
  },
  {
    title: "회원 탈퇴 중 오류가 발생하였습니다.",
    content:
      "오류가 계속되면 사이트 관리자에게 문의하시길 바랍니다. 메인페이지로 이동합니다.",
    hasCancel: false,
  }
);

const $complete = new Dialog(
  () => {
    window.location.href = "logout.html";
  },
  {
    title: "회원 탈퇴가 완료되었습니다.",
    content: "메인페이지로 이동합니다.",
    hasCancel: false,
  }
);

const $delete = new Dialog(
  async () => {
    const result = await disableAccount();
    await setTimeout(() => {
      $delete.closeDialog();
    }, 500);
    if (result) {
      $complete.showDialog();
    } else {
      $fail.showDialog();
    }
  },
  {
    title: "정말로 탈퇴하시겠습니까?",
    content:
      "게시한 단어는 자동으로 삭제되지 않으며, 탈퇴 시 일주일 동안 재가입이 불가합니다.",
    hasCancel: true,
  },
  () => {
    window.location.href = "index.html";
  }
);

cleanURL();

$delete.showDialog();
