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

// src/schemas/deliveryMan/createDeliveryMan.ts
var createDeliveryMan_exports = {};
__export(createDeliveryMan_exports, {
  createDeliveryManSchema: () => createDeliveryManSchema
});
module.exports = __toCommonJS(createDeliveryMan_exports);
var import_zod = require("zod");
var createDeliveryManSchema = import_zod.z.object({
  name: import_zod.z.string().nonempty("name is required"),
  phone_number: import_zod.z.string().nonempty("phone_number is required")
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createDeliveryManSchema
});
