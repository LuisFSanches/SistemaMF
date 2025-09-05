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

// src/services/statistics/TopClientsService.ts
var TopClientsService_exports = {};
__export(TopClientsService_exports, {
  TopClientsService: () => TopClientsService
});
module.exports = __toCommonJS(TopClientsService_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/statistics/TopClientsService.ts
var TopClientsService = class {
  async execute(initial_date, final_date, limit) {
    const start = new Date(initial_date);
    const end = new Date(final_date);
    try {
      const topClients = await prisma_default.order.groupBy({
        by: ["client_id"],
        where: {
          created_at: {
            gte: start,
            lte: end
          }
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: "desc"
          }
        },
        take: parseInt(limit)
      });
      const result = await Promise.all(
        topClients.map(async (item) => {
          const client = await prisma_default.client.findUnique({
            where: { id: item.client_id },
            select: {
              first_name: true,
              last_name: true,
              phone_number: true
            }
          });
          return {
            ...client,
            totalOrders: item._count.id
          };
        })
      );
      return result;
    } catch (error) {
      return { error: true, message: error.message, code: 500 /* SYSTEM_ERROR */ };
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TopClientsService
});
