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

// src/controllers/orderDelivery/UpdateOrderDeliveryController.ts
var UpdateOrderDeliveryController_exports = {};
__export(UpdateOrderDeliveryController_exports, {
  UpdateOrderDeliveryController: () => UpdateOrderDeliveryController
});
module.exports = __toCommonJS(UpdateOrderDeliveryController_exports);

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

// src/schemas/orderDelivery/updateOrderDelivery.ts
var import_zod = require("zod");
var updateOrderDeliverySchema = import_zod.z.object({
  delivery_man_id: import_zod.z.string().uuid("delivery_man_id must be a valid UUID").optional(),
  delivery_date: import_zod.z.string().datetime("delivery_date must be a valid datetime").optional(),
  is_paid: import_zod.z.boolean().optional(),
  is_archived: import_zod.z.boolean().optional()
});

// src/exceptions/bad-request.ts
var BadRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
};

// src/services/orderDelivery/UpdateOrderDeliveryService.ts
var UpdateOrderDeliveryService = class {
  async execute({ id, ...data }) {
    const parsed = updateOrderDeliverySchema.safeParse({
      ...data,
      delivery_date: data.delivery_date ? data.delivery_date instanceof Date ? data.delivery_date.toISOString() : data.delivery_date : void 0
    });
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors[0].message,
        400 /* VALIDATION_ERROR */
      );
    }
    const existingOrderDelivery = await prisma_default.orderDelivery.findFirst({
      where: { id }
    });
    if (!existingOrderDelivery) {
      throw new BadRequestException(
        "Order delivery not found",
        400 /* USER_NOT_FOUND */
      );
    }
    if (parsed.data.delivery_man_id) {
      const deliveryManExists = await prisma_default.deliveryMan.findFirst({
        where: { id: parsed.data.delivery_man_id }
      });
      if (!deliveryManExists) {
        throw new BadRequestException(
          "Delivery man not found",
          400 /* USER_NOT_FOUND */
        );
      }
    }
    try {
      const orderDelivery = await prisma_default.orderDelivery.update({
        where: { id },
        data: {
          delivery_man_id: parsed.data.delivery_man_id,
          delivery_date: parsed.data.delivery_date ? new Date(parsed.data.delivery_date) : void 0,
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
      console.error("[UpdateOrderDeliveryService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/orderDelivery/UpdateOrderDeliveryController.ts
var UpdateOrderDeliveryController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const { delivery_man_id, delivery_date, is_paid, is_archived } = req.body;
    const updateOrderDeliveryService = new UpdateOrderDeliveryService();
    const orderDelivery = await updateOrderDeliveryService.execute({
      id,
      delivery_man_id,
      delivery_date: delivery_date ? new Date(delivery_date) : void 0,
      is_paid,
      is_archived
    });
    return res.json(orderDelivery);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateOrderDeliveryController
});
