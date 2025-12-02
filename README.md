# @artcom/mqtt-topping-react

A React wrapper for `@artcom/mqtt-topping` providing hooks and context for easy MQTT and HTTP integration.

## Installation

```bash
npm install @artcom/mqtt-topping-react
```

> **Note**: This package includes `@artcom/mqtt-topping` and `@tanstack/react-query` as dependencies, so you don't need to install them separately.

## Usage

### MqttProvider

Wrap your application with `MqttProvider`. You can provide a `suspenseFallback` to handle the initial connection state automatically.

```tsx
import { MqttProvider } from "@artcom/mqtt-topping-react"

function App() {
  return (
    <MqttProvider
      uri="ws://broker.hivemq.com:8000/mqtt"
      httpBrokerUri="http://broker.hivemq.com:8000/query" // Optional: for useMqttQuery
      suspenseFallback={<div>Connecting to MQTT...</div>} // Optional: shows this while connecting
    >
      <YourApp />
    </MqttProvider>
  )
}
```

### Hooks

#### `useMqttSubscribe`

Subscribe to a topic.

```tsx
import { useMqttSubscribe } from "@artcom/mqtt-topping-react"

function MyComponent() {
  useMqttSubscribe("my/topic", (payload, topic) => {
    console.log("Received:", payload)
  })

  return <div>Listening...</div>
}
```

#### `useHttpClient`

Access the HTTP client directly.

```tsx
import { useHttpClient } from "@artcom/mqtt-topping-react"

function MyComponent() {
  const httpClient = useHttpClient()

  const fetchData = async () => {
    const data = await httpClient?.queryJson("my/topic")
    console.log(data)
  }

  return <button onClick={fetchData}>Fetch</button>
}
```

#### `useMqttQuery`

Fetch data using TanStack Query integration. This provides caching, loading states, and error handling out of the box. Requires `httpBrokerUri` to be set in `MqttProvider`.

```tsx
import { useMqttQuery } from "@artcom/mqtt-topping-react"

function MyComponent() {
  const { data, isLoading, error } = useMqttQuery("my/topic")

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>Data: {JSON.stringify(data)}</div>
}
```

## API Reference

### MqttProvider Props

| Prop               | Type                | Description                                                                 |
| ------------------ | ------------------- | --------------------------------------------------------------------------- |
| `uri`              | `string`            | The MQTT broker URI (e.g., `tcp://localhost:1883` or `ws://localhost:9001`) |
| `options`          | `MqttClientOptions` | Optional configuration for the MQTT client                                  |
| `httpBrokerUri`    | `string`            | Optional URI for the HTTP interface of the broker                           |
| `httpOptions`      | `HttpClientOptions` | Optional configuration for the HTTP client                                  |
| `suspenseFallback` | `ReactNode`         | Optional fallback UI to show while connecting                               |
| `children`         | `ReactNode`         | Child components                                                            |
