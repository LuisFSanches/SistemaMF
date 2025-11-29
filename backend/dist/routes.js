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

// src/routes.ts
var routes_exports = {};
__export(routes_exports, {
  router: () => router
});
module.exports = __toCommonJS(routes_exports);
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
        },
        created_by: {
          not: null
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
        id: { in: topAdmins.map((admin) => admin.created_by).filter((id) => id !== null) }
      },
      select: {
        id: true,
        name: true,
        username: true
      }
    });
    const admins = topAdmins.filter((admin) => admin.created_by !== null).map((admin) => {
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
var import_qrcode = __toESM(require("qrcode"));
var CreateProductService = class {
  async execute(data) {
    try {
      const product = await prisma_default.product.create({
        data
      });
      const qrCodeDataURL = await import_qrcode.default.toDataURL(product.id, {
        errorCorrectionLevel: "M",
        type: "image/png",
        width: 300,
        margin: 1
      });
      const updatedProduct = await prisma_default.product.update({
        where: { id: product.id },
        data: { qr_code: qrCodeDataURL }
      });
      return updatedProduct;
    } catch (error) {
      console.error("[CreateProductService] Failed:", error);
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
      if (query && query.trim()) {
        const searchTerms = query.trim().split(/\s+/).filter((term) => term.length > 0);
        const conditions = searchTerms.map(
          (_, index) => `replace(unaccent(lower(name)), ' ', '') LIKE '%' || replace(unaccent(lower($${index + 1})), ' ', '') || '%'`
        ).join(" AND ");
        const products2 = await prisma_default.$queryRawUnsafe(
          `
						SELECT id, name, image, price, unity, stock, enabled, qr_code, visible_in_store
						FROM "products"
						WHERE enabled = true
						AND ${conditions}
						ORDER BY created_at DESC
						LIMIT $${searchTerms.length + 1} OFFSET $${searchTerms.length + 2}
					`,
          ...searchTerms,
          pageSize,
          skip
        );
        const totalResult = await prisma_default.$queryRawUnsafe(
          `
						SELECT COUNT(*) as count
						FROM "products"
						WHERE enabled = true
						AND ${conditions}
					`,
          ...searchTerms
        );
        const total2 = Number(totalResult[0].count);
        return {
          products: products2,
          total: total2,
          currentPage: page,
          totalPages: Math.ceil(total2 / pageSize)
        };
      }
      const [products, total] = await Promise.all([
        prisma_default.product.findMany({
          where: { enabled: true },
          skip,
          take: pageSize,
          select: {
            id: true,
            name: true,
            image: true,
            price: true,
            unity: true,
            stock: true,
            enabled: true,
            qr_code: true,
            visible_in_store: true
          },
          orderBy: {
            created_at: "desc"
          }
        }),
        prisma_default.product.count({
          where: { enabled: true }
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

// src/services/product/GetProductByIdService.ts
var GetProductByIdService = class {
  async execute({ id }) {
    try {
      const product = await prisma_default.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          price: true,
          unity: true,
          stock: true,
          enabled: true,
          image: true,
          qr_code: true,
          created_at: true,
          updated_at: true,
          visible_in_store: true
        }
      });
      if (!product) {
        throw new BadRequestException(
          "Product not found",
          400 /* USER_NOT_FOUND */
        );
      }
      return product;
    } catch (error) {
      console.error("[GetProductByIdService] Failed:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/product/GetProductByIdController.ts
var GetProductByIdController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const getProductByIdService = new GetProductByIdService();
    const product = await getProductByIdService.execute({ id });
    return res.json(product);
  }
};

// src/services/product/UpdateProductService.ts
var UpdateProductService = class {
  async execute({ id, name, price, unity, stock, enabled, image, visible_in_store }) {
    try {
      let data = {
        name,
        price,
        unity,
        stock,
        enabled,
        image,
        visible_in_store
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
    const { name, price, unity, stock, enabled, image, visible_in_store } = req.body;
    const id = req.params.id;
    const updateProductService = new UpdateProductService();
    const admin = await updateProductService.execute({
      id,
      name,
      price,
      unity,
      stock,
      enabled,
      image,
      visible_in_store
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
                AND replace(unaccent(lower(name)), ' ', '') LIKE '%' || replace(unaccent(lower($1)), ' ', '') || '%'
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
var import_fs2 = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));

// src/config/paths.ts
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
function findProjectRoot(startPath) {
  let currentPath = startPath;
  while (currentPath !== "/") {
    const packageJsonPath = import_path.default.join(currentPath, "package.json");
    if (import_fs.default.existsSync(packageJsonPath)) {
      return currentPath;
    }
    currentPath = import_path.default.dirname(currentPath);
  }
  return import_path.default.resolve(startPath, "..", "..");
}
var isCompiled = __dirname.includes("/dist/");
var rootDir = findProjectRoot(__dirname);
var uploadsDir = import_path.default.join(rootDir, "uploads");
var productsUploadDir = import_path.default.join(uploadsDir, "products");
if (!import_fs.default.existsSync(uploadsDir)) {
  import_fs.default.mkdirSync(uploadsDir, { recursive: true });
  console.log("[Paths] Created uploads directory:", uploadsDir);
}
if (!import_fs.default.existsSync(productsUploadDir)) {
  import_fs.default.mkdirSync(productsUploadDir, { recursive: true });
  console.log("[Paths] Created products upload directory:", productsUploadDir);
}

// src/services/product/UploadProductImageService.ts
var UploadProductImageService = class {
  async execute({ product_id, filename }) {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3334";
    const product = await prisma_default.product.findFirst({
      where: { id: product_id }
    });
    if (!product) {
      const filePath = import_path2.default.join(productsUploadDir, filename);
      if (import_fs2.default.existsSync(filePath)) {
        import_fs2.default.unlinkSync(filePath);
      }
      throw new BadRequestException(
        "Product not found",
        400 /* USER_NOT_FOUND */
      );
    }
    if (product.image) {
      const oldImagePath = product.image.replace(`${backendUrl}/uploads/products/`, "");
      const oldFilePath = import_path2.default.join(productsUploadDir, oldImagePath);
      if (import_fs2.default.existsSync(oldFilePath)) {
        import_fs2.default.unlinkSync(oldFilePath);
      }
    }
    const imageUrl = `${backendUrl}/uploads/products/${filename}`;
    try {
      const updatedProduct = await prisma_default.product.update({
        where: { id: product_id },
        data: { image: imageUrl }
      });
      return updatedProduct;
    } catch (error) {
      console.error("[UploadProductImageService] Failed:", error);
      const filePath = import_path2.default.join(productsUploadDir, filename);
      if (import_fs2.default.existsSync(filePath)) {
        import_fs2.default.unlinkSync(filePath);
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
    return res.json(product);
  }
};

// src/services/product/DeleteProductImageService.ts
var import_fs3 = __toESM(require("fs"));
var import_path3 = __toESM(require("path"));
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
    const filePath = import_path3.default.join(productsUploadDir, imagePath);
    if (import_fs3.default.existsSync(filePath)) {
      import_fs3.default.unlinkSync(filePath);
    } else {
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

// src/services/product/GenerateProductQRCodeService.ts
var import_qrcode2 = __toESM(require("qrcode"));
var GenerateProductQRCodeService = class {
  async execute({ id }) {
    try {
      const product = await prisma_default.product.findUnique({
        where: { id }
      });
      if (!product) {
        throw new BadRequestException(
          "Product not found",
          400 /* USER_NOT_FOUND */
        );
      }
      const qrCodeDataURL = await import_qrcode2.default.toDataURL(id, {
        errorCorrectionLevel: "M",
        type: "image/png",
        width: 300,
        margin: 1
      });
      const updatedProduct = await prisma_default.product.update({
        where: { id },
        data: { qr_code: qrCodeDataURL },
        select: {
          id: true,
          name: true,
          qr_code: true
        }
      });
      return updatedProduct;
    } catch (error) {
      console.error("[GenerateProductQRCodeService] Failed:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/product/GenerateProductQRCodeController.ts
var GenerateProductQRCodeController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const generateProductQRCodeService = new GenerateProductQRCodeService();
    const product = await generateProductQRCodeService.execute({ id });
    return res.json(product);
  }
};

// src/services/product/GetStoreFrontProductsService.ts
var GetStoreFrontProductsService = class {
  async execute(page = 1, pageSize = 8, query) {
    try {
      const skip = (page - 1) * pageSize;
      if (query && query.trim()) {
        const searchTerms = query.trim().split(/\s+/).filter((term) => term.length > 0);
        const conditions = searchTerms.map(
          (_, index) => `replace(unaccent(lower(name)), ' ', '') LIKE '%' || replace(unaccent(lower($${index + 1})), ' ', '') || '%'`
        ).join(" AND ");
        const products2 = await prisma_default.$queryRawUnsafe(
          `
						SELECT id, name, image, price, unity, stock, enabled, qr_code
						FROM "products"
						WHERE enabled = true
						AND visible_in_store = true
						AND ${conditions}
						ORDER BY created_at DESC
						LIMIT $${searchTerms.length + 1} OFFSET $${searchTerms.length + 2}
					`,
          ...searchTerms,
          pageSize,
          skip
        );
        const totalResult = await prisma_default.$queryRawUnsafe(
          `
						SELECT COUNT(*) as count
						FROM "products"
						WHERE enabled = true
						AND visible_in_store = true
						AND ${conditions}
					`,
          ...searchTerms
        );
        const total2 = Number(totalResult[0].count);
        return {
          products: products2,
          total: total2,
          currentPage: page,
          totalPages: Math.ceil(total2 / pageSize)
        };
      }
      const [products, total] = await Promise.all([
        prisma_default.product.findMany({
          where: {
            enabled: true,
            visible_in_store: true
          },
          skip,
          take: pageSize,
          select: {
            id: true,
            name: true,
            image: true,
            price: true,
            unity: true,
            stock: true,
            enabled: true,
            qr_code: true
          },
          orderBy: {
            created_at: "desc"
          }
        }),
        prisma_default.product.count({
          where: {
            enabled: true,
            visible_in_store: true
          }
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

// src/controllers/product/GetStoreFrontProductsController.ts
var GetStoreFrontProductsController = class {
  async handle(req, res, next) {
    const { page = "1", pageSize = "10", query = "" } = req.query;
    const getStoreFrontProductsService = new GetStoreFrontProductsService();
    const products = await getStoreFrontProductsService.execute(
      Number(page),
      Number(pageSize),
      String(query)
    );
    return res.json(products);
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
        store_front_order: data.store_front_order,
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
      console.error("[CreateOrderService] Failed:", error);
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

// src/events/orderEvents.ts
var import_events = require("events");
var orderEmitter = new import_events.EventEmitter();

// src/controllers/order/CreateOrderController.ts
var CreateOrderController = class {
  constructor() {
    this.handle = async (req, res, next) => {
      const data = req.body;
      const order = await this.orderFacade.createOrder(data);
      if (!order.created_by) {
        orderEmitter.emit("storeFrontOrderReceived" /* StoreFrontOderReceived */, order);
      }
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
          store_front_order: false,
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

// src/services/order/UpdateOrderPaymentService.ts
var UpdateOrderPaymentService = class {
  async execute({ id, payment_received }) {
    try {
      const orderExists = await prisma_default.order.findUnique({
        where: { id }
      });
      if (!orderExists) {
        throw new BadRequestException(
          "Order not found",
          400 /* USER_NOT_FOUND */
        );
      }
      const updateOrder = await prisma_default.order.update({
        where: {
          id
        },
        data: {
          payment_received
        },
        include: {
          client: true,
          clientAddress: true
        }
      });
      return updateOrder;
    } catch (error) {
      console.error("[UpdateOrderPaymentService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/order/UpdateOrderPaymentController.ts
var UpdateOrderPaymentController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const { payment_received } = req.body;
    const updateOrderPaymentService = new UpdateOrderPaymentService();
    const order = await updateOrderPaymentService.execute({
      id,
      payment_received
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
        },
        include: {
          client: true
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
    orderEmitter.emit("whatsappOrderReceived" /* WhatsappOrderReceived */, data);
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
var path4 = __toESM(require("path"));
var pathCerts = path4.join(__dirname, "..", "certs");
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

// src/services/stockTransaction/CreateStockTransactionService.ts
var import_moment_timezone5 = __toESM(require("moment-timezone"));
var CreateStockTransactionService = class {
  async execute({ product_id, supplier, unity, quantity, unity_price, purchased_date, total_price }) {
    try {
      const formattedPurchasedDate = import_moment_timezone5.default.utc(purchased_date).tz("America/Sao_Paulo", true).set({ hour: 12, minute: 0, second: 0 }).toDate();
      let supplierRecord = await prisma_default.supplier.findFirst({
        where: { name: supplier.trim() }
      });
      if (!supplierRecord) {
        supplierRecord = await prisma_default.supplier.create({
          data: { name: supplier.trim() }
        });
      }
      const transaction = await prisma_default.stockTransaction.create({
        data: {
          product_id,
          supplier,
          // Manter para compatibilidade (deprecated)
          supplier_id: supplierRecord.id,
          // Nova referência
          unity,
          quantity,
          unity_price,
          total_price,
          purchased_date: formattedPurchasedDate
        },
        include: {
          product: true,
          supplierRelation: true
        }
      });
      return transaction;
    } catch (error) {
      console.error("[CreateStockTransactionService] Failed:", error);
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
            product: true,
            supplierRelation: true
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

// src/services/stockTransaction/GetProductStockDetailsService.ts
var GetProductStockDetailsService = class {
  async execute(product_id) {
    try {
      const product = await prisma_default.product.findUnique({
        where: { id: product_id },
        select: {
          id: true,
          name: true,
          image: true,
          stock: true,
          price: true
        }
      });
      if (!product) {
        throw new BadRequestException(
          "Product not found",
          400 /* USER_NOT_FOUND */
        );
      }
      const transactions = await prisma_default.stockTransaction.findMany({
        where: { product_id },
        include: {
          supplierRelation: true
        },
        orderBy: {
          purchased_date: "desc"
        }
      });
      const formattedTransactions = transactions.map((transaction) => ({
        id: transaction.id,
        purchased_date: transaction.purchased_date,
        supplier: transaction.supplierRelation?.name || transaction.supplier,
        unity: transaction.unity,
        quantity: transaction.quantity,
        unity_price: transaction.unity_price,
        total_price: transaction.total_price
      }));
      const priceHistory = transactions.map((transaction) => ({
        date: transaction.purchased_date,
        unity_price: transaction.unity_price
      })).sort((a, b) => a.date.getTime() - b.date.getTime());
      const totalQuantityPurchased = transactions.reduce(
        (sum, transaction) => sum + transaction.quantity,
        0
      );
      const averagePrice = transactions.length > 0 ? transactions.reduce((sum, transaction) => sum + transaction.unity_price, 0) / transactions.length : 0;
      const lastPurchaseDate = transactions.length > 0 ? transactions[0].purchased_date : null;
      const metrics = {
        total_quantity_purchased: totalQuantityPurchased,
        current_stock: product.stock,
        average_price: averagePrice,
        last_purchase_date: lastPurchaseDate
      };
      return {
        product_info: {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price
        },
        transactions: formattedTransactions,
        price_history: priceHistory,
        metrics
      };
    } catch (error) {
      console.error("[GetProductStockDetailsService] Failed:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/stockTransaction/GetProductStockDetailsController.ts
var GetProductStockDetailsController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const getProductStockDetailsService = new GetProductStockDetailsService();
    const stockDetails = await getProductStockDetailsService.execute(id);
    return res.json(stockDetails);
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

// src/schemas/supplier/createSupplier.ts
var import_zod3 = require("zod");
var createSupplierSchema = import_zod3.z.object({
  name: import_zod3.z.string().nonempty("Supplier name is required").trim()
});

// src/services/supplier/CreateSupplierService.ts
var CreateSupplierService = class {
  async execute(data) {
    const parsed = createSupplierSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors[0].message,
        400 /* VALIDATION_ERROR */
      );
    }
    const existingSupplier = await prisma_default.supplier.findFirst({
      where: { name: parsed.data.name }
    });
    if (existingSupplier) {
      throw new BadRequestException(
        "Supplier already exists",
        400 /* USER_ALREADY_EXISTS */
      );
    }
    try {
      const supplier = await prisma_default.supplier.create({
        data: {
          name: parsed.data.name
        }
      });
      return supplier;
    } catch (error) {
      console.error("[CreateSupplierService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/supplier/CreateSupplierController.ts
var CreateSupplierController = class {
  async handle(req, res, next) {
    const { name } = req.body;
    const createSupplierService = new CreateSupplierService();
    const supplier = await createSupplierService.execute({
      name
    });
    return res.json(supplier);
  }
};

// src/services/supplier/GetAllSuppliersService.ts
var GetAllSuppliersService = class {
  async execute() {
    try {
      const suppliers = await prisma_default.supplier.findMany({
        orderBy: {
          name: "asc"
        },
        include: {
          _count: {
            select: {
              stockTransactions: true
            }
          }
        }
      });
      return suppliers;
    } catch (error) {
      console.error("[GetAllSuppliersService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/supplier/GetAllSuppliersController.ts
var GetAllSuppliersController = class {
  async handle(req, res, next) {
    const getAllSuppliersService = new GetAllSuppliersService();
    const suppliers = await getAllSuppliersService.execute();
    return res.json(suppliers);
  }
};

// src/schemas/deliveryMan/createDeliveryMan.ts
var import_zod4 = require("zod");
var createDeliveryManSchema = import_zod4.z.object({
  name: import_zod4.z.string().nonempty("name is required"),
  phone_number: import_zod4.z.string().nonempty("phone_number is required")
});

// src/services/deliveryMan/CreateDeliveryManService.ts
var CreateDeliveryManService = class {
  async execute(data) {
    const parsed = createDeliveryManSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors[0].message,
        400 /* VALIDATION_ERROR */
      );
    }
    const existingDeliveryMan = await prisma_default.deliveryMan.findFirst({
      where: { phone_number: parsed.data.phone_number }
    });
    if (existingDeliveryMan) {
      throw new BadRequestException(
        "Delivery man with this phone number already exists",
        400 /* USER_ALREADY_EXISTS */
      );
    }
    try {
      const deliveryMan = await prisma_default.deliveryMan.create({
        data: {
          name: parsed.data.name,
          phone_number: parsed.data.phone_number
        }
      });
      return deliveryMan;
    } catch (error) {
      console.error("[CreateDeliveryManService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/deliveryMan/CreateDeliveryManController.ts
var CreateDeliveryManController = class {
  async handle(req, res, next) {
    const { name, phone_number } = req.body;
    const createDeliveryManService = new CreateDeliveryManService();
    const deliveryMan = await createDeliveryManService.execute({
      name,
      phone_number
    });
    return res.json(deliveryMan);
  }
};

// src/services/deliveryMan/GetAllDeliveryMenService.ts
var GetAllDeliveryMenService = class {
  async execute(page = 1, pageSize = 10, query) {
    try {
      const skip = (page - 1) * pageSize;
      const filters = query ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { phone_number: { contains: query, mode: "insensitive" } }
        ]
      } : {};
      const [deliveryMen, total] = await Promise.all([
        prisma_default.deliveryMan.findMany({
          where: filters,
          skip,
          take: pageSize,
          orderBy: {
            name: "asc"
          }
        }),
        prisma_default.deliveryMan.count({ where: filters })
      ]);
      return {
        deliveryMen,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error) {
      console.error("[GetAllDeliveryMenService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/deliveryMan/GetAllDeliveryMenController.ts
var GetAllDeliveryMenController = class {
  async handle(req, res, next) {
    const { page = "1", pageSize = "10", query = "" } = req.query;
    const getAllDeliveryMenService = new GetAllDeliveryMenService();
    const deliveryMen = await getAllDeliveryMenService.execute(Number(page), Number(pageSize), String(query));
    return res.json(deliveryMen);
  }
};

// src/services/deliveryMan/GetDeliveryManService.ts
var GetDeliveryManService = class {
  async execute({ id }) {
    try {
      const deliveryMan = await prisma_default.deliveryMan.findFirst({
        where: { id }
      });
      if (!deliveryMan) {
        throw new BadRequestException(
          "Delivery man not found",
          400 /* USER_NOT_FOUND */
        );
      }
      const orderDeliveries = await prisma_default.orderDelivery.findMany({
        where: {
          delivery_man_id: id,
          is_archived: false
        },
        include: {
          order: {
            select: {
              code: true,
              delivery_fee: true
            }
          }
        },
        orderBy: {
          delivery_date: "desc"
        }
      });
      const deliveries = orderDeliveries.map((delivery) => ({
        id: delivery.id,
        order_code: delivery.order.code,
        delivery_date: delivery.delivery_date,
        delivery_fee: delivery.order.delivery_fee,
        is_paid: delivery.is_paid
      }));
      const historyMap = /* @__PURE__ */ new Map();
      orderDeliveries.forEach((delivery) => {
        const dateKey = delivery.delivery_date.toISOString().split("T")[0];
        const existing = historyMap.get(dateKey) || { count: 0, total: 0 };
        historyMap.set(dateKey, {
          count: existing.count + 1,
          total: existing.total + delivery.order.delivery_fee
        });
      });
      const deliveryHistory = Array.from(historyMap.entries()).map(([date, data]) => ({
        date,
        count: data.count,
        total: data.total
      })).sort((a, b) => a.date.localeCompare(b.date));
      const totalDeliveries = orderDeliveries.length;
      const totalPaid = orderDeliveries.filter((d) => d.is_paid).reduce((sum, d) => sum + d.order.delivery_fee, 0);
      const pendingPayment = orderDeliveries.filter((d) => !d.is_paid).reduce((sum, d) => sum + d.order.delivery_fee, 0);
      return {
        deliveryMan: {
          name: deliveryMan.name,
          phone_number: deliveryMan.phone_number
        },
        deliveries,
        deliveryHistory,
        summary: {
          total_deliveries: totalDeliveries,
          total_paid: totalPaid,
          pending_payment: pendingPayment
        }
      };
    } catch (error) {
      console.error("[GetDeliveryManService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/deliveryMan/GetDeliveryManController.ts
var GetDeliveryManController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const getDeliveryManService = new GetDeliveryManService();
    const deliveryMan = await getDeliveryManService.execute({ id });
    return res.json(deliveryMan);
  }
};

// src/services/deliveryMan/GetDeliveryManByPhoneService.ts
var GetDeliveryManByPhoneService = class {
  async execute({ phone_code }) {
    if (!phone_code) {
      throw new BadRequestException(
        "phone_code is required",
        400 /* VALIDATION_ERROR */
      );
    }
    if (phone_code.length !== 4) {
      throw new BadRequestException(
        "phone_code must have exactly 4 digits",
        400 /* VALIDATION_ERROR */
      );
    }
    try {
      const deliveryMan = await prisma_default.deliveryMan.findFirst({
        where: {
          phone_number: {
            endsWith: phone_code
          }
        }
      });
      if (!deliveryMan) {
        throw new BadRequestException(
          "Delivery man not found with these last 4 digits",
          400 /* USER_NOT_FOUND */
        );
      }
      return deliveryMan;
    } catch (error) {
      console.error("[GetDeliveryManByPhoneService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/deliveryMan/GetDeliveryManByPhoneController.ts
var GetDeliveryManByPhoneController = class {
  async handle(req, res, next) {
    const { phone_code } = req.query;
    const getDeliveryManByPhoneService = new GetDeliveryManByPhoneService();
    const deliveryMan = await getDeliveryManByPhoneService.execute({
      phone_code
    });
    return res.json(deliveryMan);
  }
};

// src/schemas/deliveryMan/updateDeliveryMan.ts
var import_zod5 = require("zod");
var updateDeliveryManSchema = import_zod5.z.object({
  name: import_zod5.z.string().optional(),
  phone_number: import_zod5.z.string().optional()
});

// src/services/deliveryMan/UpdateDeliveryManService.ts
var UpdateDeliveryManService = class {
  async execute({ id, ...data }) {
    const parsed = updateDeliveryManSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors[0].message,
        400 /* VALIDATION_ERROR */
      );
    }
    const existingDeliveryMan = await prisma_default.deliveryMan.findFirst({
      where: { id }
    });
    if (!existingDeliveryMan) {
      throw new BadRequestException(
        "Delivery man not found",
        400 /* USER_NOT_FOUND */
      );
    }
    if (parsed.data.phone_number && parsed.data.phone_number !== existingDeliveryMan.phone_number) {
      const phoneInUse = await prisma_default.deliveryMan.findFirst({
        where: {
          phone_number: parsed.data.phone_number,
          id: { not: id }
        }
      });
      if (phoneInUse) {
        throw new BadRequestException(
          "Phone number already in use by another delivery man",
          400 /* USER_ALREADY_EXISTS */
        );
      }
    }
    try {
      const deliveryMan = await prisma_default.deliveryMan.update({
        where: { id },
        data: parsed.data
      });
      return deliveryMan;
    } catch (error) {
      console.error("[UpdateDeliveryManService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/deliveryMan/UpdateDeliveryManController.ts
var UpdateDeliveryManController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const { name, phone_number } = req.body;
    const updateDeliveryManService = new UpdateDeliveryManService();
    const deliveryMan = await updateDeliveryManService.execute({
      id,
      name,
      phone_number
    });
    return res.json(deliveryMan);
  }
};

// src/services/deliveryMan/DeleteDeliveryManService.ts
var DeleteDeliveryManService = class {
  async execute({ id }) {
    const existingDeliveryMan = await prisma_default.deliveryMan.findFirst({
      where: { id }
    });
    if (!existingDeliveryMan) {
      throw new BadRequestException(
        "Delivery man not found",
        400 /* USER_NOT_FOUND */
      );
    }
    try {
      await prisma_default.deliveryMan.delete({
        where: { id }
      });
      return { message: "Delivery man deleted successfully" };
    } catch (error) {
      console.error("[DeleteDeliveryManService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/deliveryMan/DeleteDeliveryManController.ts
var DeleteDeliveryManController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const deleteDeliveryManService = new DeleteDeliveryManService();
    const result = await deleteDeliveryManService.execute({ id });
    return res.json(result);
  }
};

// src/schemas/orderDelivery/createOrderDelivery.ts
var import_zod6 = require("zod");
var createOrderDeliverySchema = import_zod6.z.object({
  order_id: import_zod6.z.string().uuid("order_id must be a valid UUID"),
  delivery_man_id: import_zod6.z.string().uuid("delivery_man_id must be a valid UUID"),
  delivery_date: import_zod6.z.string().datetime("delivery_date must be a valid datetime"),
  is_paid: import_zod6.z.boolean().optional(),
  is_archived: import_zod6.z.boolean().optional()
});

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

// src/controllers/orderDelivery/GetAllOrderDeliveriesController.ts
var GetAllOrderDeliveriesController = class {
  async handle(req, res, next) {
    const { page = "1", pageSize = "10", query = "", filter } = req.query;
    const getAllOrderDeliveriesService = new GetAllOrderDeliveriesService();
    const orderDeliveries = await getAllOrderDeliveriesService.execute(
      Number(page),
      Number(pageSize),
      String(query),
      filter
    );
    return res.json(orderDeliveries);
  }
};

// src/services/orderDelivery/GetOrderDeliveryService.ts
var GetOrderDeliveryService = class {
  async execute({ id }) {
    try {
      const orderDelivery = await prisma_default.orderDelivery.findFirst({
        where: { id },
        include: {
          order: {
            select: {
              code: true,
              total: true,
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
                  complement: true,
                  neighborhood: true,
                  reference_point: true,
                  city: true,
                  state: true
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
      if (!orderDelivery) {
        throw new BadRequestException(
          "Order delivery not found",
          400 /* USER_NOT_FOUND */
        );
      }
      return orderDelivery;
    } catch (error) {
      console.error("[GetOrderDeliveryService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/orderDelivery/GetOrderDeliveryController.ts
var GetOrderDeliveryController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const getOrderDeliveryService = new GetOrderDeliveryService();
    const orderDelivery = await getOrderDeliveryService.execute({ id });
    return res.json(orderDelivery);
  }
};

// src/schemas/orderDelivery/updateOrderDelivery.ts
var import_zod7 = require("zod");
var updateOrderDeliverySchema = import_zod7.z.object({
  delivery_man_id: import_zod7.z.string().uuid("delivery_man_id must be a valid UUID").optional(),
  delivery_date: import_zod7.z.string().datetime("delivery_date must be a valid datetime").optional(),
  is_paid: import_zod7.z.boolean().optional(),
  is_archived: import_zod7.z.boolean().optional()
});

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

// src/services/orderDelivery/DeleteOrderDeliveryService.ts
var DeleteOrderDeliveryService = class {
  async execute({ id }) {
    const existingOrderDelivery = await prisma_default.orderDelivery.findFirst({
      where: { id }
    });
    if (!existingOrderDelivery) {
      throw new BadRequestException(
        "Order delivery not found",
        400 /* USER_NOT_FOUND */
      );
    }
    try {
      await prisma_default.orderDelivery.delete({
        where: { id }
      });
      return { message: "Order delivery deleted successfully" };
    } catch (error) {
      console.error("[DeleteOrderDeliveryService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/orderDelivery/DeleteOrderDeliveryController.ts
var DeleteOrderDeliveryController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const deleteOrderDeliveryService = new DeleteOrderDeliveryService();
    const result = await deleteOrderDeliveryService.execute({ id });
    return res.json(result);
  }
};

// src/schemas/orderToReceive/createOrderToReceive.ts
var import_zod8 = require("zod");
var createOrderToReceiveSchema = import_zod8.z.object({
  order_id: import_zod8.z.string().uuid("order_id must be a valid UUID"),
  payment_due_date: import_zod8.z.string().datetime("payment_due_date must be a valid datetime"),
  received_date: import_zod8.z.string().datetime("received_date must be a valid datetime").optional(),
  type: import_zod8.z.string().nonempty("type is required"),
  is_archived: import_zod8.z.boolean().optional()
});

// src/services/orderToReceive/CreateOrderToReceiveService.ts
var CreateOrderToReceiveService = class {
  async execute(data) {
    const parsed = createOrderToReceiveSchema.safeParse({
      ...data,
      payment_due_date: data.payment_due_date instanceof Date ? data.payment_due_date.toISOString() : data.payment_due_date,
      received_date: data.received_date ? data.received_date instanceof Date ? data.received_date.toISOString() : data.received_date : void 0
    });
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors[0].message,
        400 /* VALIDATION_ERROR */
      );
    }
    const orderExists = await prisma_default.order.findUnique({
      where: { id: data.order_id }
    });
    if (!orderExists) {
      throw new BadRequestException(
        "Order not found",
        400 /* USER_NOT_FOUND */
      );
    }
    const existingOrderToReceive = await prisma_default.orderToReceive.findFirst({
      where: { order_id: data.order_id }
    });
    if (existingOrderToReceive) {
      throw new BadRequestException(
        "An order to receive already exists for this order",
        400 /* USER_ALREADY_EXISTS */
      );
    }
    try {
      const orderToReceive = await prisma_default.orderToReceive.create({
        data: {
          order_id: data.order_id,
          payment_due_date: data.payment_due_date,
          received_date: data.received_date,
          type: data.type,
          is_archived: data.is_archived || false
        },
        include: {
          order: {
            select: {
              code: true,
              total: true,
              client: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  phone_number: true
                }
              }
            }
          }
        }
      });
      return orderToReceive;
    } catch (error) {
      console.error("[CreateOrderToReceiveService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/orderToReceive/CreateOrderToReceiveController.ts
var import_moment_timezone6 = __toESM(require("moment-timezone"));
var CreateOrderToReceiveController = class {
  async handle(req, res, next) {
    const { order_id, payment_due_date, received_date, type, is_archived } = req.body;
    const createOrderToReceiveService = new CreateOrderToReceiveService();
    const formattedPaymentDueDate = import_moment_timezone6.default.utc(payment_due_date).tz("America/Sao_Paulo", true).set({ hour: 16, minute: 0, second: 0 }).toDate();
    const formattedReceivedDate = received_date ? import_moment_timezone6.default.utc(received_date).tz("America/Sao_Paulo", true).set({ hour: 12, minute: 0, second: 0 }).toDate() : void 0;
    const orderToReceive = await createOrderToReceiveService.execute({
      order_id,
      payment_due_date: formattedPaymentDueDate,
      received_date: formattedReceivedDate,
      type,
      is_archived
    });
    return res.json(orderToReceive);
  }
};

// src/services/orderToReceive/GetOrderToReceiveService.ts
var GetOrderToReceiveService = class {
  async execute({ id }) {
    if (!id) {
      throw new BadRequestException(
        "id is required",
        400 /* VALIDATION_ERROR */
      );
    }
    try {
      const orderToReceive = await prisma_default.orderToReceive.findUnique({
        where: { id },
        include: {
          order: {
            select: {
              code: true,
              total: true,
              client: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  phone_number: true
                }
              }
            }
          }
        }
      });
      if (!orderToReceive) {
        throw new BadRequestException(
          "Order to receive not found",
          400 /* USER_NOT_FOUND */
        );
      }
      return orderToReceive;
    } catch (error) {
      console.error("[GetOrderToReceiveService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/orderToReceive/GetOrderToReceiveController.ts
var GetOrderToReceiveController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const getOrderToReceiveService = new GetOrderToReceiveService();
    const orderToReceive = await getOrderToReceiveService.execute({ id });
    return res.json(orderToReceive);
  }
};

// src/services/orderToReceive/GetAllOrderToReceiveService.ts
var GetAllOrderToReceiveService = class {
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
            order: {
              client: {
                OR: [
                  { first_name: { contains: query, mode: "insensitive" } },
                  { last_name: { contains: query, mode: "insensitive" } },
                  { phone_number: { contains: query, mode: "insensitive" } }
                ]
              }
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
      const [ordersToReceive, total] = await Promise.all([
        prisma_default.orderToReceive.findMany({
          where: whereClause,
          include: {
            order: {
              select: {
                code: true,
                total: true,
                payment_received: true,
                created_at: true,
                client: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    phone_number: true
                  }
                }
              }
            }
          },
          orderBy: {
            payment_due_date: "asc"
          },
          skip,
          take: pageSize
        }),
        prisma_default.orderToReceive.count({
          where: whereClause
        })
      ]);
      return {
        ordersToReceive,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error) {
      console.error("[GetAllOrderToReceiveService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/orderToReceive/GetAllOrderToReceiveController.ts
var GetAllOrderToReceiveController = class {
  async handle(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const query = req.query.query;
    const filter = req.query.filter;
    const getAllOrderToReceiveService = new GetAllOrderToReceiveService();
    const result = await getAllOrderToReceiveService.execute(page, pageSize, query, filter);
    return res.json(result);
  }
};

// src/schemas/orderToReceive/updateOrderToReceive.ts
var import_zod9 = require("zod");
var updateOrderToReceiveSchema = import_zod9.z.object({
  payment_due_date: import_zod9.z.string().datetime("payment_due_date must be a valid datetime").optional(),
  received_date: import_zod9.z.string().datetime("received_date must be a valid datetime").optional(),
  type: import_zod9.z.string().nonempty("type cannot be empty").optional(),
  is_archived: import_zod9.z.boolean().optional()
});

// src/services/orderToReceive/UpdateOrderToReceiveService.ts
var UpdateOrderToReceiveService = class {
  async execute({ id, data }) {
    if (!id) {
      throw new BadRequestException(
        "id is required",
        400 /* VALIDATION_ERROR */
      );
    }
    const parsed = updateOrderToReceiveSchema.safeParse({
      ...data,
      payment_due_date: data.payment_due_date instanceof Date ? data.payment_due_date.toISOString() : data.payment_due_date,
      received_date: data.received_date ? data.received_date instanceof Date ? data.received_date.toISOString() : data.received_date : void 0
    });
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors[0].message,
        400 /* VALIDATION_ERROR */
      );
    }
    const orderToReceiveExists = await prisma_default.orderToReceive.findUnique({
      where: { id }
    });
    if (!orderToReceiveExists) {
      throw new BadRequestException(
        "Order to receive not found",
        400 /* USER_NOT_FOUND */
      );
    }
    try {
      const updatedOrderToReceive = await prisma_default.orderToReceive.update({
        where: { id },
        data: {
          payment_due_date: data.payment_due_date,
          received_date: data.received_date,
          type: data.type,
          is_archived: data.is_archived
        },
        include: {
          order: {
            select: {
              code: true,
              total: true,
              client: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  phone_number: true
                }
              }
            }
          }
        }
      });
      return updatedOrderToReceive;
    } catch (error) {
      console.error("[UpdateOrderToReceiveService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/orderToReceive/UpdateOrderToReceiveController.ts
var import_moment_timezone7 = __toESM(require("moment-timezone"));
var UpdateOrderToReceiveController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const { payment_due_date, received_date, type, is_archived } = req.body;
    const updateOrderToReceiveService = new UpdateOrderToReceiveService();
    const data = {};
    if (payment_due_date) {
      data.payment_due_date = import_moment_timezone7.default.utc(payment_due_date).tz("America/Sao_Paulo", true).set({ hour: 12, minute: 0, second: 0 }).toDate();
    }
    if (received_date) {
      data.received_date = import_moment_timezone7.default.utc(received_date).tz("America/Sao_Paulo", true).set({ hour: 12, minute: 0, second: 0 }).toDate();
    }
    if (type) data.type = type;
    if (is_archived !== void 0) data.is_archived = is_archived;
    const orderToReceive = await updateOrderToReceiveService.execute({
      id,
      data
    });
    return res.json(orderToReceive);
  }
};

// src/services/orderToReceive/DeleteOrderToReceiveService.ts
var DeleteOrderToReceiveService = class {
  async execute({ id }) {
    if (!id) {
      throw new BadRequestException(
        "id is required",
        400 /* VALIDATION_ERROR */
      );
    }
    const orderToReceiveExists = await prisma_default.orderToReceive.findUnique({
      where: { id }
    });
    if (!orderToReceiveExists) {
      throw new BadRequestException(
        "Order to receive not found",
        400 /* USER_NOT_FOUND */
      );
    }
    try {
      await prisma_default.orderToReceive.delete({
        where: { id }
      });
      return { message: "Order to receive deleted successfully" };
    } catch (error) {
      console.error("[DeleteOrderToReceiveService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/orderToReceive/DeleteOrderToReceiveController.ts
var DeleteOrderToReceiveController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const deleteOrderToReceiveService = new DeleteOrderToReceiveService();
    const result = await deleteOrderToReceiveService.execute({ id });
    return res.json(result);
  }
};

// src/services/orderToReceive/CheckOrderToReceiveExistsService.ts
var CheckOrderToReceiveExistsService = class {
  async execute({ order_id }) {
    if (!order_id) {
      throw new BadRequestException(
        "order_id is required",
        400 /* VALIDATION_ERROR */
      );
    }
    try {
      const orderToReceive = await prisma_default.orderToReceive.findFirst({
        where: { order_id }
      });
      return { exists: !!orderToReceive };
    } catch (error) {
      console.error("[CheckOrderToReceiveExistsService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/orderToReceive/CheckOrderToReceiveExistsController.ts
var CheckOrderToReceiveExistsController = class {
  async handle(req, res, next) {
    const { orderId } = req.params;
    const checkOrderToReceiveExistsService = new CheckOrderToReceiveExistsService();
    const result = await checkOrderToReceiveExistsService.execute({ order_id: orderId });
    return res.json(result);
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
var import_path4 = __toESM(require("path"));
var import_crypto = __toESM(require("crypto"));
var storage = import_multer.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsUploadDir);
  },
  filename: (req, file, cb) => {
    const hash3 = import_crypto.default.randomBytes(16).toString("hex");
    const filename = `${hash3}-${Date.now()}${import_path4.default.extname(file.originalname)}`;
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
var import_path5 = __toESM(require("path"));
var processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const inputPath = req.file.path;
  const date = /* @__PURE__ */ new Date();
  const outputFilename = `optimized-${date.getTime()}-${req.file.filename}`;
  const outputPath = import_path5.default.join(productsUploadDir, outputFilename);
  console.log("[processImage] Input path:", inputPath);
  console.log("[processImage] Output path:", outputPath);
  try {
    await (0, import_sharp.default)(inputPath).resize(800, 800, {
      fit: "inside",
      withoutEnlargement: true
    }).jpeg({ quality: 80 }).toFile(outputPath);
    const stats = import_fs4.default.statSync(outputPath);
    const fileSizeInKB = stats.size / 1024;
    console.log("[processImage] Image processed. Size:", fileSizeInKB.toFixed(2), "KB");
    if (fileSizeInKB > 100) {
      await (0, import_sharp.default)(inputPath).resize(600, 600, {
        fit: "inside",
        withoutEnlargement: true
      }).jpeg({ quality: 60 }).toFile(outputPath);
      const newStats = import_fs4.default.statSync(outputPath);
      const newFileSizeInKB = newStats.size / 1024;
      console.log("[processImage] Image recompressed. New size:", newFileSizeInKB.toFixed(2), "KB");
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
    console.log("[processImage] Success. Final filename:", outputFilename);
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
router.patch("/order/:id/payment", admin_auth_default, new UpdateOrderPaymentController().handle);
router.delete("/order/:id", admin_auth_default, new DeleteOrderController().handle);
router.post("/product", admin_auth_default, new CreateProductController().handle);
router.get("/product/all", super_admin_auth_default, new GetAllProductController().handle);
router.get("/product/search", super_admin_auth_default, new SearchProductsController().handle);
router.get("/product/:id", admin_auth_default, new GetProductByIdController().handle);
router.put("/product/:id", super_admin_auth_default, new UpdateProductController().handle);
router.post("/product/:id/image", admin_auth_default, upload.single("image"), handleMulterError, processImage, new UploadProductImageController().handle);
router.delete("/product/:id/image", admin_auth_default, new DeleteProductImageController().handle);
router.post("/product/:id/qrcode", admin_auth_default, new GenerateProductQRCodeController().handle);
router.get("/storefront/products", new GetStoreFrontProductsController().handle);
router.post("/admin", super_admin_auth_default, new CreateAdminController().handle);
router.post("/admins/login", new LoginAdminController().handle);
router.get("/admins/admin", admin_auth_default, new GetAdminController().handle);
router.get("/admins/all", super_admin_auth_default, new GetAllAdminController().handle);
router.delete("/admins/delete/:id", super_admin_auth_default, new DeleteAdminController().handle);
router.put("/admin/:id", super_admin_auth_default, new UpdateAdminController().handle);
router.get("/pix", super_admin_auth_default, new GetPixController().handle);
router.post("/webhook/pix", super_admin_auth_default, new WebhookPixController().handle);
router.get("/stockTransaction/all", admin_auth_default, new GetAllStockTransactionsController().handle);
router.get("/stockTransaction/product/:id", admin_auth_default, new GetProductStockDetailsController().handle);
router.post("/stockTransaction", admin_auth_default, new CreateStockTransactionController().handle);
router.delete("/stockTransaction/:id", admin_auth_default, new DeleteStockTransactionController().handle);
router.post("/supplier", admin_auth_default, new CreateSupplierController().handle);
router.get("/supplier/all", admin_auth_default, new GetAllSuppliersController().handle);
router.post("/deliveryMan", admin_auth_default, new CreateDeliveryManController().handle);
router.get("/deliveryMan/all", admin_auth_default, new GetAllDeliveryMenController().handle);
router.get("/deliveryMan/phone_code", new GetDeliveryManByPhoneController().handle);
router.get("/deliveryMan/:id", admin_auth_default, new GetDeliveryManController().handle);
router.put("/deliveryMan/:id", admin_auth_default, new UpdateDeliveryManController().handle);
router.delete("/deliveryMan/:id", admin_auth_default, new DeleteDeliveryManController().handle);
router.post("/orderDelivery", admin_auth_default, new CreateOrderDeliveryController().handle);
router.get("/orderDelivery/all", admin_auth_default, new GetAllOrderDeliveriesController().handle);
router.get("/orderDelivery/:id", admin_auth_default, new GetOrderDeliveryController().handle);
router.put("/orderDelivery/:id", admin_auth_default, new UpdateOrderDeliveryController().handle);
router.delete("/orderDelivery/:id", admin_auth_default, new DeleteOrderDeliveryController().handle);
router.post("/orderToReceive", admin_auth_default, new CreateOrderToReceiveController().handle);
router.get("/orderToReceive/all", admin_auth_default, new GetAllOrderToReceiveController().handle);
router.get("/orderToReceive/check/:orderId", admin_auth_default, new CheckOrderToReceiveExistsController().handle);
router.get("/orderToReceive/:id", admin_auth_default, new GetOrderToReceiveController().handle);
router.put("/orderToReceive/:id", admin_auth_default, new UpdateOrderToReceiveController().handle);
router.delete("/orderToReceive/:id", admin_auth_default, new DeleteOrderToReceiveController().handle);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  router
});
