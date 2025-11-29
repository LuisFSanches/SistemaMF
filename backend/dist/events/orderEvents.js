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

// src/events/orderEvents.ts
var orderEvents_exports = {};
__export(orderEvents_exports, {
  OrderEvents: () => OrderEvents,
  orderEmitter: () => orderEmitter
});
module.exports = __toCommonJS(orderEvents_exports);
var import_events = require("events");
var orderEmitter = new import_events.EventEmitter();
var OrderEvents = /* @__PURE__ */ ((OrderEvents2) => {
  OrderEvents2["WhatsappOrderReceived"] = "whatsappOrderReceived";
  OrderEvents2["StoreFrontOderReceived"] = "storeFrontOrderReceived";
  OrderEvents2["orderDelivered"] = "orderDelivered";
  return OrderEvents2;
})(OrderEvents || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OrderEvents,
  orderEmitter
});
