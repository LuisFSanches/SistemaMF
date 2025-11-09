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

// src/config/multer.ts
var multer_exports = {};
__export(multer_exports, {
  upload: () => upload
});
module.exports = __toCommonJS(multer_exports);
var import_multer = __toESM(require("multer"));
var import_path2 = __toESM(require("path"));
var import_crypto = __toESM(require("crypto"));

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

// src/config/multer.ts
var storage = import_multer.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsUploadDir);
  },
  filename: (req, file, cb) => {
    const hash = import_crypto.default.randomBytes(16).toString("hex");
    const filename = `${hash}-${Date.now()}${import_path2.default.extname(file.originalname)}`;
    cb(null, filename);
  }
});
var fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException(
      "Invalid file type. Only JPEG, JPG, PNG and WEBP are allowed",
      400 /* VALIDATION_ERROR */
    ));
  }
};
var upload = (0, import_multer.default)({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024
    // 100KB
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  upload
});
