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

// src/controllers/order/FinishOnlineOrderController.ts
var FinishOnlineOrderController_exports = {};
__export(FinishOnlineOrderController_exports, {
  FinishOnlineOrderController: () => FinishOnlineOrderController
});
module.exports = __toCommonJS(FinishOnlineOrderController_exports);

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

// src/services/order/GetOrderService.ts
var GetOrderService = class {
  async execute(id) {
    try {
      const order = await prisma_default.order.findFirst({
        where: {
          id
        }
      });
      if (!order) {
        return { error: true, message: "Order not found", code: 404 /* BAD_REQUEST */ };
      }
      return order;
    } catch (error) {
      throw new BadRequestException(
        "Client already created",
        400 /* USER_ALREADY_EXISTS */
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

// src/services/client/UpdateClientService.ts
var UpdateClientService = class {
  async execute({ id, first_name, last_name, phone_number }) {
    try {
      const updateUser = await prisma_default.client.update({
        where: {
          id
        },
        data: {
          first_name,
          last_name,
          phone_number
        }
      });
      return updateUser;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/services/order/FinishOnlineOrderService.ts
var import_moment_timezone = __toESM(require("moment-timezone"));
var FinishOnlineOrderService = class {
  async execute(data) {
    try {
      const formattedDeliveryDate = import_moment_timezone.default.utc(data.delivery_date).tz("America/Sao_Paulo", true).set({ hour: 12, minute: 0, second: 0 }).toDate();
      const formattedData = {
        ...data,
        delivery_date: formattedDeliveryDate
      };
      const updatedOrder = await prisma_default.order.update({
        where: {
          id: data.id,
          online_code: data.online_code
        },
        data: formattedData,
        include: {
          client: true,
          clientAddress: true
        }
      });
      return updatedOrder;
    } catch (error) {
      console.log("Failed when finishing online order", error.message);
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

// src/controllers/order/FinishOnlineOrderController.ts
var FinishOnlineOrderController = class {
  async handle(req, res, next) {
    const { order } = req.body;
    let client_id = order.client_id;
    let client_address_id = order.clientAddress.id;
    const getOrder = new GetOrderService();
    const orderFound = await getOrder.execute(order.id);
    if ("error" in orderFound) {
      return res.status(400).json(orderFound);
    }
    if (!client_address_id || client_address_id === "") {
      const createAddressService = new CreateAddressService();
      const address = await createAddressService.execute({
        client_id,
        street: order.clientAddress.street,
        street_number: order.clientAddress.street_number,
        complement: order.clientAddress.complement,
        reference_point: order.clientAddress.reference_point,
        neighborhood: order.clientAddress.neighborhood,
        city: order.clientAddress.city,
        state: order.clientAddress.state,
        postal_code: order.clientAddress.postal_code,
        country: order.clientAddress.country
      });
      if ("id" in address) {
        client_address_id = address.id;
      }
    }
    const finishOrderService = new FinishOnlineOrderService();
    const orderData = {
      id: order.id,
      receiver_name: order.receiver_name,
      receiver_phone: order.receiver_phone,
      client_id,
      client_address_id,
      status: order.status,
      type_of_delivery: order.type_of_delivery,
      delivery_date: order.delivery_date,
      pickup_on_store: order.pickup_on_store,
      has_card: order.has_card,
      card_from: order.card_from,
      card_to: order.card_to,
      card_message: order.card_message,
      online_code: order.online_code
    };
    const data = await finishOrderService.execute(orderData);
    const updateClientService = new UpdateClientService();
    await updateClientService.execute({
      id: client_id,
      first_name: order.first_name,
      last_name: order.last_name,
      phone_number: order.phone_number
    });
    orderEmitter.emit("onlineOrderReceived" /* OnlineOrderReceived */, data);
    return res.json({ status: "Order successfully updated", order: data });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FinishOnlineOrderController
});
