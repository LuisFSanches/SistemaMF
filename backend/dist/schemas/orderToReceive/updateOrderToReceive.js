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

// src/schemas/orderToReceive/updateOrderToReceive.ts
var updateOrderToReceive_exports = {};
__export(updateOrderToReceive_exports, {
  updateOrderToReceiveSchema: () => updateOrderToReceiveSchema
});
module.exports = __toCommonJS(updateOrderToReceive_exports);
var import_zod = require("zod");
var updateOrderToReceiveSchema = import_zod.z.object({
  payment_due_date: import_zod.z.string().datetime("payment_due_date must be a valid datetime").optional(),
  received_date: import_zod.z.string().datetime("received_date must be a valid datetime").optional(),
  type: import_zod.z.string().nonempty("type cannot be empty").optional(),
  is_archived: import_zod.z.boolean().optional()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateOrderToReceiveSchema
});
