import { getProfile, getNickname } from "./service";
import { cleanURL } from "./utils";

const [$login, $like, $dislike, $words, $name] = [
  document.getElementById("user") as HTMLDivElement,
  document.getElementById("like") as HTMLSpanElement,
  document.getElementById("dislike") as HTMLSpanElement,
  document.getElementById("words") as HTMLSpanElement,
  document.getElementById("name") as HTMLSpanElement,
];

const param = new URLSearchParams(window.location.search);
const name = param.get("username")!;

(async function () {
  await getNickname($login);
  $name.textContent = name;
})();

getProfile($like, $dislike, $words, name);

cleanURL();
