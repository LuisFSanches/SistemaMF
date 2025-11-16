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

// src/controllers/product/DeleteProductImageController.ts
var DeleteProductImageController_exports = {};
__export(DeleteProductImageController_exports, {
  DeleteProductImageController: () => DeleteProductImageController
});
module.exports = __toCommonJS(DeleteProductImageController_exports);

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

// src/services/product/DeleteProductImageService.ts
var import_fs2 = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));

// src/config/paths.ts
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
function findProjectRoot(startPath) {
  let currentPath = startPath;
  while (currentPath !== "/") {
    const packageJsonPath = import_path.default.join(currentPath, "package.json");
    if (import_fs.default.existsSync(packageJsonPath)) {
      return currentPath;
    }
    currentPath = import_path.default.dirname(currentPath);
  }
  return import_path.default.resolve(startPath, "..", "..");
}
var isCompiled = __dirname.includes("/dist/");
var rootDir = findProjectRoot(__dirname);
var uploadsDir = import_path.default.join(rootDir, "uploads");
var productsUploadDir = import_path.default.join(uploadsDir, "products");
if (!import_fs.default.existsSync(uploadsDir)) {
  import_fs.default.mkdirSync(uploadsDir, { recursive: true });
  console.log("[Paths] Created uploads directory:", uploadsDir);
}
if (!import_fs.default.existsSync(productsUploadDir)) {
  import_fs.default.mkdirSync(productsUploadDir, { recursive: true });
  console.log("[Paths] Created products upload directory:", productsUploadDir);
}

// src/services/product/DeleteProductImageService.ts
var DeleteProductImageService = class {
  async execute({ product_id }) {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3334";
    const product = await prisma_default.product.findFirst({
      where: { id: product_id }
    });
    if (!product) {
      throw new BadRequestException(
        "Product not found",
        400 /* USER_NOT_FOUND */
      );
    }
    if (!product.image) {
      throw new BadRequestException(
        "Product has no image to delete",
        404 /* BAD_REQUEST */
      );
    }
    const imagePath = product.image.replace(`${backendUrl}/uploads/products/`, "");
    const filePath = import_path2.default.join(productsUploadDir, imagePath);
    if (import_fs2.default.existsSync(filePath)) {
      import_fs2.default.unlinkSync(filePath);
    } else {
    }
    try {
      const updatedProduct = await prisma_default.product.update({
        where: { id: product_id },
        data: { image: null }
      });
      return updatedProduct;
    } catch (error) {
      console.error("[DeleteProductImageService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/product/DeleteProductImageController.ts
var DeleteProductImageController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const deleteProductImageService = new DeleteProductImageService();
    const product = await deleteProductImageService.execute({
      product_id: id
    });
    return res.json(product);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeleteProductImageController
});
