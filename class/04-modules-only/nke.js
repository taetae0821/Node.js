const createGreeting = require("./greeting");

const { add, multiply } = require("./caculator");

import { USER_PROFILES, USER_PROFLIE } from "./userPorfile.js";
const name = "나이키";

console.log(createGreeting(name));
console.log(add(1, 2));
console.log(add(3, 4));
USER_PROFILES.jaeyong.introduce();