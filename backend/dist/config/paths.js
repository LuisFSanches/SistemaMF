"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/config/paths.ts
var paths_exports = {};
__export(paths_exports, {
  productsUploadDir: () => productsUploadDir,
  rootDir: () => rootDir,
  uploadsDir: () => uploadsDir
});
module.exports = __toCommonJS(paths_exports);
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var isDevelopment = process.env.NODE_ENV !== "production";
var isCompiled = __dirname.includes("/dist/");
var rootDir = isCompiled ? import_path.default.resolve(__dirname, "..", "..") : import_path.default.resolve(__dirname, "..", "..");
var uploadsDir = import_path.default.join(rootDir, "uploads");
var productsUploadDir = import_path.default.join(uploadsDir, "products");
if (!import_fs.default.existsSync(uploadsDir)) {
  import_fs.default.mkdirSync(uploadsDir, { recursive: true });
  console.log("[Paths] Created uploads directory:", uploadsDir);
}
if (!import_fs.default.existsSync(productsUploadDir)) {
  import_fs.default.mkdirSync(productsUploadDir, { recursive: true });
  console.log("[Paths] Created products upload directory:", productsUploadDir);
}
console.log("[Paths] Root directory:", rootDir);
console.log("[Paths] Products upload directory:", productsUploadDir);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  productsUploadDir,
  rootDir,
  uploadsDir
});
