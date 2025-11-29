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

// src/controllers/orderDelivery/CreateOrderDeliveryController.ts
var CreateOrderDeliveryController_exports = {};
__export(CreateOrderDeliveryController_exports, {
  CreateOrderDeliveryController: () => CreateOrderDeliveryController
});
module.exports = __toCommonJS(CreateOrderDeliveryController_exports);

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

// src/schemas/orderDelivery/createOrderDelivery.ts
var import_zod = require("zod");
var createOrderDeliverySchema = import_zod.z.object({
  order_id: import_zod.z.string().uuid("order_id must be a valid UUID"),
  delivery_man_id: import_zod.z.string().uuid("delivery_man_id must be a valid UUID"),
  delivery_date: import_zod.z.string().datetime("delivery_date must be a valid datetime"),
  is_paid: import_zod.z.boolean().optional(),
  is_archived: import_zod.z.boolean().optional()
});

// src/exceptions/bad-request.ts
var BadRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
};

// src/services/orderDelivery/CreateOrderDeliveryService.ts
var CreateOrderDeliveryService = class {
  async execute(data) {
    const parsed = createOrderDeliverySchema.safeParse({
      ...data,
      delivery_date: data.delivery_date instanceof Date ? data.delivery_date.toISOString() : data.delivery_date
    });
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors[0].message,
        400 /* VALIDATION_ERROR */
      );
    }
    const orderExists = await prisma_default.order.findFirst({
      where: { id: parsed.data.order_id }
    });
    if (!orderExists) {
      throw new BadRequestException(
        "Order not found",
        400 /* USER_NOT_FOUND */
      );
    }
    const deliveryManExists = await prisma_default.deliveryMan.findFirst({
      where: { id: parsed.data.delivery_man_id }
    });
    if (!deliveryManExists) {
      throw new BadRequestException(
        "Delivery man not found",
        400 /* USER_NOT_FOUND */
      );
    }
    const existingDelivery = await prisma_default.orderDelivery.findFirst({
      where: { order_id: parsed.data.order_id }
    });
    if (existingDelivery) {
      throw new BadRequestException(
        "Delivery already exists for this order",
        400 /* USER_ALREADY_EXISTS */
      );
    }
    try {
      const orderDelivery = await prisma_default.orderDelivery.create({
        data: {
          order_id: parsed.data.order_id,
          delivery_man_id: parsed.data.delivery_man_id,
          delivery_date: new Date(parsed.data.delivery_date),
          is_paid: parsed.data.is_paid,
          is_archived: parsed.data.is_archived
        },
        include: {
          order: {
            select: {
              code: true,
              total: true,
              client: {
                select: {
                  first_name: true,
                  last_name: true,
                  phone_number: true
                }
              },
              clientAddress: {
                select: {
                  street: true,
                  street_number: true,
                  neighborhood: true,
                  city: true
                }
              }
            }
          },
          deliveryMan: {
            select: {
              name: true,
              phone_number: true
            }
          }
        }
      });
      return orderDelivery;
    } catch (error) {
      console.error("[CreateOrderDeliveryService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/events/orderEvents.ts
var import_events = require("events");
var orderEmitter = new import_events.EventEmitter();

// src/controllers/orderDelivery/CreateOrderDeliveryController.ts
var CreateOrderDeliveryController = class {
  async handle(req, res, next) {
    const { order_id, delivery_man_id, delivery_date, is_paid, is_archived } = req.body;
    const createOrderDeliveryService = new CreateOrderDeliveryService();
    const orderDelivery = await createOrderDeliveryService.execute({
      order_id,
      delivery_man_id,
      delivery_date: new Date(delivery_date),
      is_paid,
      is_archived
    });
    orderEmitter.emit("orderDelivered" /* orderDelivered */, orderDelivery);
    return res.json(orderDelivery);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateOrderDeliveryController
});
