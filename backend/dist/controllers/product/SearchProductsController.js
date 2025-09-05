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

// src/controllers/product/SearchProductsController.ts
var SearchProductsController_exports = {};
__export(SearchProductsController_exports, {
  SearchProductsController: () => SearchProductsController
});
module.exports = __toCommonJS(SearchProductsController_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/product/SearchProductsService.ts
var SearchProductsService = class {
  async execute(query) {
    if (!query) return [];
    const products = await prisma_default.$queryRawUnsafe(
      `
                SELECT * FROM "products"
                WHERE enabled = true
                AND unaccent(lower(name)) LIKE '%' || unaccent(lower($1)) || '%'
                ORDER BY name
                LIMIT 50
            `,
      query
    );
    return products;
  }
};

// src/controllers/product/SearchProductsController.ts
var SearchProductsController = class {
  async handle(req, res, next) {
    const query = String(req.query.q || "").trim();
    const service = new SearchProductsService();
    const products = await service.execute(query);
    return res.json(products);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SearchProductsController
});
