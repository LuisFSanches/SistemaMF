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

// src/schemas/address/createAddress.ts
var createAddress_exports = {};
__export(createAddress_exports, {
  createAddressSchema: () => createAddressSchema
});
module.exports = __toCommonJS(createAddress_exports);
var import_zod = require("zod");
var createAddressSchema = import_zod.z.object({
  client_id: import_zod.z.string().nonempty("client_id is required"),
  street: import_zod.z.string().nonempty("street is required"),
  street_number: import_zod.z.string().nonempty("street_number is required"),
  complement: import_zod.z.string().optional(),
  reference_point: import_zod.z.string().optional(),
  neighborhood: import_zod.z.string().nonempty("neighborhood is required"),
  city: import_zod.z.string().nonempty("city is required"),
  state: import_zod.z.string().nonempty("state is required"),
  postal_code: import_zod.z.string().optional(),
  country: import_zod.z.string().nonempty("country is required")
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createAddressSchema
});
