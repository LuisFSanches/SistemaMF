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

// src/controllers/deliveryMan/GetDeliveryManController.ts
var GetDeliveryManController_exports = {};
__export(GetDeliveryManController_exports, {
  GetDeliveryManController: () => GetDeliveryManController
});
module.exports = __toCommonJS(GetDeliveryManController_exports);

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

// src/services/deliveryMan/GetDeliveryManService.ts
var GetDeliveryManService = class {
  async execute({ id }) {
    try {
      const deliveryMan = await prisma_default.deliveryMan.findFirst({
        where: { id }
      });
      if (!deliveryMan) {
        throw new BadRequestException(
          "Delivery man not found",
          400 /* USER_NOT_FOUND */
        );
      }
      const orderDeliveries = await prisma_default.orderDelivery.findMany({
        where: {
          delivery_man_id: id
        },
        include: {
          order: {
            select: {
              code: true,
              delivery_fee: true
            }
          }
        },
        orderBy: {
          delivery_date: "desc"
        }
      });
      const deliveries = orderDeliveries.map((delivery) => ({
        id: delivery.id,
        order_code: delivery.order.code,
        delivery_date: delivery.delivery_date,
        delivery_fee: delivery.order.delivery_fee,
        is_paid: delivery.is_paid
      }));
      const historyMap = /* @__PURE__ */ new Map();
      orderDeliveries.forEach((delivery) => {
        const dateKey = delivery.delivery_date.toISOString().split("T")[0];
        const existing = historyMap.get(dateKey) || { count: 0, total: 0 };
        historyMap.set(dateKey, {
          count: existing.count + 1,
          total: existing.total + delivery.order.delivery_fee
        });
      });
      const deliveryHistory = Array.from(historyMap.entries()).map(([date, data]) => ({
        date,
        count: data.count,
        total: data.total
      })).sort((a, b) => a.date.localeCompare(b.date));
      const totalDeliveries = orderDeliveries.length;
      const totalPaid = orderDeliveries.filter((d) => d.is_paid).reduce((sum, d) => sum + d.order.delivery_fee, 0);
      const pendingPayment = orderDeliveries.filter((d) => !d.is_paid).reduce((sum, d) => sum + d.order.delivery_fee, 0);
      return {
        deliveryMan: {
          name: deliveryMan.name,
          phone_number: deliveryMan.phone_number
        },
        deliveries,
        deliveryHistory,
        summary: {
          total_deliveries: totalDeliveries,
          total_paid: totalPaid,
          pending_payment: pendingPayment
        }
      };
    } catch (error) {
      console.error("[GetDeliveryManService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/deliveryMan/GetDeliveryManController.ts
var GetDeliveryManController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const getDeliveryManService = new GetDeliveryManService();
    const deliveryMan = await getDeliveryManService.execute({ id });
    return res.json(deliveryMan);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetDeliveryManController
});
