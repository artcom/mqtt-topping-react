import { useContext, useEffect, useRef } from "react";
import { MqttContext } from "./mqttProvider";
export const useMqttSubscribe = (topic, handler, options) => {
    const context = useContext(MqttContext);
    const stableHandlerRef = useRef(handler);
    useEffect(() => {
        stableHandlerRef.current = handler;
    }, [handler]);
    const optionsString = JSON.stringify(options);
    useEffect(() => {
        if (!context.subscribe || !context.unsubscribe) {
            console.warn("useMqttSubscribe: MqttClient not available in context.");
            return;
        }
        const currentOptions = optionsString ? JSON.parse(optionsString) : undefined;
        const handlerWrapper = (payload, receivedTopic, packet) => {
            stableHandlerRef.current(payload, receivedTopic, packet);
        };
        console.log(`Subscribing to ${topic}`);
        context.subscribe(topic, handlerWrapper, currentOptions).catch((err) => {
            console.error(`Failed to subscribe to topic "${topic}":`, err);
        });
        return () => {
            console.log(`Unsubscribing from ${topic}`);
            context.unsubscribe(topic, handlerWrapper).catch((err) => {
                console.warn(`Failed to unsubscribe from topic "${topic}":`, err);
            });
        };
    }, [topic, optionsString, context.subscribe, context.unsubscribe]);
};
export default useMqttSubscribe;
//# sourceMappingURL=useMqttSubscribe.js.map