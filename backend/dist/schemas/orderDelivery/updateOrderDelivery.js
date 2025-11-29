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

// src/schemas/orderDelivery/updateOrderDelivery.ts
var updateOrderDelivery_exports = {};
__export(updateOrderDelivery_exports, {
  updateOrderDeliverySchema: () => updateOrderDeliverySchema
});
module.exports = __toCommonJS(updateOrderDelivery_exports);
var import_zod = require("zod");
var updateOrderDeliverySchema = import_zod.z.object({
  delivery_man_id: import_zod.z.string().uuid("delivery_man_id must be a valid UUID").optional(),
  delivery_date: import_zod.z.string().datetime("delivery_date must be a valid datetime").optional(),
  is_paid: import_zod.z.boolean().optional(),
  is_archived: import_zod.z.boolean().optional()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateOrderDeliverySchema
});
