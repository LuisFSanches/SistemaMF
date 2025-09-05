"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/controllers/order/UpdateOrderController.ts
var UpdateOrderController_exports = {};
__export(UpdateOrderController_exports, {
  UpdateOrderController: () => UpdateOrderController,
  orderEmitter: () => orderEmitter
});
module.exports = __toCommonJS(UpdateOrderController_exports);

// src/services/order/UpdateOrderService.ts
var import_moment_timezone = __toESM(require("moment-timezone"));

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

// src/services/order/UpdateOrderService.ts
var UpdateOrderService = class {
  async execute(data) {
    const order = {
      ...data
    };
    delete order.products;
    try {
      const formattedDeliveryDate = import_moment_timezone.default.utc(order.delivery_date).tz("America/Sao_Paulo", true).set({ hour: 12, minute: 0, second: 0 }).toDate();
      const updatedOrder = await prisma_default.order.update({
        where: {
          id: data.id
        },
        data: {
          ...order,
          delivery_date: formattedDeliveryDate,
          orderItems: {
            update: data.products.filter((product) => product.id).map((product) => ({
              where: {
                id: product.id
              },
              data: {
                product_id: product.product_id,
                quantity: Number(product.quantity),
                price: Number(product.price)
              }
            })),
            create: data.products.filter((product) => !product.id).map((product) => ({
              product_id: product.product_id,
              quantity: Number(product.quantity),
              price: Number(product.price)
            }))
          }
        },
        include: {
          client: true,
          clientAddress: true,
          createdBy: true,
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });
      return updatedOrder;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/services/address/UpdateAddressService.ts
var UpdateAddressService = class {
  async execute(address) {
    try {
      const updatedAddress = await prisma_default.address.update({
        where: {
          id: address.id
        },
        data: address
      });
      return { status: "Address successfully updated", address: updatedAddress };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/services/address/CreateAddressService.ts
var CreateAddressService = class {
  async execute(data) {
    try {
      const address = await prisma_default.address.create({
        data
      });
      return address;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/order/UpdateOrderController.ts
var import_events = require("events");
var orderEmitter = new import_events.EventEmitter();
var UpdateOrderController = class {
  async handle(req, res, next) {
    const { order } = req.body;
    let client_address_id = order.clientAddress.id;
    let is_delivery = order.is_delivery;
    if (order.editAddress) {
      const { clientAddress } = order;
      const updateAddressService = new UpdateAddressService();
      const createAddressService = new CreateAddressService();
      if (order.is_delivery === false) {
        const address = await createAddressService.execute({
          client_id: order.client_id,
          street: clientAddress.street,
          street_number: clientAddress.street_number,
          complement: clientAddress.complement,
          reference_point: clientAddress.reference_point,
          neighborhood: clientAddress.neighborhood,
          city: clientAddress.city,
          state: clientAddress.state,
          postal_code: clientAddress.postal_code,
          country: clientAddress.country
        });
        client_address_id = address.id;
        is_delivery = true;
      }
      if (order.is_delivery === true) {
        const address = await updateAddressService.execute(clientAddress);
      }
    }
    delete order.editAddress;
    delete order.clientAddress;
    order.client_address_id = client_address_id;
    order.is_delivery = is_delivery;
    const updateOrderService = new UpdateOrderService();
    const data = await updateOrderService.execute(order);
    orderEmitter.emit("orderUpdated", { data });
    return res.json(data);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateOrderController,
  orderEmitter
});
