// The rules from the page itself (movingday/index.html, movingRules), for the simulated players in Node.
const fs = require("fs"), path = require("path");
const page = fs.readFileSync(path.join(__dirname, "..", "..", "movingday", "index.html"), "utf8");
const start = page.indexOf("function movingRules() {"), end = page.indexOf("\n}\n", start) + 2;
module.exports = new Function(page.slice(start, end) + "\nreturn movingRules;")();
