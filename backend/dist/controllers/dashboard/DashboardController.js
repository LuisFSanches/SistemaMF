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

// src/controllers/dashboard/DashboardController.ts
var DashboardController_exports = {};
__export(DashboardController_exports, {
  DashboardController: () => DashboardController
});
module.exports = __toCommonJS(DashboardController_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/dashboard/DashboardService.ts
var import_date_fns = require("date-fns");
var DashboardService = class {
  static async getDashboardData(period) {
    const now = /* @__PURE__ */ new Date();
    let startDate;
    switch (period) {
      case "day":
        startDate = (0, import_date_fns.startOfDay)(now);
        break;
      case "month":
        startDate = (0, import_date_fns.startOfMonth)(now);
        break;
      case "year":
        startDate = (0, import_date_fns.startOfYear)(now);
        break;
      case "week":
      default:
        startDate = (0, import_date_fns.startOfWeek)(now, { weekStartsOn: 1 });
        break;
    }
    const orders = await prisma_default.order.findMany({
      where: {
        created_at: {
          gte: startDate,
          lte: now
        }
      }
    });
    const ordersWithoutCanceled = orders.filter((o) => o.status !== "CANCELED");
    const totalOrders = ordersWithoutCanceled.length;
    const totalAmount = ordersWithoutCanceled.reduce((acc, order) => acc + order.total, 0);
    const amountReceived = ordersWithoutCanceled.filter((o) => o.payment_received).reduce((acc, order) => acc + order.total, 0);
    const amountPending = totalAmount - amountReceived;
    const inStoreOrders = orders.filter((o) => !o.online_order).length;
    const onlineOrders = orders.filter((o) => o.online_order).length;
    const recentOrders = orders.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 4);
    const paymentMethods = {
      CASH: orders.filter((o) => o.payment_method === "CASH").length,
      PIX: orders.filter((o) => o.payment_method === "PIX").length,
      CARD: orders.filter((o) => o.payment_method === "CARD").length
    };
    const topAdmins = await prisma_default.order.groupBy({
      by: ["created_by"],
      where: {
        created_at: {
          gte: startDate,
          lte: now
        }
      },
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
    const admins = topAdmins.map((admin) => {
      const adminData = adminsDetails.find((a) => a.id === admin.created_by);
      return {
        id: admin.created_by,
        name: adminData?.name || "Desconhecido",
        username: adminData?.username || "Desconhecido",
        orders_count: admin._count.id
      };
    });
    return {
      totalOrders,
      totalAmount,
      amountReceived,
      amountPending,
      inStoreOrders,
      onlineOrders,
      recentOrders,
      paymentMethods,
      admins
    };
  }
};

// src/controllers/dashboard/DashboardController.ts
var DashboardController = class {
  async handle(req, res) {
    const period = req.query.period || "week";
    try {
      const data = await DashboardService.getDashboardData(period);
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao carregar o dashboard." });
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DashboardController
});
