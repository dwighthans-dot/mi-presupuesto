import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of ["index.html", "manifest.json", "logo.png", "sw.js"]) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}

for (const dir of ["src", "cards"]) {
  fs.cpSync(path.join(root, dir), path.join(dist, dir), { recursive: true });
}

console.log("Mesada web build created in ./dist");
