"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/controllers/inter/WebhookPixController.ts
var WebhookPixController_exports = {};
__export(WebhookPixController_exports, {
  WebhookPixController: () => WebhookPixController,
  eventEmitter: () => eventEmitter
});
module.exports = __toCommonJS(WebhookPixController_exports);
var import_events = require("events");
var eventEmitter = new import_events.EventEmitter();
var WebhookPixController = class {
  async handle(req, res) {
    console.log("AQUII");
    try {
      console.log("Notifica\xE7\xE3o Pix recebida:", req.body);
      const notification = req.body;
      eventEmitter.emit("pixReceived", notification);
      return res.json(notification);
    } catch (error) {
      console.error("Erro ao processar notifica\xE7\xE3o Pix:", error);
      return res.status(500).send("Erro ao processar notifica\xE7\xE3o");
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WebhookPixController,
  eventEmitter
});
