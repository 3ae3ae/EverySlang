import { getProfile, getNickname } from "./service";
import { cleanURL } from "./utils";

const [$login, $like, $dislike, $words, $name] = [
  document.getElementById("login") as HTMLAnchorElement,
  document.getElementById("like") as HTMLSpanElement,
  document.getElementById("dislike") as HTMLSpanElement,
  document.getElementById("words") as HTMLSpanElement,
  document.getElementById("name") as HTMLSpanElement,
];

(async function () {
  const name = await getNickname($login);
  $name.textContent = name;
})();
const param = new URLSearchParams(window.location.search);
const name = param.get("username")!;
getProfile($like, $dislike, $words, name);

cleanURL();
