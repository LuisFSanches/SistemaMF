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

// src/services/aiIntegration/AIIntegrationService.ts
var AIIntegrationService_exports = {};
__export(AIIntegrationService_exports, {
  AIIntegrationService: () => AIIntegrationService
});
module.exports = __toCommonJS(AIIntegrationService_exports);
var import_openai = __toESM(require("openai"));
var AIIntegrationService = class {
  async execute(prompt, textContent) {
    try {
      const client = new import_openai.default({
        apiKey: process.env.APP_OPENAI_API_KEY
      });
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt
          },
          {
            role: "user",
            content: textContent
          }
        ],
        temperature: 0,
        response_format: { type: "json_object" }
      });
      const rawContent = response.choices[0].message.content;
      return JSON.parse(rawContent);
    } catch (error) {
      return { error: true, message: error.message, code: 500 /* SYSTEM_ERROR */ };
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AIIntegrationService
});
