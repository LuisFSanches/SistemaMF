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

// src/controllers/order/GetOrderDetailsController.ts
var GetOrderDetailsController_exports = {};
__export(GetOrderDetailsController_exports, {
  GetOrderDetailsController: () => GetOrderDetailsController
});
module.exports = __toCommonJS(GetOrderDetailsController_exports);

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

// src/services/order/GetOrderDetailsService.ts
var GetOrderDetailsService = class {
  async execute(id) {
    try {
      const order = await prisma_default.order.findFirst({
        where: {
          id
        },
        include: {
          client: true,
          clientAddress: true,
          createdBy: true,
          orderDeliveries: {
            include: {
              deliveryMan: true
            }
          }
        }
      });
      if (!order) {
        throw new BadRequestException(
          "Order not found",
          404 /* BAD_REQUEST */
        );
      }
      const orderDetails = {
        orderInfo: {
          code: order.code,
          description: order.description,
          additional_information: order.additional_information,
          delivery_date: order.delivery_date,
          status: order.status,
          is_delivery: order.is_delivery,
          online_order: order.online_order,
          store_front_order: order.store_front_order
        },
        orderValues: {
          products_value: order.products_value,
          discount: order.discount,
          delivery_fee: order.delivery_fee,
          total: order.total,
          payment_method: order.payment_method,
          payment_received: order.payment_received
        },
        cardDetails: order.has_card ? {
          card_from: order.card_from,
          card_to: order.card_to,
          card_message: order.card_message
        } : null,
        clientInfo: {
          id: order.client.id,
          first_name: order.client.first_name,
          last_name: order.client.last_name,
          phone_number: order.client.phone_number,
          address: {
            street: order.clientAddress.street,
            street_number: order.clientAddress.street_number,
            complement: order.clientAddress.complement,
            neighborhood: order.clientAddress.neighborhood,
            reference_point: order.clientAddress.reference_point,
            city: order.clientAddress.city,
            state: order.clientAddress.state,
            postal_code: order.clientAddress.postal_code
          }
        },
        deliveryManInfo: order.is_delivery && order.orderDeliveries.length > 0 ? {
          id: order.orderDeliveries[0].deliveryMan.id,
          name: order.orderDeliveries[0].deliveryMan.name,
          phone_number: order.orderDeliveries[0].deliveryMan.phone_number
        } : null,
        createdBy: order.createdBy ? {
          id: order.createdBy.id,
          name: order.createdBy.name,
          username: order.createdBy.username
        } : null
      };
      return orderDetails;
    } catch (error) {
      console.error("[GetOrderDetailsService] Failed:", error);
      throw new BadRequestException(
        error.message || "Failed to get order details",
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/order/GetOrderDetailsController.ts
var GetOrderDetailsController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const getOrderDetailsService = new GetOrderDetailsService();
    const orderDetails = await getOrderDetailsService.execute(id);
    return res.json(orderDetails);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetOrderDetailsController
});
