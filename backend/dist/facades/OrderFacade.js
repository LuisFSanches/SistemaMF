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

// src/facades/OrderFacade.ts
var OrderFacade_exports = {};
__export(OrderFacade_exports, {
  OrderFacade: () => OrderFacade
});
module.exports = __toCommonJS(OrderFacade_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OrderFacade
});
