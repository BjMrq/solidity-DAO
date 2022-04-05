/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export interface ISwapable extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): ISwapable;
  clone(): ISwapable;
  methods: {
    getAskPrice(
      _ERC20TokenAmount: number | string | BN
    ): NonPayableTransactionObject<string>;

    getBidPrice(
      _satiAmount: number | string | BN
    ): NonPayableTransactionObject<string>;

    pairName(): NonPayableTransactionObject<string>;

    swapBaseForQuoteToken(
      _ERC20TokenAmount: number | string | BN
    ): PayableTransactionObject<void>;

    swapQuoteForBaseToken(
      _satiAmount: number | string | BN
    ): PayableTransactionObject<void>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}