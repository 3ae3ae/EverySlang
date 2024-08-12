import { getProfile, getNickname } from "./service";
import { cleanURL } from "./utils";

const [$user, $like, $dislike, $words, $name, $avatar] = [
  document.getElementById("user") as HTMLDivElement,
  document.getElementById("like") as HTMLDivElement,
  document.getElementById("dislike") as HTMLDivElement,
  document.getElementById("words") as HTMLUListElement,
  document.getElementById("name") as HTMLHeadingElement,
  document.getElementById('avatar') as HTMLDivElement,
];

const param = new URLSearchParams(window.location.search);
const name = param.get("username")!;

(async () => {
  await getNickname($user);
  
  await getProfile($like, $dislike, $words, $name, name, $avatar);
  
  cleanURL();
})();
