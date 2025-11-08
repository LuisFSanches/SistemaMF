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

// src/server.ts
var server_exports = {};
__export(server_exports, {
  io: () => io
});
module.exports = __toCommonJS(server_exports);
var import_express2 = __toESM(require("express"));
var import_http = __toESM(require("http"));
var import_express_async_errors = require("express-async-errors");
var import_cors = __toESM(require("cors"));
var import_dotenv = __toESM(require("dotenv"));
var import_path5 = __toESM(require("path"));

// src/events/orderEvents.ts
var import_events = require("events");
var orderEmitter = new import_events.EventEmitter();

// src/server.ts
var import_socket = require("socket.io");

// src/routes.ts
var import_express = require("express");

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/dashboard/DashboardService.ts
var import_date_fns = require("date-fns");
var DashboardService = class {
  static async getDashboardData(period) {
    const now = /* @__PURE__ */ new Date();
    let startDate;
    switch (period) {
      case "day":
        startDate = (0, import_date_fns.startOfDay)(now);
        break;
      case "month":
        startDate = (0, import_date_fns.startOfMonth)(now);
        break;
      case "year":
        startDate = (0, import_date_fns.startOfYear)(now);
        break;
      case "week":
      default:
        startDate = (0, import_date_fns.startOfWeek)(now, { weekStartsOn: 1 });
        break;
    }
    const orders = await prisma_default.order.findMany({
      where: {
        created_at: {
          gte: startDate,
          lte: now
        }
      }
    });
    const ordersWithoutCanceled = orders.filter((o) => o.status !== "CANCELED");
    const totalOrders = ordersWithoutCanceled.length;
    const totalAmount = ordersWithoutCanceled.reduce((acc, order) => acc + order.total, 0);
    const amountReceived = ordersWithoutCanceled.filter((o) => o.payment_received).reduce((acc, order) => acc + order.total, 0);
    const amountPending = totalAmount - amountReceived;
    const inStoreOrders = orders.filter((o) => !o.online_order).length;
    const onlineOrders = orders.filter((o) => o.online_order).length;
    const recentOrders = orders.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 4);
    const paymentMethods = {
      CASH: orders.filter((o) => o.payment_method === "CASH").length,
      PIX: orders.filter((o) => o.payment_method === "PIX").length,
      CARD: orders.filter((o) => o.payment_method === "CARD").length
    };
    const topAdmins = await prisma_default.order.groupBy({
      by: ["created_by"],
      where: {
        created_at: {
          gte: startDate,
          lte: now
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: "desc"
        }
      }
    });
    const adminsDetails = await prisma_default.admin.findMany({
      where: {
        id: { in: topAdmins.map((admin) => admin.created_by) }
      },
      select: {
        id: true,
        name: true,
        username: true
      }
    });
    const admins = topAdmins.map((admin) => {
      const adminData = adminsDetails.find((a) => a.id === admin.created_by);
      return {
        id: admin.created_by,
        name: adminData?.name || "Desconhecido",
        username: adminData?.username || "Desconhecido",
        orders_count: admin._count.id
      };
    });
    return {
      totalOrders,
      totalAmount,
      amountReceived,
      amountPending,
      inStoreOrders,
      onlineOrders,
      recentOrders,
      paymentMethods,
      admins
    };
  }
};

// src/controllers/dashboard/DashboardController.ts
var DashboardController = class {
  async handle(req, res) {
    const period = req.query.period || "week";
    try {
      const data = await DashboardService.getDashboardData(period);
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao carregar o dashboard." });
    }
  }
};

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

// src/services/client/GetAllClientService.ts
var GetAllClientService = class {
  async execute(page = 1, pageSize = 10, query) {
    try {
      const skip = (page - 1) * pageSize;
      const filters = query ? {
        OR: [
          { first_name: { contains: query, mode: "insensitive" } },
          { last_name: { contains: query, mode: "insensitive" } },
          { phone_number: { contains: query, mode: "insensitive" } }
        ]
      } : {};
      const [users, total] = await Promise.all([
        prisma_default.client.findMany({
          where: filters,
          skip,
          take: pageSize
        }),
        prisma_default.client.count()
      ]);
      return {
        users,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/client/GetAllClientController.ts
var GetAllClientController = class {
  async handle(req, res) {
    const { page = "1", pageSize = "10", query = "" } = req.query;
    const getAllClientService = new GetAllClientService();
    const clients = await getAllClientService.execute(Number(page), Number(pageSize), String(query));
    return res.json(clients);
  }
};

// src/services/client/GetClientService.ts
var GetClientService = class {
  async execute(id) {
    try {
      const user = await prisma_default.client.findFirst({
        where: {
          id
        }
      });
      return { user };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/client/GetClientController.ts
var GetClientController = class {
  async handle(req, res) {
    const { id } = req.params;
    const getClientService = new GetClientService();
    const client = await getClientService.execute(id);
    return res.json(client);
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

// src/controllers/client/GetClientByPhoneNumbeController.ts
var GetClientByPhoneNumbeController = class {
  async handle(req, res) {
    const { phone_number } = req.query;
    const getClientService = new GetClientByPhoneNumberService();
    const client = await getClientService.execute(phone_number);
    return res.json(client);
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

// src/controllers/client/CreateClientController.ts
var CreateClientController = class {
  async handle(req, res, next) {
    const { first_name, last_name, phone_number } = req.body;
    const createClientService = new CreateClientService();
    const client = await createClientService.execute({
      first_name,
      last_name,
      phone_number
    });
    return res.json(client);
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

// src/controllers/client/UpdateClientController.ts
var UpdateClientController = class {
  async handle(req, res, next) {
    const { id, first_name, last_name, phone_number } = req.body;
    const updateClientService = new UpdateClientService();
    const client = await updateClientService.execute({
      id,
      first_name,
      last_name,
      phone_number
    });
    return res.json(client);
  }
};

// src/services/product/CreateProductService.ts
var CreateProductService = class {
  async execute(data) {
    try {
      const product = await prisma_default.product.create({
        data
      });
      return product;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/product/CreateProductController.ts
var CreateProductController = class {
  async handle(req, res, next) {
    const { name, price, unity, stock } = req.body;
    const service = new CreateProductService();
    const result = await service.execute({ name, price, unity, stock, enabled: true });
    return res.status(201).json(result);
  }
};

// src/services/product/GetAllProductService.ts
var GetAllProductService = class {
  async execute(page = 1, pageSize = 8, query) {
    try {
      const skip = (page - 1) * pageSize;
      const filters = query ? {
        name: {
          contains: query,
          mode: "insensitive"
        },
        enabled: true
      } : { enabled: true };
      const [products, total] = await Promise.all([
        prisma_default.product.findMany({
          where: filters,
          skip,
          take: pageSize,
          select: {
            id: true,
            name: true,
            image: true,
            price: true,
            unity: true,
            stock: true,
            enabled: true
          },
          orderBy: {
            created_at: "desc"
          }
        }),
        prisma_default.product.count({
          where: filters
        })
      ]);
      return {
        products,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/product/GetAllProductController.ts
var GetAllProductController = class {
  async handle(req, res, next) {
    const { page = "1", pageSize = "10", query = "" } = req.query;
    const getAllProductService = new GetAllProductService();
    const products = await getAllProductService.execute(
      Number(page),
      Number(pageSize),
      String(query)
    );
    return res.json(products);
  }
};

// src/services/product/UpdateProductService.ts
var UpdateProductService = class {
  async execute({ id, name, price, unity, stock, enabled, image }) {
    try {
      let data = {
        name,
        price,
        unity,
        stock,
        enabled,
        image
      };
      const updatedProduct = await prisma_default.product.update({
        where: {
          id
        },
        data
      });
      return updatedProduct;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/product/UpdateProductController.ts
var UpdateProductController = class {
  async handle(req, res, next) {
    const { name, price, unity, stock, enabled, image } = req.body;
    const id = req.params.id;
    const updateProductService = new UpdateProductService();
    const admin = await updateProductService.execute({
      id,
      name,
      price,
      unity,
      stock,
      enabled,
      image
    });
    return res.json(admin);
  }
};

// src/services/product/SearchProductsService.ts
var SearchProductsService = class {
  async execute(query) {
    if (!query) return [];
    const products = await prisma_default.$queryRawUnsafe(
      `
                SELECT * FROM "products"
                WHERE enabled = true
                AND unaccent(lower(name)) LIKE '%' || unaccent(lower($1)) || '%'
                ORDER BY name
                LIMIT 50
            `,
      query
    );
    return products;
  }
};

// src/controllers/product/SearchProductsController.ts
var SearchProductsController = class {
  async handle(req, res, next) {
    const query = String(req.query.q || "").trim();
    const service = new SearchProductsService();
    const products = await service.execute(query);
    return res.json(products);
  }
};

// src/services/product/UploadProductImageService.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var UploadProductImageService = class {
  async execute({ product_id, filename }) {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3334";
    console.log("Backend URL:", backendUrl);
    const product = await prisma_default.product.findFirst({
      where: { id: product_id }
    });
    if (!product) {
      const uploadDir2 = import_path.default.resolve(__dirname, "..", "..", "..", "uploads", "products");
      const filePath = import_path.default.join(uploadDir2, filename);
      if (import_fs.default.existsSync(filePath)) {
        import_fs.default.unlinkSync(filePath);
      }
      throw new BadRequestException(
        "Product not found",
        400 /* USER_NOT_FOUND */
      );
    }
    console.log("chegou aqui");
    if (product.image) {
      const oldImagePath = product.image.replace(`${backendUrl}/uploads/products/`, "");
      const uploadDir2 = import_path.default.resolve(__dirname, "..", "..", "..", "uploads", "products");
      const oldFilePath = import_path.default.join(uploadDir2, oldImagePath);
      if (import_fs.default.existsSync(oldFilePath)) {
        import_fs.default.unlinkSync(oldFilePath);
      }
    }
    const imageUrl = `${backendUrl}/uploads/products/${filename}`;
    console.log("New image URL:", imageUrl);
    try {
      const updatedProduct = await prisma_default.product.update({
        where: { id: product_id },
        data: { image: imageUrl }
      });
      return updatedProduct;
    } catch (error) {
      console.log("[UploadProductImageService] Failed to update product image:", error);
      console.error("[UploadProductImageService] Failed:", error);
      const uploadDir2 = import_path.default.resolve(__dirname, "..", "..", "..", "uploads", "products");
      const filePath = import_path.default.join(uploadDir2, filename);
      if (import_fs.default.existsSync(filePath)) {
        import_fs.default.unlinkSync(filePath);
      }
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/product/UploadProductImageController.ts
var UploadProductImageController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    if (!req.file) {
      throw new BadRequestException(
        "No image file provided",
        400 /* VALIDATION_ERROR */
      );
    }
    const uploadProductImageService = new UploadProductImageService();
    const product = await uploadProductImageService.execute({
      product_id: id,
      filename: req.file.filename
    });
    console.log("Uploaded product image:", product);
    return res.json(product);
  }
};

// src/services/product/DeleteProductImageService.ts
var import_fs2 = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
var DeleteProductImageService = class {
  async execute({ product_id }) {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3334";
    const product = await prisma_default.product.findFirst({
      where: { id: product_id }
    });
    if (!product) {
      throw new BadRequestException(
        "Product not found",
        400 /* USER_NOT_FOUND */
      );
    }
    if (!product.image) {
      throw new BadRequestException(
        "Product has no image to delete",
        404 /* BAD_REQUEST */
      );
    }
    const imagePath = product.image.replace(`${backendUrl}/uploads/products/`, "");
    const uploadDir2 = import_path2.default.resolve(__dirname, "..", "..", "..", "uploads", "products");
    const filePath = import_path2.default.join(uploadDir2, imagePath);
    if (import_fs2.default.existsSync(filePath)) {
      import_fs2.default.unlinkSync(filePath);
    }
    try {
      const updatedProduct = await prisma_default.product.update({
        where: { id: product_id },
        data: { image: null }
      });
      return updatedProduct;
    } catch (error) {
      console.error("[DeleteProductImageService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/product/DeleteProductImageController.ts
var DeleteProductImageController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const deleteProductImageService = new DeleteProductImageService();
    const product = await deleteProductImageService.execute({
      product_id: id
    });
    return res.json(product);
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

// src/schemas/address/createAddress.ts
var import_zod2 = require("zod");
var createAddressSchema = import_zod2.z.object({
  client_id: import_zod2.z.string().nonempty("client_id is required"),
  street: import_zod2.z.string().nonempty("street is required"),
  street_number: import_zod2.z.string().nonempty("street_number is required"),
  complement: import_zod2.z.string().optional(),
  reference_point: import_zod2.z.string().optional(),
  neighborhood: import_zod2.z.string().nonempty("neighborhood is required"),
  city: import_zod2.z.string().nonempty("city is required"),
  state: import_zod2.z.string().nonempty("state is required"),
  postal_code: import_zod2.z.string().optional(),
  country: import_zod2.z.string().nonempty("country is required")
});

// src/controllers/address/CreateAddressController.ts
var CreateAddressController = class {
  async handle(req, res) {
    const data = req.body;
    const parsed = createAddressSchema.safeParse(data);
    if (!parsed.success) {
      return {
        error: true,
        message: parsed.error.errors[0].message,
        code: 400 /* VALIDATION_ERROR */
      };
    }
    const createAddressService = new CreateAddressService();
    const address = await createAddressService.execute(data);
    return res.json(address);
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

// src/controllers/address/GetAllClientAddressController.ts
var GetAllClientAddressController = class {
  async handle(req, res) {
    const { client_id } = req.params;
    const getAllClientAddressService = new GetAllClientAddressService();
    const addresses = await getAllClientAddressService.execute(client_id);
    return res.json(addresses);
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
        discount: data.discount || 0,
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

// src/services/aiIntegration/AIIntegrationService.ts
var import_openai = __toESM(require("openai"));
var AIIntegrationService = class {
  async execute(prompt2, textContent) {
    try {
      const client = new import_openai.default({
        apiKey: process.env.APP_OPENAI_API_KEY
      });
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt2
          },
          {
            role: "user",
            content: textContent
          }
        ],
        temperature: 0,
        response_format: { type: "json_object" }
      });
      const rawContent = response.choices[0].message.content;
      return JSON.parse(rawContent);
    } catch (error) {
      return { error: true, message: error.message, code: 500 /* SYSTEM_ERROR */ };
    }
  }
};

// src/utils/adjustDeliveryDate.ts
var import_moment_timezone2 = __toESM(require("moment-timezone"));
function adjustDeliveryDate(deliveryDate, format = "DD-MM") {
  const now = (0, import_moment_timezone2.default)().tz("America/Sao_Paulo");
  const currentYear = now.year();
  const currentMonth = now.month();
  let date = import_moment_timezone2.default.tz(`${deliveryDate}-${currentYear}`, `${format}-YYYY`, "America/Sao_Paulo");
  if (!date.isValid()) {
    throw new Error(`Data inv\xE1lida: ${deliveryDate}`);
  }
  if (date.month() < currentMonth) {
    date = date.add(1, "year");
  }
  return date.format("YYYY-MM-DD");
}

// src/controllers/order/CreateOrderByAIController.ts
var prompt = `
    Voc\xEA \xE9 um assistente que extrai informa\xE7\xF5es de pedidos de flores.
    Sempre retorne JSON v\xE1lido com os campos:
    - delivery_date (format DD-MM)
    - card_from (client sender name)
    - first_name (client sender name - split(' ')[0])
    - last_name (client sender last name split(' ')[1] and if exists split(' ')[2], if empty send --)
    - phone_number (client sender phone, just the numbers no spaces)
    - receiver_name (receiver name, if not present return null)
    - receiver_phone (just the numbers no spaces, if not present return null)
    - card_to (receiver name, if not present return null)
    - street
    - neighborhood
    - street_number
    - reference
    - city (default Itaperuna)
    - postal_code (default 28300000)
    - card_message
    - is_delivery (boolean - check if has address)
    - pickup_on_store (boolean - check if pick up)
    - has_card (boolean - check if has card)
`;
var CreateOrderByAIController = class {
  constructor() {
    this.handle = async (req, res, next) => {
      const data = req.body;
      const status = "OPENED";
      try {
        const aiIntegration = new AIIntegrationService();
        const content = await aiIntegration.execute(
          prompt,
          data.order_ai_information
        );
        const delivery_date = content["delivery_date"] ? adjustDeliveryDate(content["delivery_date"]) : null;
        const orderData = {
          clientId: null,
          first_name: content["first_name"],
          last_name: content["last_name"],
          phone_number: content["phone_number"],
          receiver_name: content["receiver_name"],
          receiver_phone: content["receiver_phone"],
          addressId: null,
          street: content["street"],
          street_number: content["street_number"],
          neighborhood: content["neighborhood"],
          reference: content["reference"],
          city: content["city"],
          state: "RJ",
          postal_code: content["postal_code"],
          country: "Brasil",
          description: data.description,
          additional_information: data.additional_information,
          delivery_date,
          products_value: data.products_value,
          delivery_fee: data.delivery_fee,
          total: data.total,
          payment_method: data.payment_method,
          payment_received: data.payment_received,
          status,
          has_card: content["has_card"],
          card_from: content["card_from"],
          card_to: content["card_to"],
          card_message: content["card_message"],
          is_delivery: content["is_delivery"],
          created_by: data.created_by,
          online_order: true,
          products: data.products
        };
        const order = await this.orderFacade.createOrder(orderData);
        return res.json(order);
      } catch (error) {
        throw new BadRequestException(
          error.message,
          500 /* SYSTEM_ERROR */
        );
      }
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

// src/services/order/GetOnGoingOrderService.ts
var GetOnGoingOrderService = class {
  async execute() {
    try {
      const orders = await prisma_default.order.findMany({
        where: {
          status: {
            notIn: ["FINISHED", "CANCELED", "DONE"]
          }
        },
        orderBy: {
          code: "desc"
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
      return orders;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/order/GetOnGoingOrderController.ts
var GetOnGoingOrderController = class {
  async handle(req, res) {
    const getOnGoingOrders = new GetOnGoingOrderService();
    const orders = await getOnGoingOrders.execute();
    return res.json(orders);
  }
};

// src/services/order/GetAllOrderService.ts
var GetAllOrderService = class {
  async execute(page = 1, pageSize = 10, query) {
    try {
      const skip = (page - 1) * pageSize;
      const filters = query ? {
        OR: [
          {
            client: {
              OR: [
                { first_name: { contains: query, mode: "insensitive" } },
                { last_name: { contains: query, mode: "insensitive" } },
                { phone_number: { contains: query, mode: "insensitive" } }
              ]
            }
          },
          {
            code: {
              equals: isNaN(Number(query)) ? void 0 : Number(query)
            }
          }
        ]
      } : {};
      const [orders, total] = await Promise.all([
        prisma_default.order.findMany({
          where: filters,
          include: {
            client: true,
            clientAddress: true,
            createdBy: true,
            orderItems: {
              include: {
                product: true
              }
            }
          },
          orderBy: {
            code: "desc"
          },
          skip,
          take: pageSize
        }),
        prisma_default.order.count({
          where: filters
        })
      ]);
      return {
        orders,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/order/GetAllOrderController.ts
var GetAllOrderController = class {
  async handle(req, res) {
    const { page = "1", pageSize = "10", query = "" } = req.query;
    const getAllOrderService = new GetAllOrderService();
    const orders = await getAllOrderService.execute(
      Number(page),
      Number(pageSize),
      String(query)
    );
    return res.json(orders);
  }
};

// src/services/order/UpdateOrderService.ts
var import_moment_timezone3 = __toESM(require("moment-timezone"));
var UpdateOrderService = class {
  async execute(data) {
    const order = {
      ...data
    };
    delete order.products;
    try {
      const formattedDeliveryDate = import_moment_timezone3.default.utc(order.delivery_date).tz("America/Sao_Paulo", true).set({ hour: 12, minute: 0, second: 0 }).toDate();
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

// src/controllers/order/UpdateOrderController.ts
var import_events2 = require("events");
var orderEmitter2 = new import_events2.EventEmitter();
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
    orderEmitter2.emit("orderUpdated", { data });
    return res.json(data);
  }
};

// src/services/order/UpdateOrderStatusService.ts
var UpdateOrderStatusService = class {
  async execute({ id, status }) {
    try {
      const updateOrder = await prisma_default.order.update({
        where: {
          id
        },
        data: {
          status
        },
        include: {
          client: true,
          clientAddress: true
        }
      });
      return updateOrder;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/order/UpdateOrderStatusController.ts
var UpdateOrderStatusController = class {
  async handle(req, res, next) {
    const { id, status } = req.body;
    const updateOrderStatusService = new UpdateOrderStatusService();
    const order = await updateOrderStatusService.execute({
      id,
      status
    });
    return res.json(order);
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

// src/controllers/order/GetOrderController.ts
var GetOrderController = class {
  async handle(req, res) {
    const { id } = req.params;
    const getOrder = new GetOrderService();
    const order = await getOrder.execute(id);
    return res.json(order);
  }
};

// src/services/order/FinishOnlineOrderService.ts
var import_moment_timezone4 = __toESM(require("moment-timezone"));
var FinishOnlineOrderService = class {
  async execute(data) {
    try {
      const formattedDeliveryDate = import_moment_timezone4.default.utc(data.delivery_date).tz("America/Sao_Paulo", true).set({ hour: 12, minute: 0, second: 0 }).toDate();
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

// src/services/order/GetWaitingOnlineOrderService.ts
var GetWaitingOnlineOrderService = class {
  async execute() {
    try {
      const orders = await prisma_default.order.findMany({
        where: {
          status: "WAITING_FOR_CLIENT"
        },
        include: {
          client: true,
          clientAddress: true,
          createdBy: true
        },
        orderBy: {
          code: "desc"
        }
      });
      return { orders };
    } catch (error) {
      throw new BadRequestException(
        "Client already created",
        400 /* USER_ALREADY_EXISTS */
      );
    }
  }
};

// src/controllers/order/GetWaitingOnlineOrderController.ts
var GetWaitingOnlineOrderController = class {
  async handle(req, res) {
    const getWaitingOnlineOrderService = new GetWaitingOnlineOrderService();
    const orders = await getWaitingOnlineOrderService.execute();
    return res.json(orders);
  }
};

// src/services/order/DeleteOrderService.ts
var DeleteOrderService = class {
  async execute(id) {
    try {
      await prisma_default.orderItem.deleteMany({
        where: {
          order_id: id
        }
      });
      const deleteOrder = await prisma_default.order.delete({
        where: {
          id
        }
      });
      return deleteOrder;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/order/DeleteOrderController.ts
var DeleteOrderController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const deleteOrderService = new DeleteOrderService();
    const data = await deleteOrderService.execute(id);
    return res.json(data);
  }
};

// src/services/admin/CreateAdminService.ts
var import_bcrypt = require("bcrypt");
var CreateAdminService = class {
  async execute({ username, name, password, role }) {
    const hashedPassword = await (0, import_bcrypt.hash)(password, 10);
    const admin = await prisma_default.admin.findFirst({
      where: {
        username
      }
    });
    if (admin) {
      throw new BadRequestException(
        "Admin already created",
        400 /* USER_ALREADY_EXISTS */
      );
    }
    try {
      const newAdmin = await prisma_default.admin.create({
        data: {
          username,
          name,
          password: hashedPassword,
          role
        }
      });
      return newAdmin;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/services/admin/ValidateSuperAdminService.ts
var import_bcrypt2 = require("bcrypt");
var ValidateSuperAdminService = class {
  async execute({ currently_admin_password, confirmation_password }) {
    try {
      const comparePassword = await (0, import_bcrypt2.compare)(confirmation_password, currently_admin_password);
      if (!comparePassword) {
        throw new BadRequestException(
          "Invalid super admin password",
          401 /* UNAUTHORIZED */
        );
      }
      return { error: false, message: "Invalid super admin password", code: 200 /* AUTHORIZED */ };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/admin/CreateAdminController.ts
var CreateAdminController = class {
  async handle(req, res, next) {
    const { username, name, password, role, super_admin_password } = req.body;
    const validateSuperAdminService = new ValidateSuperAdminService();
    const superAdmin = req.admin;
    const validateSuperAdmin = await validateSuperAdminService.execute({
      currently_admin_password: superAdmin?.password,
      confirmation_password: super_admin_password
    });
    if (validateSuperAdmin.error) {
      next(new BadRequestException(
        validateSuperAdmin.message,
        validateSuperAdmin.code
      ));
      return;
    }
    const createAdminService = new CreateAdminService();
    const admin = await createAdminService.execute({
      username,
      name,
      password,
      role
    });
    return res.json(admin);
  }
};

// src/services/admin/LoginAdminService.ts
var import_bcrypt3 = require("bcrypt");
var jwt = __toESM(require("jsonwebtoken"));
var LoginAdminService = class {
  async execute({ username, password }) {
    try {
      const admin = await prisma_default.admin.findFirst({
        where: {
          username
        }
      });
      if (!admin) {
        throw new BadRequestException(
          "Admin not found",
          400 /* USER_NOT_FOUND */
        );
      }
      if (!(0, import_bcrypt3.compareSync)(password, admin.password)) {
        throw new BadRequestException(
          "Wrong password",
          400 /* INCORRECT_PASSWORD */
        );
      }
      const token = jwt.sign({
        id: admin.id,
        role: admin.role
      }, process.env.JWT_SECRET, {
        expiresIn: "1y"
      });
      delete admin.password;
      return { admin, token };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/admin/LoginAdminController.ts
var LoginAdminController = class {
  async handle(req, res, next) {
    const { username, name, password, role } = req.body;
    const loginAdminService = new LoginAdminService();
    const login = await loginAdminService.execute({
      username,
      name,
      password,
      role
    });
    return res.json(login);
  }
};

// src/controllers/admin/GetAdminController.ts
var GetAdminController = class {
  async handle(req, res) {
    return res.json(req.admin);
  }
};

// src/services/admin/GetAllAdminService.ts
var GetAllAdminService = class {
  async execute() {
    try {
      const admins = await prisma_default.admin.findMany({
        select: {
          id: true,
          name: true,
          username: true,
          role: true
        }
      });
      return { admins };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/admin/GetAllAdminController.ts
var GetAllAdminController = class {
  async handle(req, res, next) {
    const getAllAdminService = new GetAllAdminService();
    const admins = await getAllAdminService.execute();
    return res.json(admins);
  }
};

// src/services/admin/DeleteAdminService.ts
var DeleteAdminService = class {
  async execute(id) {
    try {
      await prisma_default.admin.delete({
        where: {
          id
        }
      });
      return { Status: "Admin successfully deleted" };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/admin/DeleteAdminController.ts
var DeleteAdminController = class {
  async handle(req, res) {
    const { id } = req.params;
    const deleteAdminService = new DeleteAdminService();
    const admin = await deleteAdminService.execute(id);
    return res.json(admin);
  }
};

// src/services/admin/UpdateAdminService.ts
var import_bcrypt4 = require("bcrypt");
var UpdateAdminService = class {
  async execute({ id, username, name, password, role }) {
    try {
      let data = {
        username,
        name,
        role
      };
      if (password) {
        const hashedPassword = await (0, import_bcrypt4.hash)(password, 10);
        data = {
          ...data,
          password: hashedPassword
        };
      }
      const updatedAdmin = await prisma_default.admin.update({
        where: {
          id
        },
        data
      });
      return updatedAdmin;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/admin/UpdateAdminController.ts
var UpdateAdminController = class {
  async handle(req, res, next) {
    const { id, username, name, password, role, super_admin_password } = req.body;
    const validateSuperAdminService = new ValidateSuperAdminService();
    const superAdmin = req.admin;
    const validateSuperAdmin = await validateSuperAdminService.execute({
      currently_admin_password: superAdmin?.password,
      confirmation_password: super_admin_password
    });
    if (validateSuperAdmin.error) {
      next(new BadRequestException(
        validateSuperAdmin.message,
        validateSuperAdmin.code
      ));
      return;
    }
    const updateAdminService = new UpdateAdminService();
    const admin = await updateAdminService.execute({
      id,
      username,
      name,
      password,
      role
    });
    return res.json(admin);
  }
};

// src/services/pix/GetPixService.ts
var import_axios = __toESM(require("axios"));
var GetPixService = class {
  async execute(token, httpsAgent, initial_date, final_date, limit) {
    const params = new URLSearchParams({
      dataInicio: initial_date,
      dataFim: final_date,
      tipoTransacao: "PIX"
    });
    try {
      const url = `https://cdpj.partners.bancointer.com.br/banking/v2/extrato/completo?${params.toString()}`;
      const response = await import_axios.default.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        httpsAgent
      });
      const transactions = response.data.transacoes;
      if (!Array.isArray(transactions)) {
        throw new Error("O campo 'transactions' n\xE3o \xE9 um array.");
      }
      const receivedTransactions = transactions.filter((transaction) => transaction.titulo === "Pix recebido");
      if (limit) {
        return receivedTransactions.slice(0, limit);
      }
      return receivedTransactions;
    } catch (error) {
      console.log("DEU ERRRO", error);
    }
  }
};

// src/services/pix/GetInterAuthService.ts
var import_axios2 = __toESM(require("axios"));
var _GetInterAuthService = class _GetInterAuthService {
  async execute({ httpsAgent }) {
    const now = Date.now();
    if (_GetInterAuthService.token && now < _GetInterAuthService.tokenExpiresAt) {
      return _GetInterAuthService.token;
    }
    try {
      const url = `https://cdpj.partners.bancointer.com.br/oauth/v2/token`;
      const params = new URLSearchParams();
      params.append("client_id", process.env.BANCO_INTER_CLIENT_ID);
      params.append("client_secret", process.env.BANCO_INTER_CLIENT_SECRET);
      params.append("grant_type", "client_credentials");
      params.append("scope", "webhook.write webhook.read webhook-banking.write webhook-banking.read cob.write extrato.read");
      const response = await import_axios2.default.post(url, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        httpsAgent
      });
      _GetInterAuthService.token = response.data.access_token;
      _GetInterAuthService.tokenExpiresAt = now + 55 * 60 * 1e3;
      return _GetInterAuthService.token;
    } catch (error) {
      console.error("Error fetching access token:", error.response?.data || error.message);
      throw new Error("Failed to fetch access token");
    }
  }
};
_GetInterAuthService.token = null;
_GetInterAuthService.tokenExpiresAt = 0;
var GetInterAuthService = _GetInterAuthService;

// src/utils/getCertificates.ts
var import_https = __toESM(require("https"));
var path3 = __toESM(require("path"));
var pathCerts = path3.join(__dirname, "..", "certs");
var getCertificates = () => {
  const cert = process.env.BANCO_INTER_API_CERT_PATH.replace(/(^"|"$)/g, "");
  const key = process.env.BANCO_INTER_API_KEY_PATH.replace(/(^"|"$)/g, "");
  const httpsAgent = new import_https.default.Agent({
    host: "cdpj.partners.bancointer.com.br",
    cert: Buffer.from(cert, "utf-8"),
    key: Buffer.from(key, "utf-8"),
    rejectUnauthorized: true
  });
  return httpsAgent;
};

// src/controllers/inter/GetPixController.ts
var GetPixController = class {
  async handle(req, res) {
    const { initial_date, final_date, limit } = req.query;
    const httpsAgent = getCertificates();
    const getInterAuthService = new GetInterAuthService();
    const getPixService = new GetPixService();
    const accessToken = await getInterAuthService.execute({ httpsAgent });
    if (!accessToken) {
      throw new Error("Falha ao obter o token de acesso do Banco Inter.");
    }
    const pix = await getPixService.execute(accessToken, httpsAgent, initial_date, final_date, limit);
    return res.json(pix);
  }
};

// src/controllers/inter/WebhookPixController.ts
var import_events3 = require("events");
var eventEmitter = new import_events3.EventEmitter();
var WebhookPixController = class {
  async handle(req, res) {
    console.log("AQUII");
    try {
      console.log("Notifica\xE7\xE3o Pix recebida:", req.body);
      const notification = req.body;
      eventEmitter.emit("pixReceived", notification);
      return res.json(notification);
    } catch (error) {
      console.error("Erro ao processar notifica\xE7\xE3o Pix:", error);
      return res.status(500).send("Erro ao processar notifica\xE7\xE3o");
    }
  }
};

// src/services/statistics/TopClientsService.ts
var TopClientsService = class {
  async execute(initial_date, final_date, limit) {
    const start = new Date(initial_date);
    const end = new Date(final_date);
    try {
      const topClients = await prisma_default.order.groupBy({
        by: ["client_id"],
        where: {
          created_at: {
            gte: start,
            lte: end
          }
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: "desc"
          }
        },
        take: parseInt(limit)
      });
      const result = await Promise.all(
        topClients.map(async (item) => {
          const client = await prisma_default.client.findUnique({
            where: { id: item.client_id },
            select: {
              first_name: true,
              last_name: true,
              phone_number: true
            }
          });
          return {
            ...client,
            totalOrders: item._count.id
          };
        })
      );
      return result;
    } catch (error) {
      return { error: true, message: error.message, code: 500 /* SYSTEM_ERROR */ };
    }
  }
};

// src/controllers/statistics/TopClientsController.ts
var TopClientsController = class {
  async handle(req, res) {
    const { initial_date, final_date, limit } = req.query;
    const topClientsService = new TopClientsService();
    const clients = await topClientsService.execute(initial_date, final_date, limit);
    return res.json(clients);
  }
};

// src/services/statistics/DailySalesService.ts
var DailySalesService = class {
  async execute(initial_date, final_date) {
    const start = new Date(initial_date);
    const end = new Date(final_date);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format");
    }
    const [startDate, endDate] = start > end ? [end, start] : [start, end];
    try {
      const orders = await prisma_default.order.findMany({
        where: {
          created_at: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          created_at: true
        }
      });
      const dayCount = {
        "segunda-feira": 0,
        "ter\xE7a-feira": 0,
        "quarta-feira": 0,
        "quinta-feira": 0,
        "sexta-feira": 0,
        s\u00E1bado: 0,
        domingo: 0
      };
      orders.forEach((order) => {
        const day = new Date(order.created_at).toLocaleString("pt-BR", {
          weekday: "long"
        });
        if (day in dayCount) {
          dayCount[day] += 1;
        }
      });
      return dayCount;
    } catch (error) {
      return { error: true, message: error.message, code: "SYSTEM_ERROR" };
    }
  }
};

// src/controllers/statistics/DailySalesController.ts
var DailySalesController = class {
  async handle(req, res) {
    const { initial_date, final_date } = req.query;
    const dailySalesService = new DailySalesService();
    const sales = await dailySalesService.execute(initial_date, final_date);
    return res.json(sales);
  }
};

// src/services/statistics/TopAdminsService.ts
var TopAdminsService = class {
  async execute() {
    try {
      const topAdmins = await prisma_default.order.groupBy({
        by: ["created_by"],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: "desc"
          }
        }
      });
      const adminsDetails = await prisma_default.admin.findMany({
        where: {
          id: { in: topAdmins.map((admin) => admin.created_by) }
        },
        select: {
          id: true,
          name: true,
          username: true
        }
      });
      const result = topAdmins.map((admin) => {
        const adminData = adminsDetails.find((a) => a.id === admin.created_by);
        return {
          id: admin.created_by,
          name: adminData?.name || "Unknown",
          username: adminData?.username || "Unknown",
          orders_count: admin._count.id
        };
      });
      return result;
    } catch (error) {
      return { error: true, message: error.message, code: 500 /* SYSTEM_ERROR */ };
    }
  }
};

// src/controllers/statistics/TopAdminsController.ts
var TopAdminsController = class {
  async handle(req, res) {
    const topAdminsService = new TopAdminsService();
    const admins = await topAdminsService.execute();
    return res.json(admins);
  }
};

// src/services/stockTransaction/CreateStockTransactionService.ts
var import_moment_timezone5 = __toESM(require("moment-timezone"));
var CreateStockTransactionService = class {
  async execute({ product_id, supplier, unity, quantity, unity_price, purchased_date, total_price }) {
    try {
      const formattedPurchasedDate = import_moment_timezone5.default.utc(purchased_date).tz("America/Sao_Paulo", true).set({ hour: 12, minute: 0, second: 0 }).toDate();
      const transaction = await prisma_default.stockTransaction.create({
        data: {
          product_id,
          supplier,
          unity,
          quantity,
          unity_price,
          total_price,
          purchased_date: formattedPurchasedDate
        }
      });
      return transaction;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/stockTransaction/CreateStockTransactionController.ts
var CreateStockTransactionController = class {
  async handle(req, res, next) {
    const { product_id, supplier, unity, quantity, unity_price, purchased_date, total_price } = req.body;
    const createStockTransactionService = new CreateStockTransactionService();
    const transaction = await createStockTransactionService.execute({
      product_id,
      supplier,
      unity,
      quantity,
      unity_price,
      purchased_date,
      total_price
    });
    return res.json(transaction);
  }
};

// src/services/stockTransaction/GetAllStockTransactionsService.ts
var GetAllStockTransactionsService = class {
  async execute(page = 1, pageSize = 10, query) {
    try {
      const skip = (page - 1) * pageSize;
      const filters = query ? {
        OR: [
          {
            product: {
              name: {
                contains: query,
                mode: "insensitive"
              }
            }
          },
          {
            supplier: {
              contains: query,
              mode: "insensitive"
            }
          }
        ]
      } : {};
      const [stockTransaction, total] = await Promise.all([
        prisma_default.stockTransaction.findMany({
          where: filters,
          include: {
            product: true
          },
          orderBy: {
            purchased_date: "desc"
          },
          skip,
          take: pageSize
        }),
        prisma_default.stockTransaction.count({
          where: filters
        })
      ]);
      return {
        stockTransactions: stockTransaction,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/stockTransaction/GetAllStockTransactionsController.ts
var GetAllStockTransactionsController = class {
  async handle(req, res, next) {
    const { page = "1", pageSize = "10", query = "" } = req.query;
    const getAllService = new GetAllStockTransactionsService();
    const transactions = await getAllService.execute(
      Number(page),
      Number(pageSize),
      String(query)
    );
    return res.json(transactions);
  }
};

// src/services/stockTransaction/DeleteStockTransactionService.ts
var DeleteStockTransactionService = class {
  async execute(id) {
    try {
      const existing = await prisma_default.stockTransaction.findUnique({
        where: { id }
      });
      if (!existing) {
        throw new BadRequestException(
          "Transaction not found",
          400 /* USER_NOT_FOUND */
        );
      }
      const transaction = await prisma_default.stockTransaction.delete({
        where: { id }
      });
      return transaction;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/stockTransaction/DeleteStockTransactionController.ts
var DeleteStockTransactionController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const deleteService = new DeleteStockTransactionService();
    const transaction = await deleteService.execute(id);
    return res.json(transaction);
  }
};

// src/middlewares/admin_auth.ts
var jwt2 = __toESM(require("jsonwebtoken"));

// src/exceptions/unauthorized.ts
var UnauthorizedRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 401, null);
  }
};

// src/middlewares/admin_auth.ts
var adminAuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    next(new UnauthorizedRequestException("Unauthorized", 401 /* UNAUTHORIZED */));
  }
  try {
    const payload = jwt2.verify(token, process.env.JWT_SECRET);
    const admin = await prisma_default.admin.findFirst({
      where: {
        id: payload.id
      }
    });
    if (!admin) {
      next(new UnauthorizedRequestException("Unauthorized", 401 /* UNAUTHORIZED */));
    }
    req.admin = admin;
    next();
  } catch (error) {
    next(new UnauthorizedRequestException("Unauthorized", 401 /* UNAUTHORIZED */));
  }
};
var admin_auth_default = adminAuthMiddleware;

// src/middlewares/super_admin_auth.ts
var jwt3 = __toESM(require("jsonwebtoken"));
var superAdminAuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    next(new UnauthorizedRequestException("Unauthorized", 401 /* UNAUTHORIZED */));
  }
  try {
    const payload = jwt3.verify(token, process.env.JWT_SECRET);
    const admin = await prisma_default.admin.findFirst({
      where: {
        id: payload.id
      }
    });
    if (!admin) {
      next(new UnauthorizedRequestException("Unauthorized", 401 /* UNAUTHORIZED */));
    }
    if (admin?.role !== "SUPER_ADMIN") {
      next(new UnauthorizedRequestException("Unauthorized", 401 /* UNAUTHORIZED */));
    }
    req.admin = admin;
    next();
  } catch (error) {
    next(new UnauthorizedRequestException("Unauthorized", 401 /* UNAUTHORIZED */));
  }
};
var super_admin_auth_default = superAdminAuthMiddleware;

// src/config/multer.ts
var import_multer = __toESM(require("multer"));
var import_path3 = __toESM(require("path"));
var import_crypto = __toESM(require("crypto"));
var import_fs3 = __toESM(require("fs"));
var uploadDir = import_path3.default.resolve(__dirname, "..", "..", "uploads", "products");
if (!import_fs3.default.existsSync(uploadDir)) {
  import_fs3.default.mkdirSync(uploadDir, { recursive: true });
  console.log("[Multer] Upload directory created:", uploadDir);
}
var storage = import_multer.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const hash3 = import_crypto.default.randomBytes(16).toString("hex");
    const filename = `${hash3}-${Date.now()}${import_path3.default.extname(file.originalname)}`;
    cb(null, filename);
  }
});
var fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException(
      "Invalid file type. Only JPEG, JPG, PNG and WEBP are allowed",
      400 /* VALIDATION_ERROR */
    ));
  }
};
var upload = (0, import_multer.default)({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024
    // 100KB
  }
});

// src/middlewares/process_image.ts
var import_sharp = __toESM(require("sharp"));
var import_fs4 = __toESM(require("fs"));
var import_path4 = __toESM(require("path"));
var processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const uploadDir2 = import_path4.default.resolve(__dirname, "..", "..", "uploads", "products");
  const inputPath = req.file.path;
  const date = /* @__PURE__ */ new Date();
  const outputFilename = `optimized-${date.getTime()}-${req.file.filename}`;
  const outputPath = import_path4.default.join(uploadDir2, outputFilename);
  try {
    await (0, import_sharp.default)(inputPath).resize(800, 800, {
      fit: "inside",
      withoutEnlargement: true
    }).jpeg({ quality: 80 }).toFile(outputPath);
    const stats = import_fs4.default.statSync(outputPath);
    const fileSizeInKB = stats.size / 1024;
    if (fileSizeInKB > 100) {
      await (0, import_sharp.default)(inputPath).resize(600, 600, {
        fit: "inside",
        withoutEnlargement: true
      }).jpeg({ quality: 60 }).toFile(outputPath);
      const newStats = import_fs4.default.statSync(outputPath);
      const newFileSizeInKB = newStats.size / 1024;
      if (newFileSizeInKB > 100) {
        import_fs4.default.unlinkSync(inputPath);
        import_fs4.default.unlinkSync(outputPath);
        return next(
          new BadRequestException(
            "Image is too large even after compression. Please upload a smaller image.",
            400 /* VALIDATION_ERROR */
          )
        );
      }
    }
    import_fs4.default.unlinkSync(inputPath);
    req.file.filename = outputFilename;
    req.file.path = outputPath;
    req.file.size = import_fs4.default.statSync(outputPath).size;
    next();
  } catch (error) {
    console.error("[processImage] Failed:", error);
    if (import_fs4.default.existsSync(inputPath)) {
      import_fs4.default.unlinkSync(inputPath);
    }
    if (import_fs4.default.existsSync(outputPath)) {
      import_fs4.default.unlinkSync(outputPath);
    }
    next(
      new BadRequestException(
        "Failed to process image",
        500 /* SYSTEM_ERROR */
      )
    );
  }
};

// src/middlewares/multer_error.ts
var import_multer2 = __toESM(require("multer"));
var handleMulterError = (err, req, res, next) => {
  if (err instanceof import_multer2.default.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        new BadRequestException(
          "File is too large. Maximum size is 100KB",
          400 /* VALIDATION_ERROR */
        )
      );
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return next(
        new BadRequestException(
          "Unexpected field in form data",
          400 /* VALIDATION_ERROR */
        )
      );
    }
    return next(
      new BadRequestException(
        err.message,
        400 /* VALIDATION_ERROR */
      )
    );
  }
  next(err);
};

// src/routes.ts
var router = (0, import_express.Router)();
router.get("/dashboard", admin_auth_default, new DashboardController().handle);
router.post("/client", admin_auth_default, new CreateClientController().handle);
router.post("/client/new/online", new CreateClientController().handle);
router.get("/clients/all", admin_auth_default, new GetAllClientController().handle);
router.get("/client/phone_number", new GetClientByPhoneNumbeController().handle);
router.get("/client/:id", super_admin_auth_default, new GetClientController().handle);
router.put("/client/:id", admin_auth_default, new UpdateClientController().handle);
router.post("/address", admin_auth_default, new CreateAddressController().handle);
router.get("/address/pickup", admin_auth_default, new GetPickUpAddressController().handle);
router.get("/address/:client_id", new GetAllClientAddressController().handle);
router.get("/order/completedOrder/:id", new GetOrderController().handle);
router.get("/order/ongoing", admin_auth_default, new GetOnGoingOrderController().handle);
router.get("/order/all", admin_auth_default, new GetAllOrderController().handle);
router.get("/order/waitingForClient", admin_auth_default, new GetWaitingOnlineOrderController().handle);
router.post("/order", admin_auth_default, new CreateOrderController().handle);
router.post("/order/ai", admin_auth_default, new CreateOrderByAIController().handle);
router.put("/order/:id", admin_auth_default, new UpdateOrderController().handle);
router.put("/order/finish/:id", new FinishOnlineOrderController().handle);
router.patch("/order/:id", admin_auth_default, new UpdateOrderStatusController().handle);
router.delete("/order/:id", admin_auth_default, new DeleteOrderController().handle);
router.post("/product", admin_auth_default, new CreateProductController().handle);
router.put("/product/:id", super_admin_auth_default, new UpdateProductController().handle);
router.get("/product/all", super_admin_auth_default, new GetAllProductController().handle);
router.get("/product/search", super_admin_auth_default, new SearchProductsController().handle);
router.post("/product/:id/image", admin_auth_default, upload.single("image"), handleMulterError, processImage, new UploadProductImageController().handle);
router.delete("/product/:id/image", admin_auth_default, new DeleteProductImageController().handle);
router.post("/admin", super_admin_auth_default, new CreateAdminController().handle);
router.post("/admins/login", new LoginAdminController().handle);
router.get("/admins/admin", admin_auth_default, new GetAdminController().handle);
router.get("/admins/all", super_admin_auth_default, new GetAllAdminController().handle);
router.delete("/admins/delete/:id", super_admin_auth_default, new DeleteAdminController().handle);
router.put("/admin/:id", super_admin_auth_default, new UpdateAdminController().handle);
router.get("/pix", super_admin_auth_default, new GetPixController().handle);
router.post("/webhook/pix", super_admin_auth_default, new WebhookPixController().handle);
router.get("/statistics/top-clients", super_admin_auth_default, new TopClientsController().handle);
router.get("/statistics/daily-sales", super_admin_auth_default, new DailySalesController().handle);
router.get("/statistics/top-admins", super_admin_auth_default, new TopAdminsController().handle);
router.get("/stockTransaction/all", admin_auth_default, new GetAllStockTransactionsController().handle);
router.post("/stockTransaction", admin_auth_default, new CreateStockTransactionController().handle);
router.delete("/stockTransaction/:id", admin_auth_default, new DeleteStockTransactionController().handle);

// src/middlewares/errors.ts
var errorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const errorCode = error.errorCode || "INTERNAL_ERROR";
  const message = error.message || "Internal server error";
  res.status(statusCode).json({
    message,
    errorCode
  });
};

// src/server.ts
import_dotenv.default.config();
orderEmitter.on("onlineOrderReceived" /* OnlineOrderReceived */, (data) => {
  io.emit("onlineOrderReceived" /* OnlineOrderReceived */, data);
});
var app = (0, import_express2.default)();
app.use((0, import_cors.default)({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));
app.use(import_express2.default.json());
app.use("/uploads", import_express2.default.static(import_path5.default.resolve(__dirname, "..", "uploads")));
app.use(router);
app.use(errorMiddleware);
var PORT = 3333;
var isProduction = process.env.IS_PRODUCTION === "true";
var server;
if (isProduction) {
  server = import_http.default.createServer(app).listen(PORT, () => {
    console.log(`Servidor rodando em https://localhost:${PORT}`);
  });
} else {
  server = import_http.default.createServer(app).listen(3334, () => {
    console.log(`Servidor rodando em http://localhost:3334`);
  });
}
var io = new import_socket.Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
  }
});
io.on("connection", (socket) => {
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  io
});
