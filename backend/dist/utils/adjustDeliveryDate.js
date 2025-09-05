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

// src/utils/adjustDeliveryDate.ts
var adjustDeliveryDate_exports = {};
__export(adjustDeliveryDate_exports, {
  adjustDeliveryDate: () => adjustDeliveryDate
});
module.exports = __toCommonJS(adjustDeliveryDate_exports);
var import_moment_timezone = __toESM(require("moment-timezone"));
function adjustDeliveryDate(deliveryDate, format = "DD-MM") {
  const now = (0, import_moment_timezone.default)().tz("America/Sao_Paulo");
  const currentYear = now.year();
  const currentMonth = now.month();
  let date = import_moment_timezone.default.tz(`${deliveryDate}-${currentYear}`, `${format}-YYYY`, "America/Sao_Paulo");
  if (!date.isValid()) {
    throw new Error(`Data inv\xE1lida: ${deliveryDate}`);
  }
  if (date.month() < currentMonth) {
    date = date.add(1, "year");
  }
  return date.format("YYYY-MM-DD");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  adjustDeliveryDate
});
