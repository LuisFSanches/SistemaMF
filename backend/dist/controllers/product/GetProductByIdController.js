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

// src/controllers/product/GetProductByIdController.ts
var GetProductByIdController_exports = {};
__export(GetProductByIdController_exports, {
  GetProductByIdController: () => GetProductByIdController
});
module.exports = __toCommonJS(GetProductByIdController_exports);

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

// src/services/product/GetProductByIdService.ts
var GetProductByIdService = class {
  async execute({ id }) {
    try {
      const product = await prisma_default.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          price: true,
          unity: true,
          stock: true,
          enabled: true,
          image: true,
          qr_code: true,
          created_at: true,
          updated_at: true
        }
      });
      if (!product) {
        throw new BadRequestException(
          "Product not found",
          400 /* USER_NOT_FOUND */
        );
      }
      return product;
    } catch (error) {
      console.error("[GetProductByIdService] Failed:", error);
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

// src/controllers/product/GetProductByIdController.ts
var GetProductByIdController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const getProductByIdService = new GetProductByIdService();
    const product = await getProductByIdService.execute({ id });
    return res.json(product);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetProductByIdController
});
