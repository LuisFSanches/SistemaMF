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

// src/controllers/product/UpdateProductController.ts
var UpdateProductController_exports = {};
__export(UpdateProductController_exports, {
  UpdateProductController: () => UpdateProductController
});
module.exports = __toCommonJS(UpdateProductController_exports);

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

// src/services/product/UpdateProductService.ts
var UpdateProductService = class {
  async execute({ id, name, price, unity, stock, enabled, image }) {
    try {
      let data = {
        name,
        price,
        unity,
        stock,
        enabled,
        image
      };
      const updatedProduct = await prisma_default.product.update({
        where: {
          id
        },
        data
      });
      return updatedProduct;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/product/UpdateProductController.ts
var UpdateProductController = class {
  async handle(req, res, next) {
    const { name, price, unity, stock, enabled, image } = req.body;
    const id = req.params.id;
    const updateProductService = new UpdateProductService();
    const admin = await updateProductService.execute({
      id,
      name,
      price,
      unity,
      stock,
      enabled,
      image
    });
    return res.json(admin);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateProductController
});
