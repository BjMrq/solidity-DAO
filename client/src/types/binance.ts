export type BinanceSocketPriceMessage = {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  c: string; // Close price
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
};

export type StreamName = `${string}@${string}`;

export type BinanceWebsocketMessage = {
  stream: StreamName;
  data: BinanceSocketPriceMessage;
};

export type BinanceStreamSubscriptionInfo = {
  method: "SUBSCRIBE" | "UNSUBSCRIBE";
  params: [StreamName];
  id: 1;
};

export type UseBinanceWebSocket = {
  sendJsonMessage: (jsonMessage: BinanceStreamSubscriptionInfo) => void;
  lastJsonMessage: BinanceWebsocketMessage | undefined;
};
