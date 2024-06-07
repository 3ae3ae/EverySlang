import { Dialog } from "./dialog";
import { cleanURL } from "./utils";

const $dialog = new Dialog(
  () => {
    window.location.href = "login.html";
  },
  {
    title: "로그인이 필요한 서비스입니다.",
    content: "로그인 페이지로 이동합니다.",
    hasCancel: false,
  },
  () => {
    window.location.href = "login.html";
  }
);

cleanURL();

$dialog.showDialog();
