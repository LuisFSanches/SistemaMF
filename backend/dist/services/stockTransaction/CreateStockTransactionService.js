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

// src/services/stockTransaction/CreateStockTransactionService.ts
var CreateStockTransactionService_exports = {};
__export(CreateStockTransactionService_exports, {
  CreateStockTransactionService: () => CreateStockTransactionService
});
module.exports = __toCommonJS(CreateStockTransactionService_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/stockTransaction/CreateStockTransactionService.ts
var import_moment_timezone = __toESM(require("moment-timezone"));

// src/exceptions/root.ts
var HttpException = class extends Error {
  constructor(message, errorCode, statusCode, errors) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
};

// src/exceptions/bad-request.ts
var BadRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
};

// src/services/stockTransaction/CreateStockTransactionService.ts
var CreateStockTransactionService = class {
  async execute({ product_id, supplier, unity, quantity, unity_price, purchased_date, total_price }) {
    try {
      const formattedPurchasedDate = import_moment_timezone.default.utc(purchased_date).tz("America/Sao_Paulo", true).set({ hour: 12, minute: 0, second: 0 }).toDate();
      let supplierRecord = await prisma_default.supplier.findFirst({
        where: { name: supplier.trim() }
      });
      if (!supplierRecord) {
        supplierRecord = await prisma_default.supplier.create({
          data: { name: supplier.trim() }
        });
      }
      const transaction = await prisma_default.stockTransaction.create({
        data: {
          product_id,
          supplier,
          // Manter para compatibilidade (deprecated)
          supplier_id: supplierRecord.id,
          // Nova referência
          unity,
          quantity,
          unity_price,
          total_price,
          purchased_date: formattedPurchasedDate
        },
        include: {
          product: true,
          supplierRelation: true
        }
      });
      return transaction;
    } catch (error) {
      console.error("[CreateStockTransactionService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateStockTransactionService
});
