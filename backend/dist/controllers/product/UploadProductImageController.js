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

// src/controllers/product/UploadProductImageController.ts
var UploadProductImageController_exports = {};
__export(UploadProductImageController_exports, {
  UploadProductImageController: () => UploadProductImageController
});
module.exports = __toCommonJS(UploadProductImageController_exports);

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

// src/services/product/UploadProductImageService.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var UploadProductImageService = class {
  async execute({ product_id, filename }) {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3334";
    console.log("Backend URL:", backendUrl);
    const product = await prisma_default.product.findFirst({
      where: { id: product_id }
    });
    if (!product) {
      const uploadDir = import_path.default.resolve(__dirname, "..", "..", "..", "uploads", "products");
      const filePath = import_path.default.join(uploadDir, filename);
      if (import_fs.default.existsSync(filePath)) {
        import_fs.default.unlinkSync(filePath);
      }
      throw new BadRequestException(
        "Product not found",
        400 /* USER_NOT_FOUND */
      );
    }
    console.log("chegou aqui");
    if (product.image) {
      const oldImagePath = product.image.replace(`${backendUrl}/uploads/products/`, "");
      const uploadDir = import_path.default.resolve(__dirname, "..", "..", "..", "uploads", "products");
      const oldFilePath = import_path.default.join(uploadDir, oldImagePath);
      if (import_fs.default.existsSync(oldFilePath)) {
        import_fs.default.unlinkSync(oldFilePath);
      }
    }
    const imageUrl = `${backendUrl}/uploads/products/${filename}`;
    console.log("New image URL:", imageUrl);
    try {
      const updatedProduct = await prisma_default.product.update({
        where: { id: product_id },
        data: { image: imageUrl }
      });
      return updatedProduct;
    } catch (error) {
      console.log("[UploadProductImageService] Failed to update product image:", error);
      console.error("[UploadProductImageService] Failed:", error);
      const uploadDir = import_path.default.resolve(__dirname, "..", "..", "..", "uploads", "products");
      const filePath = import_path.default.join(uploadDir, filename);
      if (import_fs.default.existsSync(filePath)) {
        import_fs.default.unlinkSync(filePath);
      }
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/product/UploadProductImageController.ts
var UploadProductImageController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    if (!req.file) {
      throw new BadRequestException(
        "No image file provided",
        400 /* VALIDATION_ERROR */
      );
    }
    const uploadProductImageService = new UploadProductImageService();
    const product = await uploadProductImageService.execute({
      product_id: id,
      filename: req.file.filename
    });
    console.log("Uploaded product image:", product);
    return res.json(product);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UploadProductImageController
});
