import { EventEmitter } from 'events';

export const orderEmitter = new EventEmitter();

export enum OrderEvents {
    OnlineOrderReceived = 'onlineOrderReceived',
}
