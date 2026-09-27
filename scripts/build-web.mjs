import fs from "node:fs";
import path from "node:path";
import { build } from "esbuild";

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

await build({
  entryPoints: ["src/web/app.js"],
  outfile: "dist/app.bundle.js",
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "esnext",
  sourcemap: false,
  minify: false
});

console.log("Mesada web build created in ./dist");
console.log("Mesada app bundle created in ./dist/app.bundle.js");
