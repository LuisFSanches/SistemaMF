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

// src/controllers/supplier/CreateSupplierController.ts
var CreateSupplierController_exports = {};
__export(CreateSupplierController_exports, {
  CreateSupplierController: () => CreateSupplierController
});
module.exports = __toCommonJS(CreateSupplierController_exports);

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

// src/schemas/supplier/createSupplier.ts
var import_zod = require("zod");
var createSupplierSchema = import_zod.z.object({
  name: import_zod.z.string().nonempty("Supplier name is required").trim()
});

// src/exceptions/bad-request.ts
var BadRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
};

// src/services/supplier/CreateSupplierService.ts
var CreateSupplierService = class {
  async execute(data) {
    const parsed = createSupplierSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors[0].message,
        400 /* VALIDATION_ERROR */
      );
    }
    const existingSupplier = await prisma_default.supplier.findFirst({
      where: { name: parsed.data.name }
    });
    if (existingSupplier) {
      throw new BadRequestException(
        "Supplier already exists",
        400 /* USER_ALREADY_EXISTS */
      );
    }
    try {
      const supplier = await prisma_default.supplier.create({
        data: {
          name: parsed.data.name
        }
      });
      return supplier;
    } catch (error) {
      console.error("[CreateSupplierService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/supplier/CreateSupplierController.ts
var CreateSupplierController = class {
  async handle(req, res, next) {
    const { name } = req.body;
    const createSupplierService = new CreateSupplierService();
    const supplier = await createSupplierService.execute({
      name
    });
    return res.json(supplier);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateSupplierController
});
