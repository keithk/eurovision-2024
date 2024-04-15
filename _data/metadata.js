import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

export default {
  title: "keith.is | Eurovision 2024",
  description: "" || pkg.description,
  language: "en",
  tracking: true // Disable this if you're not me lol
};
