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

// src/controllers/address/GetPickUpAddressController.ts
var GetPickUpAddressController_exports = {};
__export(GetPickUpAddressController_exports, {
  GetPickUpAddressController: () => GetPickUpAddressController
});
module.exports = __toCommonJS(GetPickUpAddressController_exports);

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

// src/controllers/address/GetPickUpAddressController.ts
var GetPickUpAddressController = class {
  async handle(req, res) {
    const street = "Av. Zulamith Bittencourt";
    const street_number = "68";
    const complement = "Ao lado da Quadra da AABB";
    const reference_point = "AABB";
    const neighborhood = "Centro";
    const city = "Itaperuna";
    const state = "RJ";
    const postal_code = "28300-000";
    const country = "Brasil";
    const storePhoneNumber = "22997517940";
    let client_id = "";
    const getClientService = new GetClientByPhoneNumberService();
    const createClientService = new CreateClientService();
    const getClient = await getClientService.execute(storePhoneNumber);
    if (getClient) {
      client_id = getClient?.id;
    }
    if (!getClient) {
      const client = await createClientService.execute({
        first_name: "Mirai Flores",
        last_name: "Floricultura",
        phone_number: storePhoneNumber
      });
      client_id = client.id;
    }
    const getClientAddressService = new GetAllClientAddressService();
    let address = await getClientAddressService.execute(client_id);
    if (address.length > 0) {
      address = address[0];
    }
    if (address.length === 0) {
      const createAddressService = new CreateAddressService();
      address = await createAddressService.execute({
        client_id,
        street,
        street_number,
        complement,
        reference_point,
        neighborhood,
        city,
        state,
        postal_code,
        country
      });
    }
    return res.json(address);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetPickUpAddressController
});
