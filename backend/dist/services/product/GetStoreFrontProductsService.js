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

// src/services/product/GetStoreFrontProductsService.ts
var GetStoreFrontProductsService_exports = {};
__export(GetStoreFrontProductsService_exports, {
  GetStoreFrontProductsService: () => GetStoreFrontProductsService
});
module.exports = __toCommonJS(GetStoreFrontProductsService_exports);

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

// src/services/product/GetStoreFrontProductsService.ts
var GetStoreFrontProductsService = class {
  async execute(page = 1, pageSize = 8, query) {
    try {
      const skip = (page - 1) * pageSize;
      if (query && query.trim()) {
        const searchTerms = query.trim().split(/\s+/).filter((term) => term.length > 0);
        const conditions = searchTerms.map(
          (_, index) => `replace(unaccent(lower(name)), ' ', '') LIKE '%' || replace(unaccent(lower($${index + 1})), ' ', '') || '%'`
        ).join(" AND ");
        const products2 = await prisma_default.$queryRawUnsafe(
          `
						SELECT id, name, image, price, unity, stock, enabled, qr_code
						FROM "products"
						WHERE enabled = true
						AND visible_in_store = true
						AND ${conditions}
						ORDER BY created_at DESC
						LIMIT $${searchTerms.length + 1} OFFSET $${searchTerms.length + 2}
					`,
          ...searchTerms,
          pageSize,
          skip
        );
        const totalResult = await prisma_default.$queryRawUnsafe(
          `
						SELECT COUNT(*) as count
						FROM "products"
						WHERE enabled = true
						AND visible_in_store = true
						AND ${conditions}
					`,
          ...searchTerms
        );
        const total2 = Number(totalResult[0].count);
        return {
          products: products2,
          total: total2,
          currentPage: page,
          totalPages: Math.ceil(total2 / pageSize)
        };
      }
      const [products, total] = await Promise.all([
        prisma_default.product.findMany({
          where: {
            enabled: true,
            visible_in_store: true
          },
          skip,
          take: pageSize,
          select: {
            id: true,
            name: true,
            image: true,
            price: true,
            unity: true,
            stock: true,
            enabled: true,
            qr_code: true
          },
          orderBy: {
            created_at: "desc"
          }
        }),
        prisma_default.product.count({
          where: {
            enabled: true,
            visible_in_store: true
          }
        })
      ]);
      return {
        products,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetStoreFrontProductsService
});
