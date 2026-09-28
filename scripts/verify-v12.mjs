import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "index.html",
  "logo.png",
  "manifest.json",
  "capacitor.config.ts",
  "scripts/build-web.mjs",
  "src/web/app.js",
  "src/services/supabase.js",
  "android/settings.gradle",
  "ios/App/App.xcodeproj/project.pbxproj"
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length) {
  console.error("V12 verification failed. Missing:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const config = fs.readFileSync(path.join(root, "capacitor.config.ts"), "utf8");

const checks = [
  [pkg.name === "mesada", "package name is Mesada"],
  [pkg.version === "12.23.0", "package version is 12.23.0"],
  [pkg.dependencies?.["@capacitor/android"], "Capacitor Android dependency"],
  [pkg.dependencies?.["@capacitor/ios"], "Capacitor iOS dependency"],
  [pkg.dependencies?.["@supabase/supabase-js"], "Supabase dependency"],
  [config.includes("appId: 'com.mesada.app'"), "Mesada appId"],
  [config.includes("appName: 'Mesada'"), "Mesada appName"],
  [config.includes("webDir: 'dist'"), "Capacitor dist webDir"]
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("V12 verification failed:");
  for (const [, label] of failed) console.error(`- ${label}`);
  process.exit(1);
}

console.log("V12.23 verification passed.");
console.log("Web, Android and iOS project structure detected.");
console.log("No Supabase schema changes are required for this verification.");
