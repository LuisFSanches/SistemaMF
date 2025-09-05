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

// src/services/pix/GetPixService.ts
var GetPixService_exports = {};
__export(GetPixService_exports, {
  GetPixService: () => GetPixService
});
module.exports = __toCommonJS(GetPixService_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetPixService
});
