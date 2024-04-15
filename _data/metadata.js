import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

export default {
  // Feel free to override these, they are pulling from package.json for default values.
  title: "keith.is | Eurovision 2024",
  description: "" || pkg.description,
  language: "en"
};
