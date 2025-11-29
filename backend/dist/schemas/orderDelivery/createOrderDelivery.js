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

// src/schemas/orderDelivery/createOrderDelivery.ts
var createOrderDelivery_exports = {};
__export(createOrderDelivery_exports, {
  createOrderDeliverySchema: () => createOrderDeliverySchema
});
module.exports = __toCommonJS(createOrderDelivery_exports);
var import_zod = require("zod");
var createOrderDeliverySchema = import_zod.z.object({
  order_id: import_zod.z.string().uuid("order_id must be a valid UUID"),
  delivery_man_id: import_zod.z.string().uuid("delivery_man_id must be a valid UUID"),
  delivery_date: import_zod.z.string().datetime("delivery_date must be a valid datetime"),
  is_paid: import_zod.z.boolean().optional(),
  is_archived: import_zod.z.boolean().optional()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createOrderDeliverySchema
});
