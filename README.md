# mqtt-topping-react

Wraps the Art+Com Mqtt TOpping library for react. It provides publish and subscribe hooks.

## Examples

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
