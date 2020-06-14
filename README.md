# mqtt-topping-react

Wraps the [Art+Com Mqtt Topping](https://www.npmjs.com/package/@artcom/mqtt-topping) library for react. It provides multiple hooks and exposes the publish/unpublish methods.

## Examples

## MQTT Context

Create an MQTT context with an MQTT and HTTP client.

Note: The `unpublishRecursively` method as well as the `Query` methods need/use the HTTP client internally.

```javascript
import React from "react"
import { connectMqttClient, createHttpClient, MqttProvider } from "@artcom/mqtt-topping-react"

async function start() {
  const mqttClient = await connectMqttClient("ws://broker.test.local:1883", "testClientId")
  const httpClient = createHttpClient("http://broker.test.local:8080")

  render(
    <MqttProvider mqtt={ mqttClient } http={ httpClient }>
      // render app
    </MqttProvider>
  )
}

start()
```

### Subscribe

```javascript
import React, { useCallback } from "react"
import { useMqttSubscribe } from "@artcom/mqtt-topping-react"

const MyComponent = ({ greeting }) => {
  const handler = useCallback(payload => console.log(`${greeting} ${payload}`), [greeting])
  useMqttSubscribe("myTopic", handler)
  
  return <></>
}
```

### Publish

```javascript
import React, { useContext } from "react"
import { MqttContext } from "@artcom/mqtt-topping-react"

const MyComponent = ({ payload }) => {
  useContext(MqttContext).publish("myTopic", payload)

  return <></>
}
```

### Unpublish

```javascript
import React, { useContext } from "react"
import { MqttContext } from "@artcom/mqtt-topping-react"

const MyComponent = () => {
  useContext(MqttContext).unpublish("myTopic")

  return <></>
}
```

### UnpublishRecursively

```javascript
import React, { useContext } from "react"
import { MqttContext } from "@artcom/mqtt-topping-react"

const MyComponent = () => {
  useContext(MqttContext).unpublishRecursively("myTopic")

  return <></>
}
```

### HTTP Queries

To query topics via the [retained topic HiveMQ plugin](https://github.com/artcom/hivemq-retained-message-query-plugin) the following hooks can be used. See the [async-task-hook documentation](https://github.com/artcom/async-task-hook) for details.

#### Query

```javascript
import React from "react"
import { useQuery } from "@artcom/mqtt-topping-react"

const MyComponent = () => {
  const query = { topic: "myTopic", depth: 0, flatten: false, parseJson: true }
  const result = useQuery(query)

  // render result

  return <></>
}
```

#### Query Batch

Note: Its mandatory to persist (e.g. memoize the queries) otherwise a new task is created on every rerender.

```javascript
import React, { useMemo } from "react"
import { useQueryBatch } from "@artcom/mqtt-topping-react"

const MyComponent = () => {
  const queries = useMemo([{ topic: "topic1", depth: 1 }, { topic: "topic2", depth: 0 }], [])
  const result = useQueryBatch(queries)

  // render result

  return <></>
}
```

#### Query Json

```javascript
import React from "react"
import { useQueryJson } from "@artcom/mqtt-topping-react"

const MyComponent = () => {
  const result = useQueryJson("myTopic")

  // render result

  return <></>
}
```

#### Query Json Batch

Note: Its mandatory to persist (e.g. memoize the queries) otherwise a new task is created on every rerender.

```javascript
import React from "react"
import { useQueryJsonBatch } from "@artcom/mqtt-topping-react"

const MyComponent = () => {
  const queries = useMemo(["topic1", "topic2"], [])
  const result = useQueryJsonBatch(queries)

  // render result

  return <></>
}
```

## Development

### Build

```bash
npm install
npm run build
```

### Test

```bash
npm install
npm run test
```
