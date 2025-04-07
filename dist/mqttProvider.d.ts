import React, { ReactNode, FC } from "react";
import type { MqttClient, HttpClient, MqttPublishOptions, MqttSubscribeOptions, MqttQoS, MessageCallback, HttpQuery, HttpQueryResult, HttpBatchQueryResult, HttpJsonResult } from "@artcom/mqtt-topping";
interface MqttContextValue {
    mqttClient: MqttClient | null;
    httpClient: HttpClient | null;
    publish: (topic: string, data: unknown, opts?: MqttPublishOptions) => Promise<unknown>;
    unpublish: (topic: string, qos?: MqttQoS) => Promise<unknown>;
    subscribe: (topic: string, callback: MessageCallback, opts?: MqttSubscribeOptions) => Promise<void>;
    unsubscribe: (topic: string, callback: MessageCallback) => Promise<unknown>;
    query: (query: HttpQuery) => Promise<HttpQueryResult>;
    queryBatch: (queries: HttpQuery[]) => Promise<HttpBatchQueryResult>;
    queryJson: (topic: string) => Promise<HttpJsonResult>;
    queryJsonBatch: (topics: string[]) => Promise<Array<HttpJsonResult | Error>>;
}
declare const MqttContext: React.Context<MqttContextValue>;
interface MqttProviderProps {
    children: ReactNode;
    mqttClient?: MqttClient | null;
    httpClient?: HttpClient | null;
}
declare const MqttProvider: FC<MqttProviderProps>;
export { MqttContext, MqttProvider };
export type { MqttContextValue };
//# sourceMappingURL=mqttProvider.d.ts.map