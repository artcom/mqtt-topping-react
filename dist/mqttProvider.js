import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useMemo } from "react";
const defaultContextValue = {
    mqttClient: null,
    httpClient: null,
    publish: () => Promise.reject(new Error("useMqttSubscribe: MqttClient not available in context.")),
    unpublish: () => Promise.reject(new Error("useMqttSubscribe: MqttClient not available in context.")),
    subscribe: () => Promise.reject(new Error("useMqttSubscribe: MqttClient not available in context.")),
    unsubscribe: () => Promise.reject(new Error("useMqttSubscribe: MqttClient not available in context.")),
    query: () => Promise.reject(new Error("useQuery: HttpClient not available in context.")),
    queryBatch: () => Promise.reject(new Error("useQueryBatch: HttpClient not available in context.")),
    queryJson: () => Promise.reject(new Error("useQueryJson: HttpClient not available in context.")),
    queryJsonBatch: () => Promise.reject(new Error("useQueryJsonBatch: HttpClient not available in context.")),
};
const MqttContext = createContext(defaultContextValue);
const MqttProvider = ({ children, mqttClient = null, httpClient = null, }) => {
    const contextValue = useMemo(() => {
        const value = { mqttClient, httpClient };
        if (mqttClient) {
            value.publish = mqttClient.publish.bind(mqttClient);
            value.unpublish = mqttClient.unpublish.bind(mqttClient);
            value.subscribe = mqttClient.subscribe.bind(mqttClient);
            value.unsubscribe = mqttClient.unsubscribe.bind(mqttClient);
        }
        if (httpClient) {
            value.query = httpClient.query.bind(httpClient);
            value.queryBatch = httpClient.queryBatch.bind(httpClient);
            value.queryJson = httpClient.queryJson.bind(httpClient);
            value.queryJsonBatch = httpClient.queryJsonBatch.bind(httpClient);
        }
        return { ...defaultContextValue, ...value };
    }, [mqttClient, httpClient]);
    return _jsx(MqttContext.Provider, { value: contextValue, children: children });
};
export { MqttContext, MqttProvider };
//# sourceMappingURL=mqttProvider.js.map