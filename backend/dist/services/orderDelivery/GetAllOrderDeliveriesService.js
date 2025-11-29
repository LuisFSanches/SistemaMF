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

// src/services/orderDelivery/GetAllOrderDeliveriesService.ts
var GetAllOrderDeliveriesService_exports = {};
__export(GetAllOrderDeliveriesService_exports, {
  GetAllOrderDeliveriesService: () => GetAllOrderDeliveriesService
});
module.exports = __toCommonJS(GetAllOrderDeliveriesService_exports);

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

// src/services/orderDelivery/GetAllOrderDeliveriesService.ts
var GetAllOrderDeliveriesService = class {
  async execute(page = 1, pageSize = 10, query, filter) {
    try {
      const skip = (page - 1) * pageSize;
      let whereClause = {};
      if (filter === "active") {
        whereClause.is_archived = false;
      } else if (filter === "archived") {
        whereClause.is_archived = true;
      }
      if (query) {
        const isNumericQuery = !isNaN(Number(query));
        const orConditions = [
          {
            deliveryMan: {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { phone_number: { contains: query, mode: "insensitive" } }
              ]
            }
          }
        ];
        if (isNumericQuery) {
          orConditions.push({
            order: {
              code: { equals: Number(query) }
            }
          });
        }
        whereClause.OR = orConditions;
      }
      const [orderDeliveries, total] = await Promise.all([
        prisma_default.orderDelivery.findMany({
          where: whereClause,
          include: {
            order: {
              select: {
                code: true,
                delivery_fee: true,
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
                phone_number: true,
                id: true
              }
            }
          },
          orderBy: {
            delivery_date: "asc"
          },
          skip,
          take: pageSize
        }),
        prisma_default.orderDelivery.count({
          where: whereClause
        })
      ]);
      return {
        orderDeliveries,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error) {
      console.error("[GetAllOrderDeliveriesService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetAllOrderDeliveriesService
});
