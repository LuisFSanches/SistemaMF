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

// src/services/product/GenerateProductQRCodeService.ts
var GenerateProductQRCodeService_exports = {};
__export(GenerateProductQRCodeService_exports, {
  GenerateProductQRCodeService: () => GenerateProductQRCodeService
});
module.exports = __toCommonJS(GenerateProductQRCodeService_exports);
var import_qrcode = __toESM(require("qrcode"));

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

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

// src/services/product/GenerateProductQRCodeService.ts
var GenerateProductQRCodeService = class {
  async execute({ id }) {
    try {
      const product = await prisma_default.product.findUnique({
        where: { id }
      });
      if (!product) {
        throw new BadRequestException(
          "Product not found",
          400 /* USER_NOT_FOUND */
        );
      }
      const qrCodeDataURL = await import_qrcode.default.toDataURL(id, {
        errorCorrectionLevel: "M",
        type: "image/png",
        width: 300,
        margin: 1
      });
      const updatedProduct = await prisma_default.product.update({
        where: { id },
        data: { qr_code: qrCodeDataURL },
        select: {
          id: true,
          name: true,
          qr_code: true
        }
      });
      return updatedProduct;
    } catch (error) {
      console.error("[GenerateProductQRCodeService] Failed:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GenerateProductQRCodeService
});
