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

// src/controllers/order/CreateOrderController.ts
var CreateOrderController_exports = {};
__export(CreateOrderController_exports, {
  CreateOrderController: () => CreateOrderController
});
module.exports = __toCommonJS(CreateOrderController_exports);

// src/facades/OrderFacade.ts
var OrderFacade = class {
  constructor(createClientService, getClientByPhoneService, createAddressService, getClientAddressService, getAddressByStreetAndNumberService, createOrderService) {
    this.createClientService = createClientService;
    this.getClientByPhoneService = getClientByPhoneService;
    this.createAddressService = createAddressService;
    this.getClientAddressService = getClientAddressService;
    this.getAddressByStreetAndNumberService = getAddressByStreetAndNumberService;
    this.createOrderService = createOrderService;
  }
  async createOrder(data) {
    let client_id = data.clientId;
    let address_id = data.addressId;
    if (!client_id && (data.phone_number && data.phone_number !== "")) {
      const existingClient = await this.getClientByPhoneService.execute(
        data.phone_number
      );
      if (existingClient?.id) {
        client_id = existingClient.id;
      } else {
        const client = await this.createClientService.execute({
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number
        });
        client_id = client.id;
      }
    }
    if (data.is_delivery) {
      if (!address_id && data?.street && data.street_number) {
        const existingAddress = await this.getAddressByStreetAndNumberService.execute(
          client_id,
          data.street,
          data.street_number
        );
        if (existingAddress?.id) {
          address_id = existingAddress.id;
        } else {
          const address = await this.createAddressService.execute({
            client_id,
            street: data.street,
            street_number: data.street_number,
            complement: data.complement,
            reference_point: data.reference_point,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            postal_code: data.postal_code,
            country: data.country
          });
          address_id = address.id;
        }
      }
    }
    if (!data.is_delivery) {
      const defaultUser = await this.getClientByPhoneService.execute("22997517940");
      if (!client_id) {
        client_id = defaultUser.id;
      }
      const addresses = await this.getClientAddressService.execute(defaultUser.id);
      address_id = addresses[0]?.id;
    }
    const order = await this.createOrderService.execute(
      {
        description: data.description,
        additional_information: data.additional_information,
        client_id,
        client_address_id: address_id,
        pickup_on_store: data.pickup_on_store,
        receiver_name: data.receiver_name,
        receiver_phone: data.receiver_phone,
        products_value: data.products_value,
        delivery_fee: data.delivery_fee,
        total: data.total,
        payment_method: data.payment_method,
        payment_received: data.payment_received,
        delivery_date: data.delivery_date,
        created_by: data.created_by,
        updated_by: data.created_by,
        status: data.status,
        has_card: data.has_card,
        card_from: data.card_from,
        card_to: data.card_to,
        card_message: data.card_message,
        online_order: data.online_order,
        online_code: data.online_code,
        is_delivery: data.is_delivery
      },
      data.products
    );
    return order;
  }
};

// src/services/order/CreateOrderService.ts
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

// src/services/order/CreateOrderService.ts
var CreateOrderService = class {
  async execute(data, products) {
    const { delivery_date } = data;
    try {
      const formattedDeliveryDate = import_moment_timezone.default.utc(delivery_date).tz("America/Sao_Paulo", true).set({ hour: 12, minute: 0, second: 0 }).toDate();
      const order = await prisma_default.order.create({
        data: {
          ...data,
          delivery_date: formattedDeliveryDate,
          orderItems: {
            create: products.map((product) => ({
              product_id: product.id,
              quantity: Number(product.quantity),
              price: Number(product.price)
            }))
          }
        },
        include: {
          client: true,
          clientAddress: true
        }
      });
      return order;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/schemas/client/createClient.ts
var import_zod = require("zod");
var createClientSchema = import_zod.z.object({
  first_name: import_zod.z.string().nonempty("first_name is required"),
  last_name: import_zod.z.string().nonempty("last_name is required"),
  phone_number: import_zod.z.string().nonempty("phone_number is required")
});

// src/services/client/CreateClientService.ts
var CreateClientService = class {
  async execute(data) {
    const parsed = createClientSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors[0].message,
        400 /* VALIDATION_ERROR */
      );
    }
    const { phone_number } = data;
    const client = await prisma_default.client.findFirst({
      where: { phone_number }
    });
    if (client) {
      throw new BadRequestException(
        "Client already created",
        400 /* USER_ALREADY_EXISTS */
      );
    }
    try {
      const newClient = await prisma_default.client.create({ data });
      return newClient;
    } catch (error) {
      console.error("[CreateClientService] Failed:", error);
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

// src/services/client/GetClientByPhoneNumberService.ts
var GetClientByPhoneNumberService = class {
  async execute(phone_number) {
    try {
      if (!phone_number) return null;
      const client = await prisma_default.client.findFirst({
        where: {
          phone_number
        }
      });
      return client;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/services/address/GetAllClientAddressService.ts
var GetAllClientAddressService = class {
  async execute(client_id) {
    try {
      const address = await prisma_default.address.findMany({
        where: {
          client_id
        }
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

// src/services/address/GetAddressByStreetAndNumberService.ts
var GetAddressByStreetAndNumberService = class {
  async execute(client_id, street, street_number) {
    try {
      const address = await prisma_default.address.findFirst({
        where: {
          street,
          street_number,
          client_id
        }
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

// src/controllers/order/CreateOrderController.ts
var CreateOrderController = class {
  constructor() {
    this.handle = async (req, res, next) => {
      const data = req.body;
      const order = await this.orderFacade.createOrder(data);
      return res.json(order);
    };
    this.orderFacade = new OrderFacade(
      new CreateClientService(),
      new GetClientByPhoneNumberService(),
      new CreateAddressService(),
      new GetAllClientAddressService(),
      new GetAddressByStreetAndNumberService(),
      new CreateOrderService()
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateOrderController
});
