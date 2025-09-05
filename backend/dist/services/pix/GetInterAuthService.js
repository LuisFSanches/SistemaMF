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

// src/services/pix/GetInterAuthService.ts
var GetInterAuthService_exports = {};
__export(GetInterAuthService_exports, {
  GetInterAuthService: () => GetInterAuthService
});
module.exports = __toCommonJS(GetInterAuthService_exports);
var import_axios = __toESM(require("axios"));
var _GetInterAuthService = class _GetInterAuthService {
  async execute({ httpsAgent }) {
    const now = Date.now();
    if (_GetInterAuthService.token && now < _GetInterAuthService.tokenExpiresAt) {
      return _GetInterAuthService.token;
    }
    try {
      const url = `https://cdpj.partners.bancointer.com.br/oauth/v2/token`;
      const params = new URLSearchParams();
      params.append("client_id", process.env.BANCO_INTER_CLIENT_ID);
      params.append("client_secret", process.env.BANCO_INTER_CLIENT_SECRET);
      params.append("grant_type", "client_credentials");
      params.append("scope", "webhook.write webhook.read webhook-banking.write webhook-banking.read cob.write extrato.read");
      const response = await import_axios.default.post(url, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        httpsAgent
      });
      _GetInterAuthService.token = response.data.access_token;
      _GetInterAuthService.tokenExpiresAt = now + 55 * 60 * 1e3;
      return _GetInterAuthService.token;
    } catch (error) {
      console.error("Error fetching access token:", error.response?.data || error.message);
      throw new Error("Failed to fetch access token");
    }
  }
};
_GetInterAuthService.token = null;
_GetInterAuthService.tokenExpiresAt = 0;
var GetInterAuthService = _GetInterAuthService;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetInterAuthService
});
