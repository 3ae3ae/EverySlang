import { Dialog } from "./dialog";
import { cleanURL } from "./utils";

const $dialog = new Dialog(
  () => {
    window.location.href = "index.html";
  },
  {
    title: "가입 실패",
    content:
      "탈퇴한 사용자는 일주일 간 재가입이 불가합니다. 메인 페이지로 이동합니다.",
    hasCancel: false,
  },
  () => {
    window.location.href = "index.html";
  }
);

cleanURL();

$dialog.showDialog();
