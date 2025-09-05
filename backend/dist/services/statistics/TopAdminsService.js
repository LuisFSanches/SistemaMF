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

// src/services/statistics/TopAdminsService.ts
var TopAdminsService_exports = {};
__export(TopAdminsService_exports, {
  TopAdminsService: () => TopAdminsService
});
module.exports = __toCommonJS(TopAdminsService_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/statistics/TopAdminsService.ts
var TopAdminsService = class {
  async execute() {
    try {
      const topAdmins = await prisma_default.order.groupBy({
        by: ["created_by"],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: "desc"
          }
        }
      });
      const adminsDetails = await prisma_default.admin.findMany({
        where: {
          id: { in: topAdmins.map((admin) => admin.created_by) }
        },
        select: {
          id: true,
          name: true,
          username: true
        }
      });
      const result = topAdmins.map((admin) => {
        const adminData = adminsDetails.find((a) => a.id === admin.created_by);
        return {
          id: admin.created_by,
          name: adminData?.name || "Unknown",
          username: adminData?.username || "Unknown",
          orders_count: admin._count.id
        };
      });
      return result;
    } catch (error) {
      return { error: true, message: error.message, code: 500 /* SYSTEM_ERROR */ };
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TopAdminsService
});
