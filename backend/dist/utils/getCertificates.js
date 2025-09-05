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

// src/utils/getCertificates.ts
var getCertificates_exports = {};
__export(getCertificates_exports, {
  getCertificates: () => getCertificates,
  getCertificatesForWebhook: () => getCertificatesForWebhook
});
module.exports = __toCommonJS(getCertificates_exports);
var import_https = __toESM(require("https"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var pathCerts = path.join(__dirname, "..", "certs");
var getCertificates = () => {
  const cert = process.env.BANCO_INTER_API_CERT_PATH.replace(/(^"|"$)/g, "");
  const key = process.env.BANCO_INTER_API_KEY_PATH.replace(/(^"|"$)/g, "");
  const httpsAgent = new import_https.default.Agent({
    host: "cdpj.partners.bancointer.com.br",
    cert: Buffer.from(cert, "utf-8"),
    key: Buffer.from(key, "utf-8"),
    rejectUnauthorized: true
  });
  return httpsAgent;
};
var getCertificatesForWebhook = () => {
  const cert = path.join(pathCerts, "cert.pem");
  const key = path.join(pathCerts, "key.pem");
  const ca = path.join(pathCerts, "ca.crt");
  const httpsOptions = {
    requestCert: true,
    rejectUnauthorized: false,
    cert: fs.readFileSync(cert),
    key: fs.readFileSync(key),
    ca: fs.readFileSync(ca)
  };
  return httpsOptions;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCertificates,
  getCertificatesForWebhook
});
