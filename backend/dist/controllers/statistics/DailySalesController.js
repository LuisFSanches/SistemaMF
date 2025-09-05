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

// src/controllers/statistics/DailySalesController.ts
var DailySalesController_exports = {};
__export(DailySalesController_exports, {
  DailySalesController: () => DailySalesController
});
module.exports = __toCommonJS(DailySalesController_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/statistics/DailySalesService.ts
var DailySalesService = class {
  async execute(initial_date, final_date) {
    const start = new Date(initial_date);
    const end = new Date(final_date);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format");
    }
    const [startDate, endDate] = start > end ? [end, start] : [start, end];
    try {
      const orders = await prisma_default.order.findMany({
        where: {
          created_at: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          created_at: true
        }
      });
      const dayCount = {
        "segunda-feira": 0,
        "ter\xE7a-feira": 0,
        "quarta-feira": 0,
        "quinta-feira": 0,
        "sexta-feira": 0,
        s\u00E1bado: 0,
        domingo: 0
      };
      orders.forEach((order) => {
        const day = new Date(order.created_at).toLocaleString("pt-BR", {
          weekday: "long"
        });
        if (day in dayCount) {
          dayCount[day] += 1;
        }
      });
      return dayCount;
    } catch (error) {
      return { error: true, message: error.message, code: "SYSTEM_ERROR" };
    }
  }
};

// src/controllers/statistics/DailySalesController.ts
var DailySalesController = class {
  async handle(req, res) {
    const { initial_date, final_date } = req.query;
    const dailySalesService = new DailySalesService();
    const sales = await dailySalesService.execute(initial_date, final_date);
    return res.json(sales);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DailySalesController
});
