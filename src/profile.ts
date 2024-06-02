import { getProfile, getNickname } from "./service";

const [$login, $like, $dislike, $words, $message] = [
  document.getElementById("login") as HTMLAnchorElement,
  document.getElementById("like") as HTMLSpanElement,
  document.getElementById("dislike") as HTMLSpanElement,
  document.getElementById("words") as HTMLSpanElement,
  document.getElementById("message") as HTMLSpanElement,
];

getNickname($login);
getProfile($like, $dislike, $words, $message);
