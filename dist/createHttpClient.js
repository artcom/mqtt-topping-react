import { HttpClient } from "@artcom/mqtt-topping";
export const createHttpClient = (httpBrokerUri) => {
    return new HttpClient(httpBrokerUri);
};
export default createHttpClient;
//# sourceMappingURL=createHttpClient.js.map