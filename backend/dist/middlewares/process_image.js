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

// src/middlewares/process_image.ts
var process_image_exports = {};
__export(process_image_exports, {
  processImage: () => processImage
});
module.exports = __toCommonJS(process_image_exports);
var import_sharp = __toESM(require("sharp"));
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));

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

// src/middlewares/process_image.ts
var processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const uploadDir = import_path.default.resolve(__dirname, "..", "..", "uploads", "products");
  const inputPath = req.file.path;
  const date = /* @__PURE__ */ new Date();
  const outputFilename = `optimized-${date.getTime()}-${req.file.filename}`;
  const outputPath = import_path.default.join(uploadDir, outputFilename);
  try {
    await (0, import_sharp.default)(inputPath).resize(800, 800, {
      fit: "inside",
      withoutEnlargement: true
    }).jpeg({ quality: 80 }).toFile(outputPath);
    const stats = import_fs.default.statSync(outputPath);
    const fileSizeInKB = stats.size / 1024;
    if (fileSizeInKB > 100) {
      await (0, import_sharp.default)(inputPath).resize(600, 600, {
        fit: "inside",
        withoutEnlargement: true
      }).jpeg({ quality: 60 }).toFile(outputPath);
      const newStats = import_fs.default.statSync(outputPath);
      const newFileSizeInKB = newStats.size / 1024;
      if (newFileSizeInKB > 100) {
        import_fs.default.unlinkSync(inputPath);
        import_fs.default.unlinkSync(outputPath);
        return next(
          new BadRequestException(
            "Image is too large even after compression. Please upload a smaller image.",
            400 /* VALIDATION_ERROR */
          )
        );
      }
    }
    import_fs.default.unlinkSync(inputPath);
    req.file.filename = outputFilename;
    req.file.path = outputPath;
    req.file.size = import_fs.default.statSync(outputPath).size;
    next();
  } catch (error) {
    console.error("[processImage] Failed:", error);
    if (import_fs.default.existsSync(inputPath)) {
      import_fs.default.unlinkSync(inputPath);
    }
    if (import_fs.default.existsSync(outputPath)) {
      import_fs.default.unlinkSync(outputPath);
    }
    next(
      new BadRequestException(
        "Failed to process image",
        500 /* SYSTEM_ERROR */
      )
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  processImage
});
