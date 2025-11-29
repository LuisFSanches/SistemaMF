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

// src/controllers/client/GetClientController.ts
var GetClientController_exports = {};
__export(GetClientController_exports, {
  GetClientController: () => GetClientController
});
module.exports = __toCommonJS(GetClientController_exports);

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

// src/services/client/GetClientService.ts
var GetClientService = class {
  async execute(id) {
    try {
      const client = await prisma_default.client.findFirst({
        where: { id }
      });
      if (!client) {
        throw new BadRequestException(
          "Client not found",
          400 /* USER_NOT_FOUND */
        );
      }
      const orders = await prisma_default.order.findMany({
        where: { client_id: id },
        select: {
          id: true,
          code: true,
          description: true,
          total: true,
          status: true,
          delivery_date: true,
          created_at: true,
          payment_method: true,
          payment_received: true,
          pickup_on_store: true,
          is_delivery: true,
          online_order: true,
          store_front_order: true
        },
        orderBy: {
          created_at: "desc"
        }
      });
      const addresses = await prisma_default.address.findMany({
        where: { client_id: id },
        orderBy: {
          created_at: "desc"
        }
      });
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
      const averageTicket = totalOrders > 0 ? totalSpent / totalOrders : 0;
      const lastOrder = orders.length > 0 ? orders[0] : null;
      const lastOrderValue = lastOrder ? lastOrder.total : 0;
      const spendingHistory = this.generateSpendingHistory(orders);
      return {
        clientInfo: {
          id: client.id,
          name: `${client.first_name} ${client.last_name}`,
          first_name: client.first_name,
          last_name: client.last_name,
          phone_number: client.phone_number,
          created_at: client.created_at
        },
        orders: orders.map((order) => ({
          id: order.id,
          code: order.code,
          date: order.delivery_date,
          created_at: order.created_at,
          description: order.description,
          total: order.total,
          status: order.status,
          payment_method: order.payment_method,
          payment_received: order.payment_received,
          pickup_on_store: order.pickup_on_store,
          online_order: order.online_order,
          store_front_order: order.store_front_order,
          is_delivery: order.is_delivery
        })),
        spendingHistory,
        addresses: addresses.map((address) => ({
          id: address.id,
          street: address.street,
          street_number: address.street_number,
          complement: address.complement,
          neighborhood: address.neighborhood,
          reference_point: address.reference_point,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
          created_at: address.created_at
        })),
        statistics: {
          totalOrders,
          totalSpent,
          averageTicket,
          lastOrderValue,
          lastOrderDate: lastOrder ? lastOrder.created_at : null
        }
      };
    } catch (error) {
      console.error("[GetClientService] Failed:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
  generateSpendingHistory(orders) {
    const history = {};
    const now = /* @__PURE__ */ new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      history[key] = 0;
    }
    orders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
      if (history[key] !== void 0) {
        history[key] += order.total;
      }
    });
    return Object.entries(history).map(([month, amount]) => ({
      month,
      amount
    }));
  }
};

// src/controllers/client/GetClientController.ts
var GetClientController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const getClientService = new GetClientService();
    const clientData = await getClientService.execute(id);
    return res.json(clientData);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetClientController
});
