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

// src/controllers/inter/GetPixController.ts
var GetPixController_exports = {};
__export(GetPixController_exports, {
  GetPixController: () => GetPixController
});
module.exports = __toCommonJS(GetPixController_exports);

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
var path = __toESM(require("path"));
var pathCerts = path.join(__dirname, "..", "certs");
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetPixController
});
