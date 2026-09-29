import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "index.html",
  "logo.png",
  "manifest.json",
  "sw.js",
  "package.json",
  "package-lock.json",
  "capacitor.config.ts",
  "scripts/build-web.mjs",
  "src/web/app.js",
  "src/services/supabase.js",
  "android/settings.gradle",
  "android/app/build.gradle",
  "android/app/src/main/AndroidManifest.xml",
  "ios/App/App.xcodeproj/project.pbxproj",
  "ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json"
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length) {
  console.error("V12 verification failed. Missing:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));
const config = fs.readFileSync(path.join(root, "capacitor.config.ts"), "utf8");
const buildScript = fs.readFileSync(path.join(root, "scripts/build-web.mjs"), "utf8");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const androidBuild = fs.readFileSync(path.join(root, "android/app/build.gradle"), "utf8");
const androidManifest = fs.readFileSync(path.join(root, "android/app/src/main/AndroidManifest.xml"), "utf8");
const iosProject = fs.readFileSync(path.join(root, "ios/App/App.xcodeproj/project.pbxproj"), "utf8");
const iconCatalog = fs.readFileSync(
  path.join(root, "ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json"),
  "utf8"
);

const checks = [
  [pkg.name === "mesada", "package name is Mesada"],
  [pkg.version === "12.24.0", "package version is 12.24.0"],
  [lock.name === "mesada", "lockfile package name"],
  [lock.version === "12.24.0", "lockfile root version"],
  [lock.packages?.[""]?.version === "12.24.0", "lockfile package version"],
  [pkg.dependencies?.["@capacitor/android"], "Capacitor Android dependency"],
  [pkg.dependencies?.["@capacitor/ios"], "Capacitor iOS dependency"],
  [pkg.dependencies?.["@supabase/supabase-js"], "Supabase dependency"],
  [config.includes("appId: 'com.mesada.app'"), "Mesada appId"],
  [config.includes("appName: 'Mesada'"), "Mesada appName"],
  [config.includes("webDir: 'dist'"), "Capacitor dist webDir"],
  [buildScript.includes('outfile: "dist/app.bundle.js"'), "web bundle output"],
  [buildScript.includes('entryPoints: ["src/web/app.js"]'), "web bundle entry point"],
  [sw.includes('const CACHE="mesada-v12.24";'), "service worker cache version"],
  [androidBuild.includes('applicationId "com.mesada.app"'), "Android applicationId"],
  [androidManifest.includes('android:icon="@mipmap/ic_launcher"'), "Android launcher icon"],
  [androidManifest.includes('android:roundIcon="@mipmap/ic_launcher_round"'), "Android round launcher icon"],
  [iosProject.includes("PRODUCT_BUNDLE_IDENTIFIER = com.mesada.app;"), "iOS bundle identifier"],
  [iosProject.includes("ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;"), "iOS AppIcon catalog"],
  [iconCatalog.includes('"images"'), "iOS AppIcon catalog content"]
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("V12.24 verification failed:");
  for (const [, label] of failed) console.error(`- ${label}`);
  process.exit(1);
}

console.log("V12.24 verification passed.");
console.log("Web, Android and iOS project structure detected.");
console.log("Mesada identifiers, launcher icons, build chain and cache version verified.");
console.log("No Supabase schema changes are required for this verification.");
