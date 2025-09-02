# 🚀 mqtt-topping-react

[![npm version](https://img.shields.io/npm/v/@artcom/mqtt-topping-react.svg)](https://www.npmjs.com/package/@artcom/mqtt-topping-react)
[![npm downloads](https://img.shields.io/npm/dm/@artcom/mqtt-topping-react.svg)](https://www.npmjs.com/package/@artcom/mqtt-topping-react)
[![build status](https://img.shields.io/github/actions/workflow/status/artcom/mqtt-topping-react/ci.yml?branch=main)](https://github.com/artcom/mqtt-topping-react/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Modern React hooks for MQTT with TypeScript support and TanStack Query integration**

Transform your React applications with powerful, type-safe MQTT connectivity. Built for React 19, powered by TanStack Query, and designed for developer happiness.

```typescript
// Get started in seconds
const { data, isLoading } = useQuery({ topic: "sensors/temperature" });
const { publish } = useMqttContext();

if (isLoading) return <div>Loading sensor data...</div>;

return (
  <div>
    <h1>Temperature: {data?.value}°C</h1>
    <button onClick={() => publish("devices/control", { action: "toggle" })}>
      Toggle Device
    </button>
  </div>
);
```

## 📋 Table of Contents

### 🚀 Getting Started

- [Quick Start](#-quick-start) 🟢 _Beginner_
  - [Installation](#installation)
  - [Complete Working Example](#complete-working-example)
  - [Key Features Demonstrated](#key-features-demonstrated)
  - [Next Steps](#next-steps)

### 📖 Core Concepts

- [HTTP Queries](#http-queries) 🟢 _Beginner_
  - [Query](#query)
  - [Query Batch](#query-batch)
  - [Query Json](#query-json)
  - [Query Json Batch](#query-json-batch)

### 🔧 API Reference

- [useQuery Hook](#usequery-hook) 🟡 _Intermediate_
- [Batch Query Hooks](#batch-query-hooks) 🟡 _Intermediate_
  - [useQueryBatch Hook](#usequerybatch-hook)
  - [useQueryJson Hook](#usequeryJson-hook)
  - [useQueryJsonBatch Hook](#usequeryjsonbatch-hook)
  - [Performance Considerations](#performance-considerations-for-batch-queries)
- [useMqttSubscribe Hook](#usemqttsubscribe-hook) 🟡 _Intermediate_
- [MqttProvider & Context](#mqttprovider--context) 🟡 _Intermediate_

### 📘 TypeScript Guide

- [Type Imports and Usage](#-type-imports-and-usage) 🟡 _Intermediate_
  - [Essential Type Imports](#essential-type-imports)
  - [Generic Hook Usage](#generic-hook-usage)
- [Custom Type Definitions](#️-custom-type-definitions) 🔴 _Advanced_
  - [MQTT Payload Types](#mqtt-payload-types)
  - [Advanced Generic Patterns](#advanced-generic-patterns)
- [Strict TypeScript Configuration](#️-strict-typescript-configuration) 🟡 _Intermediate_
  - [Recommended tsconfig.json](#recommended-tsconfigjson)
  - [ESLint Configuration for TypeScript](#eslint-configuration-for-typescript)
- [Type Inference and Best Practices](#-type-inference-and-best-practices) 🟡 _Intermediate_
  - [Leveraging Type Inference](#leveraging-type-inference)
  - [Advanced Type Patterns](#advanced-type-patterns)
- [Integration with Popular TypeScript Tools](#️-integration-with-popular-typescript-tools) 🔴 _Advanced_
  - [Zod for Runtime Validation](#zod-for-runtime-validation)
  - [React Hook Form Integration](#react-hook-form-integration)
  - [Storybook Integration](#storybook-integration)
- [Type-Safe Testing Patterns](#-type-safe-testing-patterns) 🔴 _Advanced_

### 🔄 Migration & Compatibility

- [Backward Compatibility](#backward-compatibility) 🟢 _Beginner_
  - [Legacy Status Constants](#legacy-status-constants)
  - [Modern TanStack Query API](#modern-tanstack-query-api)
- [What's New in v3.0](#whats-new-in-v30) 🟢 _Beginner_
- [Migration from v2.x](#migration-from-v2x) 🟡 _Intermediate_

### ⚡ Advanced Usage

- [Performance Optimization](#performance-optimization) 🔴 _Advanced_
- [Connection Management](#connection-management) 🔴 _Advanced_
- [Error Handling Patterns](#error-handling-patterns) 🟡 _Intermediate_
- [Testing Strategies](#testing-strategies) 🔴 _Advanced_

### 🌐 Broker Configuration

- [WebSocket Connections](#websocket-connections) 🟡 _Intermediate_
- [Secure Connections](#secure-connections) 🔴 _Advanced_
- [Authentication](#authentication) 🔴 _Advanced_
- [Environment Configuration](#environment-configuration) 🟡 _Intermediate_

### 💡 Examples & Patterns

- [Real-world Use Cases](#real-world-use-cases) 🟡 _Intermediate_
- [IoT Dashboard](#iot-dashboard) 🟡 _Intermediate_
- [Real-time Chat](#real-time-chat) 🔴 _Advanced_
- [Device Control Interface](#device-control-interface) 🟡 _Intermediate_

### � Error Handnling & Troubleshooting

- [Error Handling & Troubleshooting Guide](#-error-handling--troubleshooting-guide) 🟡 _Intermediate_
  - [Error Types Reference](#-error-types-reference)
  - [Debugging Techniques](#-debugging-techniques)
  - [Troubleshooting Flowchart](#-troubleshooting-flowchart)
  - [Frequently Asked Questions](#-frequently-asked-questions)
  - [External Debugging Resources](#-external-debugging-resources)

### 🛠️ Development

- [Development](#development) 🟡 _Intermediate_
  - [Development Environment Setup](#️-development-environment-setup)
    - [Prerequisites](#prerequisites)
    - [Initial Setup](#initial-setup)
    - [Development Workflow](#development-workflow)
  - [Available Scripts](#-available-scripts)
    - [Build Commands](#build-commands)
    - [Testing Commands](#testing-commands)
    - [Code Quality Commands](#code-quality-commands)
  - [Testing Requirements](#-testing-requirements)
    - [Coverage Requirements](#coverage-requirements)
    - [Testing Guidelines](#testing-guidelines)
    - [Test Organization](#test-organization)
  - [Code Quality Standards](#-code-quality-standards)
    - [TypeScript Standards](#typescript-standards)
    - [React Standards](#react-standards)
    - [Performance Standards](#performance-standards)
  - [Pull Request Guidelines](#-pull-request-guidelines)
    - [Before Submitting](#before-submitting)
    - [Pull Request Template](#pull-request-template)
    - [Review Process](#review-process)
  - [Issue Reporting Guidelines](#-issue-reporting-guidelines)
    - [Bug Reports](#bug-reports)
    - [Feature Requests](#feature-requests)
    - [Issue Labels](#issue-labels)
  - [Release Process](#-release-process)
    - [Version Types](#version-types)
    - [Release Workflow](#release-workflow)
    - [Contributing to Releases](#contributing-to-releases)

### 🤝 Community & Support

- [Resources](#-resources) 🟢 _Beginner_
- [Getting Help](#-getting-help) 🟢 _Beginner_
- [Contributing](#-contributing) 🟡 _Intermediate_
  - [Quick Start for Contributors](#quick-start-for-contributors)
  - [Ways to Contribute](#ways-to-contribute)
  - [Before Contributing](#before-contributing)
- [Roadmap](#-roadmap) 🟢 _Beginner_
- [Acknowledgments](#-acknowledgments) 🟢 _Beginner_

---

**Legend:**

- 🟢 _Beginner_ - New to MQTT or this library
- 🟡 _Intermediate_ - Familiar with React and MQTT basics
- 🔴 _Advanced_ - Production deployment and optimization

---

## 🚀 Quick Start

Get up and running with mqtt-topping-react in minutes. This complete example shows everything you need to build a real-time MQTT-powered React application.

### Installation

Choose your preferred package manager:

```bash
# npm
npm install @artcom/mqtt-topping-react

# yarn
yarn add @artcom/mqtt-topping-react

# pnpm
pnpm add @artcom/mqtt-topping-react
```

### Complete Working Example

Here's a full working example that you can copy-paste and run immediately:

```typescript
import React, { useEffect, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import {
  MqttProvider,
  connectAsync,
  createHttpClient,
  useQuery,
  useMqttSubscribe,
  useMqttContext,
  type MqttClient,
  type HttpClient
} from '@artcom/mqtt-topping-react'

// Types for our sensor data
interface SensorData {
  temperature: number
  humidity: number
  timestamp: string
}

interface DeviceControl {
  action: 'toggle' | 'reset'
  deviceId: string
}

// Main App Component with Provider Setup
const App: React.FC = () => {
  const [clients, setClients] = useState<{
    mqttClient: MqttClient
    httpClient: HttpClient
  } | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)

  useEffect(() => {
    const setupClients = async () => {
      try {
        setIsConnecting(true)
        setConnectionError(null)

        // Connect to MQTT broker
        const mqttClient = await connectAsync('ws://broker.hivemq.com:8000/mqtt', {
          clientId: `mqtt-topping-demo-${Math.random().toString(36).substr(2, 9)}`,
          clean: true,
          keepalive: 60,
          reconnectPeriod: 1000,
        })

        // Create HTTP client for retained message queries
        const httpClient = createHttpClient('http://your-api-server.com')

        setClients({ mqttClient, httpClient })
      } catch (error) {
        console.error('Failed to setup MQTT clients:', error)
        setConnectionError(
          error instanceof Error
            ? error.message
            : 'Failed to connect to MQTT broker'
        )
      } finally {
        setIsConnecting(false)
      }
    }

    setupClients()
  }, [])

  // Loading state
  if (isConnecting) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🔌 Connecting to MQTT broker...</h2>
        <p>Setting up real-time connection...</p>
      </div>
    )
  }

  // Error state
  if (connectionError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>❌ Connection Failed</h2>
        <p>{connectionError}</p>
        <button onClick={() => window.location.reload()}>
          🔄 Retry Connection
        </button>
      </div>
    )
  }

  // Success state - render app with MQTT context
  if (!clients) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>⚠️ No clients available</h2>
      </div>
    )
  }

  return (
    <MqttProvider mqttClient={clients.mqttClient} httpClient={clients.httpClient}>
      <Dashboard />
    </MqttProvider>
  )
}

// Dashboard Component - Shows MQTT functionality
const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([])
  const { publish } = useMqttContext()

  // Query retained sensor data using HTTP
  const {
    data: sensorData,
    isLoading: isSensorLoading,
    error: sensorError,
    refetch: refetchSensor
  } = useQuery<SensorData>({
    topic: 'sensors/livingroom/temperature',
    depth: 0,
    parseJson: true
  })

  // Subscribe to real-time sensor updates
  const handleSensorUpdate = useCallback((payload: unknown) => {
    try {
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload
      const timestamp = new Date().toLocaleTimeString()
      setMessages(prev => [
        `[${timestamp}] Sensor update: ${JSON.stringify(data)}`,
        ...prev.slice(0, 9) // Keep last 10 messages
      ])
    } catch (error) {
      console.error('Failed to parse sensor data:', error)
      setMessages(prev => [
        `[${new Date().toLocaleTimeString()}] Invalid sensor data received`,
        ...prev.slice(0, 9)
      ])
    }
  }, [])

  useMqttSubscribe('sensors/+/temperature', handleSensorUpdate, {
    qos: 1,
    enabled: true // Conditional subscription
  })

  // Publish device control commands
  const handleDeviceControl = async (action: 'toggle' | 'reset') => {
    if (!publish) {
      console.error('MQTT publish not available')
      return
    }

    try {
      const controlMessage: DeviceControl = {
        action,
        deviceId: 'livingroom-sensor'
      }

      await publish('devices/control', controlMessage, { qos: 1, retain: false })

      const timestamp = new Date().toLocaleTimeString()
      setMessages(prev => [
        `[${timestamp}] Sent ${action} command to device`,
        ...prev.slice(0, 9)
      ])
    } catch (error) {
      console.error('Failed to publish control message:', error)
      setMessages(prev => [
        `[${new Date().toLocaleTimeString()}] Failed to send ${action} command`,
        ...prev.slice(0, 9)
      ])
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🌡️ MQTT Sensor Dashboard</h1>

      {/* Sensor Data Display */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2>📊 Current Sensor Data</h2>

        {isSensorLoading && (
          <div style={{ color: '#666' }}>
            🔄 Loading sensor data...
          </div>
        )}

        {sensorError && (
          <div style={{ color: 'red' }}>
            ❌ Error loading sensor data: {sensorError.message}
          </div>
        )}

        {sensorData && (
          <div>
            <p><strong>Temperature:</strong> {sensorData.temperature}°C</p>
            <p><strong>Humidity:</strong> {sensorData.humidity}%</p>
            <p><strong>Last Updated:</strong> {sensorData.timestamp}</p>
          </div>
        )}

        <button
          onClick={() => refetchSensor()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Device Controls */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
        backgroundColor: '#f0f8ff'
      }}>
        <h2>🎛️ Device Controls</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => handleDeviceControl('toggle')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Toggle Device
          </button>
          <button
            onClick={() => handleDeviceControl('reset')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Reset Device
          </button>
        </div>
      </div>

      {/* Real-time Message Log */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#f8f9fa'
      }}>
        <h2>📝 Real-time Messages</h2>
        <div style={{
          height: '200px',
          overflowY: 'auto',
          backgroundColor: '#000',
          color: '#00ff00',
          padding: '10px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          {messages.length === 0 ? (
            <div style={{ color: '#666' }}>
              Waiting for messages... Try publishing a control command!
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index}>{message}</div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Initialize the app
const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<App />)
}
```

### Key Features Demonstrated

This example showcases the main features of mqtt-topping-react:

- **🔌 Connection Management**: Robust connection setup with error handling and loading states
- **📊 HTTP Queries**: Query retained messages using `useQuery` with TanStack Query integration
- **📡 Real-time Subscriptions**: Subscribe to live MQTT messages with `useMqttSubscribe`
- **📤 Publishing**: Send messages to MQTT topics using the context's `publish` method
- **⚡ TypeScript Support**: Full type safety with proper interfaces and generics
- **🔄 Error Handling**: Comprehensive error handling for all MQTT operations
- **🎯 Performance**: Optimized re-rendering with proper callback memoization

### Next Steps

Now that you have a working example:

1. **Customize the broker**: Replace `ws://broker.hivemq.com:8000/mqtt` with your MQTT broker URL
2. **Add your topics**: Update topic names to match your MQTT setup
3. **Extend the types**: Define interfaces for your specific data structures
4. **Add more features**: Explore batch queries, JSON utilities, and advanced patterns

Continue reading for detailed API documentation and advanced usage patterns!

### HTTP Queries

To query topics via the [retained topic HiveMQ plugin](https://github.com/artcom/hivemq-retained-message-query-plugin) the following hooks can be used. These hooks are powered by [TanStack Query](https://tanstack.com/query) for robust data fetching and caching.

#### Query

```javascript
import React from 'react'

import { useQuery } from '@artcom/mqtt-topping-react'

const MyComponent = () => {
  const query = useQuery({ topic: 'myTopic', depth: 0, flatten: false, parseJson: true })

  if (query.isLoading) {
    return <>Loading...</>
  }

  if (query.isError) {
    return <>{query.error.message}</>
  }

  return <>{JSON.stringify(query.data)}</>
}
```

#### Query Batch

**Note:** Its mandatory to persist (e.g. memoize the queries) otherwise a new query is created on every rerender.

```javascript
import React, { useMemo } from 'react'

import { useQueryBatch } from '@artcom/mqtt-topping-react'

const MyComponent = () => {
  const queries = useMemo(
    () => [
      { topic: 'topic1', depth: 1 },
      { topic: 'topic2', depth: 0 },
    ],
    []
  )
  const query = useQueryBatch(queries)

  if (query.isLoading) {
    return <>Loading...</>
  }

  if (query.isError) {
    return <>{query.error.message}</>
  }

  return <>{JSON.stringify(query.data)}</>
}
```

#### Query Json

```javascript
import React from 'react'

import { useQueryJson } from '@artcom/mqtt-topping-react'

const MyComponent = () => {
  const query = useQueryJson('myTopic')

  if (query.isLoading) {
    return <>Loading...</>
  }

  if (query.isError) {
    return <>{query.error.message}</>
  }

  return <>{JSON.stringify(query.data)}</>
}
```

#### Query Json Batch

**Note:** Its mandatory to persist (e.g. memoize the queries) otherwise a new query is created on every rerender.

```javascript
import React, { useMemo } from 'react'

import { useQueryJsonBatch } from '@artcom/mqtt-topping-react'

const MyComponent = () => {
  const queries = useMemo(() => ['topic1', 'topic2'], [])
  const query = useQueryJsonBatch(queries)

  if (query.isLoading) {
    return <>Loading...</>
  }

  if (query.isError) {
    return <>{query.error.message}</>
  }

  return <>{JSON.stringify(query.data)}</>
}
```

---

## 📘 TypeScript Guide

mqtt-topping-react is built with TypeScript-first design, providing comprehensive type safety and excellent developer experience. This section covers TypeScript-specific features, best practices, and advanced patterns.

### 🎯 Type Imports and Usage

#### Essential Type Imports

```typescript
// Core hook types
import type {
  UseHttpQueryBatchResult,
  UseHttpQueryJsonBatchResult,
  UseHttpQueryJsonResult,
  UseHttpQueryResult,
  UseMqttSubscribeOptions,
  UseMqttSubscribeResult,
  UseQueryResult,
} from '@artcom/mqtt-topping-react'
// Provider and context types
import type { MqttContextValue, MqttProviderProps } from '@artcom/mqtt-topping-react'
// MQTT and HTTP client types
import type {
  HttpBatchQueryResult,
  HttpClient,
  HttpJsonResult,
  HttpQueryResult,
  MqttClient,
  MqttClientOptions,
  MqttPublishOptions,
  MqttQoS,
  MqttSubscribeOptions,
} from '@artcom/mqtt-topping-react'
// Error types for comprehensive error handling
import type {
  HttpError,
  HttpNetworkError,
  HttpQueryError,
  MqttConnectionError,
  MqttError,
  MqttPublishError,
  MqttSubscribeError,
} from '@artcom/mqtt-topping-react'
// TanStack Query types for advanced usage
import type { QueryClient, QueryKey, UseQueryOptions } from '@artcom/mqtt-topping-react'
```

#### Generic Hook Usage

```typescript
import React from 'react'
import { useQuery, useMqttSubscribe } from '@artcom/mqtt-topping-react'

// Define your data structures
interface SensorReading {
  temperature: number
  humidity: number
  pressure: number
  timestamp: string
  sensorId: string
}

interface DeviceStatus {
  online: boolean
  batteryLevel: number
  lastSeen: string
  firmware: string
}

const TypeSafeComponent: React.FC = () => {
  // Generic usage provides full type safety
  const {
    data: sensorData,
    isLoading,
    error
  } = useQuery<SensorReading>({
    topic: 'sensors/living-room/readings',
    parseJson: true
  })

  // TypeScript knows the exact shape of sensorData
  const handleSensorUpdate = React.useCallback((payload: unknown) => {
    // Type guard for runtime safety
    if (isSensorReading(payload)) {
      console.log(`Temperature: ${payload.temperature}°C`)
      console.log(`Sensor ID: ${payload.sensorId}`)
    }
  }, [])

  useMqttSubscribe('sensors/+/readings', handleSensorUpdate)

  if (isLoading) return <div>Loading sensor data...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>Sensor Reading</h2>
      {/* TypeScript provides autocomplete and type checking */}
      <p>Temperature: {sensorData?.temperature}°C</p>
      <p>Humidity: {sensorData?.humidity}%</p>
      <p>Pressure: {sensorData?.pressure} hPa</p>
      <p>Last Updated: {sensorData?.timestamp}</p>
    </div>
  )
}

// Type guard function for runtime type safety
function isSensorReading(payload: unknown): payload is SensorReading {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'temperature' in payload &&
    'humidity' in payload &&
    'pressure' in payload &&
    'timestamp' in payload &&
    'sensorId' in payload
  )
}
```

### 🏗️ Custom Type Definitions

#### MQTT Payload Types

```typescript
// Base payload interface
interface MqttPayload {
  timestamp: string
  source: string
}

// Sensor-specific payloads
interface TemperaturePayload extends MqttPayload {
  type: 'temperature'
  value: number
  unit: 'celsius' | 'fahrenheit'
  accuracy: number
}

interface MotionPayload extends MqttPayload {
  type: 'motion'
  detected: boolean
  confidence: number
  zone: string
}

interface BatteryPayload extends MqttPayload {
  type: 'battery'
  level: number
  charging: boolean
  voltage: number
}

// Union type for all sensor payloads
type SensorPayload = TemperaturePayload | MotionPayload | BatteryPayload

// Generic sensor data with discriminated union
interface SensorData<T extends SensorPayload = SensorPayload> {
  deviceId: string
  location: string
  payload: T
  metadata: {
    rssi: number
    firmware: string
    uptime: number
  }
}

// Usage with type discrimination
const SensorDisplay: React.FC<{ data: SensorData }> = ({ data }) => {
  const renderPayload = () => {
    switch (data.payload.type) {
      case 'temperature':
        return (
          <div>
            Temperature: {data.payload.value}°{data.payload.unit === 'celsius' ? 'C' : 'F'}
            <br />
            Accuracy: ±{data.payload.accuracy}°
          </div>
        )
      case 'motion':
        return (
          <div>
            Motion: {data.payload.detected ? 'Detected' : 'Clear'}
            <br />
            Zone: {data.payload.zone}
            <br />
            Confidence: {(data.payload.confidence * 100).toFixed(1)}%
          </div>
        )
      case 'battery':
        return (
          <div>
            Battery: {data.payload.level}%
            <br />
            Status: {data.payload.charging ? 'Charging' : 'Discharging'}
            <br />
            Voltage: {data.payload.voltage}V
          </div>
        )
      default:
        // TypeScript ensures exhaustive checking
        const _exhaustive: never = data.payload
        return null
    }
  }

  return (
    <div>
      <h3>{data.location} - {data.deviceId}</h3>
      {renderPayload()}
      <small>RSSI: {data.metadata.rssi}dBm</small>
    </div>
  )
}
```

#### Advanced Generic Patterns

```typescript
// Generic query hook with transformation
function useTypedQuery<TInput, TOutput = TInput>(
  topic: string,
  transform?: (input: TInput) => TOutput
): UseQueryResult<TOutput, Error> {
  return useQuery<TOutput>({
    topic,
    parseJson: true,
    select: transform ? (data: TInput) => transform(data) : undefined
  })
}

// Usage with transformation
interface RawSensorData {
  temp: number
  hum: number
  ts: number
}

interface ProcessedSensorData {
  temperature: number
  humidity: number
  timestamp: Date
  heatIndex: number
}

const ProcessedSensorComponent: React.FC = () => {
  const { data } = useTypedQuery<RawSensorData, ProcessedSensorData>(
    'sensors/raw/data',
    (raw) => ({
      temperature: raw.temp,
      humidity: raw.hum,
      timestamp: new Date(raw.ts * 1000),
      heatIndex: calculateHeatIndex(raw.temp, raw.hum)
    })
  )

  return (
    <div>
      <p>Temperature: {data?.temperature}°C</p>
      <p>Humidity: {data?.humidity}%</p>
      <p>Heat Index: {data?.heatIndex}</p>
      <p>Updated: {data?.timestamp.toLocaleString()}</p>
    </div>
  )
}

function calculateHeatIndex(temp: number, humidity: number): number {
  // Heat index calculation logic
  return temp + (humidity * 0.1)
}
```

### ⚙️ Strict TypeScript Configuration

#### Recommended tsconfig.json

```json
{
  "compilerOptions": {
    // Target modern JavaScript
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],

    // Module system
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    // Strict type checking
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "exactOptionalPropertyTypes": true,
    "useUnknownInCatchVariables": true,

    // Additional checks
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,

    // React JSX
    "jsx": "react-jsx",

    // Output
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    // Path mapping for cleaner imports
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/types/*": ["src/types/*"],
      "@/hooks/*": ["src/hooks/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### ESLint Configuration for TypeScript

```javascript
// eslint.config.js
import tanstackQuery from '@tanstack/eslint-plugin-query'

import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      '@tanstack/query': tanstackQuery,
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-const': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // React hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TanStack Query rules
      '@tanstack/query/exhaustive-deps': 'error',
      '@tanstack/query/prefer-query-object-syntax': 'error',
    },
  },
]
```

### 🔍 Type Inference and Best Practices

#### Leveraging Type Inference

```typescript
import React from 'react'
import { useQuery, useMqttContext } from '@artcom/mqtt-topping-react'

// TypeScript infers types automatically in many cases
const InferredTypesExample: React.FC = () => {
  // Type is inferred as UseQueryResult<unknown, Error>
  const query = useQuery({ topic: 'sensors/data' })

  // Type is inferred from context
  const { publish } = useMqttContext()

  // Better: Provide explicit types for better IntelliSense
  const typedQuery = useQuery<{ temperature: number }>({
    topic: 'sensors/temperature',
    parseJson: true
  })

  // TypeScript infers the callback parameter type
  const handleClick = React.useCallback(async () => {
    if (publish) {
      // TypeScript knows publish signature
      await publish('commands/refresh', { timestamp: Date.now() })
    }
  }, [publish])

  return (
    <div>
      {/* TypeScript provides autocomplete for query properties */}
      {typedQuery.isLoading && <div>Loading...</div>}
      {typedQuery.data && (
        <div>Temperature: {typedQuery.data.temperature}°C</div>
      )}
      <button onClick={handleClick}>Refresh</button>
    </div>
  )
}
```

#### Advanced Type Patterns

```typescript
// Conditional types for different query configurations
type QueryResult<T, ParseJson extends boolean> = ParseJson extends true
  ? T extends string
    ? unknown // JSON parsed result
    : T
  : T

// Utility type for MQTT topic patterns
type TopicPattern<T extends string> = T extends `${infer Prefix}/+/${infer Suffix}`
  ? `${Prefix}/${string}/${Suffix}`
  : T extends `${infer Prefix}/#`
    ? `${Prefix}/${string}`
    : T

// Type-safe topic builder
function buildTopic<T extends string>(pattern: T, ...segments: string[]): TopicPattern<T> {
  return pattern.replace(/\+/g, () => segments.shift() || '+') as TopicPattern<T>
}

// Usage
const topic = buildTopic('sensors/+/temperature', 'living-room') // Type: "sensors/living-room/temperature"

// Generic hook factory with constraints
function createTypedHook<TData extends Record<string, unknown>>() {
  return function useTypedMqttQuery(topic: string) {
    return useQuery<TData>({
      topic,
      parseJson: true,
    })
  }
}

// Create specialized hooks
const useSensorQuery = createTypedHook<{
  temperature: number
  humidity: number
  timestamp: string
}>()

const useDeviceQuery = createTypedHook<{
  online: boolean
  battery: number
  version: string
}>()
```

### 🛠️ Integration with Popular TypeScript Tools

#### Zod for Runtime Validation

```typescript
import { z } from 'zod'
import { useQuery } from '@artcom/mqtt-topping-react'

// Define Zod schema
const SensorDataSchema = z.object({
  temperature: z.number(),
  humidity: z.number().min(0).max(100),
  timestamp: z.string().datetime(),
  location: z.string(),
  battery: z.number().optional()
})

type SensorData = z.infer<typeof SensorDataSchema>

// Custom hook with validation
function useValidatedSensorQuery(topic: string) {
  return useQuery<SensorData>({
    topic,
    parseJson: true,
    select: (data) => {
      // Runtime validation with Zod
      const result = SensorDataSchema.safeParse(data)
      if (!result.success) {
        throw new Error(`Invalid sensor data: ${result.error.message}`)
      }
      return result.data
    }
  })
}

const ValidatedSensorComponent: React.FC = () => {
  const { data, error } = useValidatedSensorQuery('sensors/validated/data')

  if (error) {
    return <div>Validation error: {error.message}</div>
  }

  return (
    <div>
      {/* TypeScript knows data is validated and typed */}
      <p>Temperature: {data?.temperature}°C</p>
      <p>Humidity: {data?.humidity}%</p>
      <p>Location: {data?.location}</p>
      {data?.battery && <p>Battery: {data.battery}%</p>}
    </div>
  )
}
```

#### React Hook Form Integration

```typescript
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMqttContext } from '@artcom/mqtt-topping-react'

// Form schema
const DeviceConfigSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  interval: z.number().min(1000).max(60000),
  enabled: z.boolean(),
  location: z.string().optional()
})

type DeviceConfig = z.infer<typeof DeviceConfigSchema>

const DeviceConfigForm: React.FC = () => {
  const { publish } = useMqttContext()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<DeviceConfig>({
    resolver: zodResolver(DeviceConfigSchema),
    defaultValues: {
      deviceId: '',
      interval: 5000,
      enabled: true,
      location: ''
    }
  })

  const onSubmit = async (data: DeviceConfig) => {
    if (!publish) return

    try {
      await publish(`devices/${data.deviceId}/config`, data, {
        qos: 1,
        retain: true
      })
    } catch (error) {
      console.error('Failed to publish config:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="deviceId"
        control={control}
        render={({ field }) => (
          <div>
            <input {...field} placeholder="Device ID" />
            {errors.deviceId && <span>{errors.deviceId.message}</span>}
          </div>
        )}
      />

      <Controller
        name="interval"
        control={control}
        render={({ field }) => (
          <div>
            <input
              {...field}
              type="number"
              placeholder="Update interval (ms)"
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            {errors.interval && <span>{errors.interval.message}</span>}
          </div>
        )}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Config'}
      </button>
    </form>
  )
}
```

#### Storybook Integration

```typescript
// DeviceStatus.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MqttProvider } from '@artcom/mqtt-topping-react'
import { DeviceStatus } from './DeviceStatus'

// Mock MQTT client for Storybook
const mockMqttClient = {
  publish: async () => ({ success: true }),
  subscribe: async () => {},
  unsubscribe: async () => ({ success: true })
} as any

const mockHttpClient = {
  query: async () => ({ data: { online: true, battery: 85 } })
} as any

const meta: Meta<typeof DeviceStatus> = {
  title: 'Components/DeviceStatus',
  component: DeviceStatus,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false }
        }
      })

      return (
        <QueryClientProvider client={queryClient}>
          <MqttProvider mqttClient={mockMqttClient} httpClient={mockHttpClient}>
            <Story />
          </MqttProvider>
        </QueryClientProvider>
      )
    }
  ],
  parameters: {
    docs: {
      description: {
        component: 'Device status component with MQTT integration'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Online: Story = {
  args: {
    deviceId: 'sensor-001'
  }
}

export const Offline: Story = {
  args: {
    deviceId: 'sensor-002'
  },
  parameters: {
    msw: {
      handlers: [
        // Mock offline device response
      ]
    }
  }
}
```

### 📚 Type-Safe Testing Patterns

```typescript
// test-utils.tsx - Typed testing utilities
import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MqttProvider, MqttClient, HttpClient } from '@artcom/mqtt-topping-react'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  mqttClient?: MqttClient
  httpClient?: HttpClient
  queryClient?: QueryClient
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    mqttClient = createMockMqttClient(),
    httpClient = createMockHttpClient(),
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MqttProvider mqttClient={mqttClient} httpClient={httpClient}>
          {children}
        </MqttProvider>
      </QueryClientProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Type-safe mock factories
export function createMockMqttClient(): jest.Mocked<MqttClient> {
  return {
    publish: jest.fn().mockResolvedValue({ success: true }),
    subscribe: jest.fn().mockResolvedValue(undefined),
    unsubscribe: jest.fn().mockResolvedValue({ success: true }),
    disconnect: jest.fn().mockResolvedValue(undefined),
    isConnected: jest.fn().mockReturnValue(true)
  } as any
}

export function createMockHttpClient(): jest.Mocked<HttpClient> {
  return {
    query: jest.fn().mockResolvedValue({ data: {} }),
    queryBatch: jest.fn().mockResolvedValue([])
  } as any
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
}

// Usage in tests
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from './test-utils'
import { SensorComponent } from './SensorComponent'

describe('SensorComponent', () => {
  it('displays sensor data with proper types', async () => {
    const mockHttpClient = createMockHttpClient()
    mockHttpClient.query.mockResolvedValue({
      data: {
        temperature: 23.5,
        humidity: 65,
        timestamp: '2024-01-01T12:00:00Z'
      }
    })

    renderWithProviders(<SensorComponent />, { httpClient: mockHttpClient })

    await waitFor(() => {
      expect(screen.getByText('Temperature: 23.5°C')).toBeInTheDocument()
      expect(screen.getByText('Humidity: 65%')).toBeInTheDocument()
    })

    // TypeScript ensures mock calls match expected signature
    expect(mockHttpClient.query).toHaveBeenCalledWith({
      topic: 'sensors/temperature',
      depth: 0,
      parseJson: true
    })
  })
})
```

This comprehensive TypeScript guide provides developers with everything they need to leverage the full power of TypeScript with mqtt-topping-react, from basic type usage to advanced patterns and integrations with popular tools in the TypeScript ecosystem.

## Backward Compatibility

This library maintains **100% backward compatibility** with the original API. All existing code will continue to work without changes.

### Legacy Status Constants

For compatibility with the original async-task-hook API, you can still use the status constants:

```javascript
import { ERROR, FINISHED, RUNNING, useQuery } from '@artcom/mqtt-topping-react'

const MyComponent = () => {
  const query = useQuery({ topic: 'myTopic', depth: 0 })

  switch (query.status) {
    case RUNNING:
      return <>Loading...</>
    case FINISHED:
      return <>{JSON.stringify(query.data)}</>
    case ERROR:
      return <>{query.error.message}</>
  }
}
```

### Modern TanStack Query API

For new projects, we recommend using the modern TanStack Query API:

```javascript
const query = useQuery({ topic: 'myTopic', depth: 0 })

if (query.isLoading) return <>Loading...</>
if (query.isError) return <>{query.error.message}</>
return <>{JSON.stringify(query.data)}</>
```

## What's New in v3.0

- **React 19 Support**: Full compatibility with React 19 and concurrent features
- **TanStack Query**: Powered by TanStack Query for better caching and data fetching
- **TypeScript**: Full TypeScript support with strict typing
- **Performance**: Optimized re-rendering and memory usage
- **Modern Patterns**: Uses modern React patterns while maintaining backward compatibility

---

## 🔧 API Reference

### useQuery Hook

Query MQTT topics with automatic caching and background updates powered by TanStack Query. This hook fetches retained messages from your MQTT broker via HTTP and provides robust data management with caching, error handling, and automatic retries.

#### Basic Usage

```typescript
import { useQuery } from '@artcom/mqtt-topping-react'

const { data, isLoading, error } = useQuery({
  topic: 'sensors/temperature',
  depth: 0,
  parseJson: true,
})
```

#### Parameters

The `useQuery` hook accepts two parameters:

**1. Query Configuration (required)**

| Parameter   | Type      | Default | Description                                          |
| ----------- | --------- | ------- | ---------------------------------------------------- |
| `topic`     | `string`  | -       | MQTT topic to query (supports wildcards `+` and `#`) |
| `depth`     | `number`  | `0`     | Query depth for hierarchical data (-1 for unlimited) |
| `flatten`   | `boolean` | `false` | Whether to flatten the result structure              |
| `parseJson` | `boolean` | `false` | Automatically parse JSON payloads                    |

**2. Query Options (optional)**

| Parameter              | Type                            | Default  | Description                                  |
| ---------------------- | ------------------------------- | -------- | -------------------------------------------- |
| `enabled`              | `boolean`                       | `true`   | Enable/disable the query                     |
| `refetchInterval`      | `number \| false`               | `false`  | Auto-refetch interval in milliseconds        |
| `refetchOnMount`       | `boolean \| 'always'`           | `true`   | Refetch when component mounts                |
| `refetchOnWindowFocus` | `boolean \| 'always'`           | `true`   | Refetch when window regains focus            |
| `retry`                | `boolean \| number \| function` | `3`      | Retry failed queries                         |
| `staleTime`            | `number`                        | `0`      | Time before data is considered stale (ms)    |
| `gcTime`               | `number`                        | `300000` | Garbage collection time for unused data (ms) |

#### Return Value

Returns a TanStack Query result object with the following properties:

| Property     | Type                                | Description                                  |
| ------------ | ----------------------------------- | -------------------------------------------- |
| `data`       | `HttpQueryResult<T>`                | Query result data (undefined while loading)  |
| `isLoading`  | `boolean`                           | True during initial load                     |
| `isFetching` | `boolean`                           | True during any fetch (including background) |
| `isError`    | `boolean`                           | True if query failed                         |
| `error`      | `Error \| null`                     | Error object if query failed                 |
| `isSuccess`  | `boolean`                           | True if query succeeded                      |
| `refetch`    | `() => Promise<...>`                | Function to manually refetch data            |
| `status`     | `'pending' \| 'error' \| 'success'` | Query status                                 |

#### Examples

##### Basic Temperature Sensor

```typescript
import React from 'react'
import { useQuery } from '@artcom/mqtt-topping-react'

interface SensorData {
  temperature: number
  humidity: number
  timestamp: string
}

const TemperatureSensor: React.FC = () => {
  const { data, isLoading, error } = useQuery<SensorData>({
    topic: "home/livingroom/temperature",
    parseJson: true
  })

  if (isLoading) return <div>🔄 Loading sensor data...</div>
  if (error) return <div>❌ Error: {error.message}</div>

  return (
    <div>
      <h2>Living Room Temperature</h2>
      <p>Temperature: {data?.temperature}°C</p>
      <p>Humidity: {data?.humidity}%</p>
      <p>Last Updated: {data?.timestamp}</p>
    </div>
  )
}
```

##### Conditional Queries

```typescript
import React, { useState } from 'react'
import { useQuery } from '@artcom/mqtt-topping-react'

const ConditionalSensor: React.FC = () => {
  const [monitoringEnabled, setMonitoringEnabled] = useState(false)

  const { data, isLoading } = useQuery({
    topic: "sensors/motion",
    parseJson: true,
    enabled: monitoringEnabled // Only query when enabled
  })

  return (
    <div>
      <button onClick={() => setMonitoringEnabled(!monitoringEnabled)}>
        {monitoringEnabled ? 'Stop Monitoring' : 'Start Monitoring'}
      </button>

      {monitoringEnabled && (
        <div>
          {isLoading ? (
            <p>Loading motion data...</p>
          ) : (
            <p>Motion Status: {data?.detected ? 'Detected' : 'Clear'}</p>
          )}
        </div>
      )}
    </div>
  )
}
```

##### Wildcard Queries with Hierarchical Data

```typescript
import React from 'react'
import { useQuery } from '@artcom/mqtt-topping-react'

const AllSensors: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    topic: "sensors/+/temperature", // Query all temperature sensors
    depth: 1, // Include one level of hierarchy
    flatten: false, // Keep hierarchical structure
    parseJson: true
  })

  if (isLoading) return <div>Loading all sensors...</div>
  if (error) return <div>Error loading sensors: {error.message}</div>

  return (
    <div>
      <h2>All Temperature Sensors</h2>
      {Array.isArray(data) ? (
        data.map((sensor, index) => (
          <div key={index}>
            <strong>{sensor.topic}:</strong> {sensor.payload?.temperature}°C
          </div>
        ))
      ) : (
        <div>No sensor data available</div>
      )}
    </div>
  )
}
```

##### Auto-Refreshing Dashboard

```typescript
import React from 'react'
import { useQuery } from '@artcom/mqtt-topping-react'

const LiveDashboard: React.FC = () => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    topic: "dashboard/stats",
    parseJson: true,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    staleTime: 2000, // Consider data stale after 2 seconds
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h2>Live Dashboard</h2>
        {isFetching && <span>🔄</span>}
        <button onClick={() => refetch()}>Refresh Now</button>
      </div>

      {isLoading ? (
        <div>Loading dashboard...</div>
      ) : (
        <div>
          <p>Active Users: {data?.activeUsers}</p>
          <p>Messages/sec: {data?.messageRate}</p>
          <p>Last Update: {new Date(data?.timestamp).toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  )
}
```

##### Error Handling with Retry Logic

```typescript
import React from 'react'
import { useQuery } from '@artcom/mqtt-topping-react'

const RobustSensor: React.FC = () => {
  const { data, isLoading, error, refetch, failureCount } = useQuery({
    topic: "sensors/critical/temperature",
    parseJson: true,
    retry: (failureCount, error) => {
      // Custom retry logic
      if (error.message.includes('timeout')) {
        return failureCount < 5 // Retry timeouts up to 5 times
      }
      return failureCount < 2 // Other errors retry only twice
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })

  if (isLoading) return <div>Loading critical sensor...</div>

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        <h3>Sensor Error</h3>
        <p>Failed after {failureCount} attempts</p>
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Try Again</button>
      </div>
    )
  }

  return (
    <div>
      <h3>Critical Temperature Sensor</h3>
      <p>Temperature: {data?.temperature}°C</p>
      {data?.temperature > 80 && (
        <div style={{ color: 'red', fontWeight: 'bold' }}>
          ⚠️ HIGH TEMPERATURE ALERT!
        </div>
      )}
    </div>
  )
}
```

##### TypeScript Generic Usage

```typescript
import React from 'react'
import { useQuery } from '@artcom/mqtt-topping-react'

// Define your data structure
interface WeatherData {
  temperature: number
  humidity: number
  pressure: number
  location: string
  timestamp: string
}

const TypedWeatherComponent: React.FC = () => {
  // Use generic to get full type safety
  const { data, isLoading, error } = useQuery<WeatherData>({
    topic: "weather/current",
    parseJson: true
  })

  if (isLoading) return <div>Loading weather data...</div>
  if (error) return <div>Weather service unavailable</div>

  return (
    <div>
      <h2>Weather in {data?.location}</h2>
      {/* TypeScript knows the exact shape of data */}
      <p>Temperature: {data?.temperature}°C</p>
      <p>Humidity: {data?.humidity}%</p>
      <p>Pressure: {data?.pressure} hPa</p>
      <small>Updated: {data?.timestamp}</small>
    </div>
  )
}
```

#### Performance Tips

1. **Use `enabled` for conditional queries**: Prevent unnecessary network requests

   ```typescript
   const { data } = useQuery({
     topic: 'expensive/query',
     enabled: shouldFetch, // Only query when needed
   })
   ```

2. **Set appropriate `staleTime`**: Reduce refetches for data that doesn't change often

   ```typescript
   const { data } = useQuery({
     topic: 'config/settings',
     staleTime: 5 * 60 * 1000, // 5 minutes
   })
   ```

3. **Use `select` to transform data**: Minimize re-renders by selecting only needed data

   ```typescript
   const { data: temperature } = useQuery({
     topic: 'sensors/all',
     select: (data) => data?.temperature, // Only re-render when temperature changes
   })
   ```

4. **Leverage TanStack Query caching**: Multiple components querying the same topic share cache
   ```typescript
   // Both components will share the same cached data
   const ComponentA = () => useQuery({ topic: 'shared/data' })
   const ComponentB = () => useQuery({ topic: 'shared/data' })
   ```

#### Common Errors and Troubleshooting

##### HttpClient Not Available

```
Error: HttpClient not available for query "sensors/temp". Make sure MqttProvider has httpClient prop.
```

**Solution**: Ensure your `MqttProvider` has an `httpClient` prop:

```typescript
<MqttProvider mqttClient={mqttClient} httpClient={httpClient}>
  <App />
</MqttProvider>
```

##### Network Connection Issues

```
Error: HTTP query failed for topic "sensors/temp": Network request failed
```

**Solutions**:

- Check your HTTP client configuration and server URL
- Verify network connectivity
- Check CORS settings if querying from browser
- Use retry configuration for transient network issues

##### Topic Not Found

```
Error: HTTP query failed for topic "nonexistent/topic": Topic not found
```

**Solutions**:

- Verify the topic exists and has retained messages
- Check topic spelling and case sensitivity
- Ensure your MQTT broker supports retained message queries
- Use wildcard queries to explore available topics

##### JSON Parse Errors

```
Error: Failed to parse JSON payload
```

**Solutions**:

- Set `parseJson: false` if data isn't JSON
- Validate that published data is valid JSON
- Use custom parsing logic in a `select` function

##### Memory Leaks with Intervals

**Problem**: Using `refetchInterval` without cleanup
**Solution**: The hook automatically handles cleanup, but you can disable intervals conditionally:

```typescript
const { data } = useQuery({
  topic: 'sensors/temp',
  refetchInterval: isVisible ? 1000 : false, // Stop polling when not visible
})
```

#### Integration with TanStack Query

Since `useQuery` is built on TanStack Query, you can use all TanStack Query features:

```typescript
import { useQueryClient } from '@tanstack/react-query'

const MyComponent = () => {
  const queryClient = useQueryClient()

  const { data } = useQuery({ topic: "sensors/temp" })

  // Manually invalidate and refetch
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['httpQuery', { topic: 'sensors/temp' }] })
  }

  // Prefetch related data
  const prefetchRelated = () => {
    queryClient.prefetchQuery({
      queryKey: ['httpQuery', { topic: 'sensors/humidity' }],
      queryFn: () => httpClient.query({ topic: 'sensors/humidity' })
    })
  }

  return (
    <div>
      <p>Temperature: {data?.temperature}</p>
      <button onClick={handleRefresh}>Refresh</button>
      <button onClick={prefetchRelated}>Prefetch Humidity</button>
    </div>
  )
}
```

## Batch Query Hooks

The batch query hooks allow you to efficiently query multiple MQTT topics simultaneously, with proper error handling for individual query failures and performance optimizations for large batch operations. These hooks are built on TanStack Query and provide robust caching, retry logic, and data management.

### useQueryBatch Hook

Execute multiple HTTP queries simultaneously with different configurations for each topic. This hook is ideal when you need to query multiple topics with different parameters like depth, flatten, or parseJson settings.

#### Basic Usage

```typescript
import React, { useMemo } from 'react'
import { useQueryBatch } from '@artcom/mqtt-topping-react'

const BatchSensorDashboard: React.FC = () => {
  // IMPORTANT: Memoize queries to prevent infinite re-renders
  const queries = useMemo(() => [
    { topic: 'sensors/temperature', depth: 1, parseJson: true },
    { topic: 'sensors/humidity', depth: 0, parseJson: true },
    { topic: 'sensors/pressure', depth: 2, flatten: true },
  ], [])

  const { data, isLoading, error } = useQueryBatch(queries)

  if (isLoading) return <div>Loading sensor data...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>Sensor Dashboard</h2>
      {data?.results.map((result, index) => (
        <div key={index}>
          {result.error ? (
            <div>Error for {result.query.topic}: {result.error.message}</div>
          ) : (
            <div>
              <h3>{result.query.topic}</h3>
              <pre>{JSON.stringify(result.result, null, 2)}</pre>
            </div>
          )}
        </div>
      ))}
      <p>Successful queries: {data?.successfulQueries}/{data?.totalQueries}</p>
    </div>
  )
}
```

#### Parameters

**Query Configuration Array (required)**

Each query object in the array supports:

| Parameter   | Type      | Default | Description                                          |
| ----------- | --------- | ------- | ---------------------------------------------------- |
| `topic`     | `string`  | -       | MQTT topic to query (supports wildcards `+` and `#`) |
| `depth`     | `number`  | `0`     | Query depth for hierarchical data (-1 for unlimited) |
| `flatten`   | `boolean` | `false` | Whether to flatten the result structure              |
| `parseJson` | `boolean` | `false` | Automatically parse JSON payloads                    |

**Query Options (optional)**

Same as `useQuery` hook options including `enabled`, `retry`, `staleTime`, etc.

#### Return Value

Returns a TanStack Query result with `HttpBatchQueryResult`:

| Property            | Type     | Description                                   |
| ------------------- | -------- | --------------------------------------------- |
| `results`           | `Array`  | Array of individual query results or errors   |
| `totalQueries`      | `number` | Total number of queries executed              |
| `successfulQueries` | `number` | Number of queries that completed successfully |
| `failedQueries`     | `number` | Number of queries that failed                 |

#### Advanced Examples

##### Conditional Batch Queries

```typescript
import React, { useMemo, useState } from 'react'
import { useQueryBatch } from '@artcom/mqtt-topping-react'

const ConditionalBatchDashboard: React.FC = () => {
  const [monitoringEnabled, setMonitoringEnabled] = useState(false)
  const [selectedSensors, setSelectedSensors] = useState<string[]>(['temperature'])

  const queries = useMemo(() =>
    selectedSensors.map(sensor => ({
      topic: `sensors/${sensor}`,
      depth: 1,
      parseJson: true
    })), [selectedSensors])

  const { data, isLoading, refetch } = useQueryBatch(queries, {
    enabled: monitoringEnabled,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    staleTime: 2000,
  })

  return (
    <div>
      <div>
        <button onClick={() => setMonitoringEnabled(!monitoringEnabled)}>
          {monitoringEnabled ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
        <button onClick={() => refetch()}>Refresh Now</button>
      </div>

      <div>
        <h3>Select Sensors:</h3>
        {['temperature', 'humidity', 'pressure', 'motion'].map(sensor => (
          <label key={sensor}>
            <input
              type="checkbox"
              checked={selectedSensors.includes(sensor)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedSensors(prev => [...prev, sensor])
                } else {
                  setSelectedSensors(prev => prev.filter(s => s !== sensor))
                }
              }}
            />
            {sensor}
          </label>
        ))}
      </div>

      {monitoringEnabled && (
        <div>
          {isLoading ? (
            <div>Loading {queries.length} sensors...</div>
          ) : (
            <div>
              <h3>Sensor Data ({data?.successfulQueries}/{data?.totalQueries} successful)</h3>
              {data?.results.map((result, index) => (
                <div key={index} style={{
                  border: '1px solid #ccc',
                  margin: '10px',
                  padding: '10px',
                  backgroundColor: result.error ? '#ffe6e6' : '#e6ffe6'
                }}>
                  <h4>{result.query.topic}</h4>
                  {result.error ? (
                    <div style={{ color: 'red' }}>
                      Error: {result.error.message}
                    </div>
                  ) : (
                    <pre>{JSON.stringify(result.result, null, 2)}</pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

##### Performance-Optimized Large Batch

```typescript
import React, { useMemo, useCallback } from 'react'
import { useQueryBatch } from '@artcom/mqtt-topping-react'

const LargeBatchDashboard: React.FC = () => {
  // Generate queries for 50 different sensors
  const queries = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      topic: `building/floor${Math.floor(i / 10)}/sensor${i}`,
      depth: 0,
      parseJson: true
    })), [])

  const { data, isLoading, error } = useQueryBatch(queries, {
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 60000, // Keep in cache for 1 minute
    retry: 2, // Retry failed queries twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Memoized data processing to avoid expensive calculations on every render
  const processedData = useMemo(() => {
    if (!data) return null

    const successful = data.results.filter(r => !r.error)
    const failed = data.results.filter(r => r.error)

    const byFloor = successful.reduce((acc, result) => {
      const floor = result.query.topic.match(/floor(\d+)/)?.[1] || 'unknown'
      if (!acc[floor]) acc[floor] = []
      acc[floor].push(result)
      return acc
    }, {} as Record<string, any[]>)

    return { successful, failed, byFloor }
  }, [data])

  const handleRetryFailed = useCallback(async () => {
    // You could implement selective retry logic here
    // For now, we'll just refetch all
    window.location.reload()
  }, [])

  if (isLoading) {
    return (
      <div>
        <h2>Loading Building Sensors...</h2>
        <div>Querying {queries.length} sensors across the building</div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2>Batch Query Failed</h2>
        <p>Error: {error.message}</p>
        <button onClick={handleRetryFailed}>Retry</button>
      </div>
    )
  }

  return (
    <div>
      <h2>Building Sensor Dashboard</h2>
      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong> {data?.successfulQueries} successful, {data?.failedQueries} failed
        {data?.failedQueries > 0 && (
          <button onClick={handleRetryFailed} style={{ marginLeft: '10px' }}>
            Retry Failed
          </button>
        )}
      </div>

      {Object.entries(processedData?.byFloor || {}).map(([floor, sensors]) => (
        <div key={floor} style={{ marginBottom: '20px' }}>
          <h3>Floor {floor} ({sensors.length} sensors)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {sensors.map((sensor, index) => (
              <div key={index} style={{ border: '1px solid #ddd', padding: '10px' }}>
                <strong>{sensor.query.topic}</strong>
                <div>Value: {sensor.result?.topics?.[0]?.payload?.value || 'N/A'}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {processedData?.failed.length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffe6e6' }}>
          <h3>Failed Sensors ({processedData.failed.length})</h3>
          {processedData.failed.map((failure, index) => (
            <div key={index}>
              {failure.query.topic}: {failure.error.message}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### useQueryJson Hook

Query a single MQTT topic with automatic JSON parsing. This hook is optimized for JSON payloads and provides better error handling for JSON-specific issues.

#### Basic Usage

```typescript
import React from 'react'
import { useQueryJson } from '@artcom/mqtt-topping-react'

interface SensorData {
  temperature: number
  humidity: number
  timestamp: string
}

const JsonSensorDisplay: React.FC = () => {
  const { data, isLoading, error } = useQueryJson('sensors/livingroom/data')

  if (isLoading) return <div>Loading sensor data...</div>
  if (error) return <div>Error: {error.message}</div>

  // data.payload is automatically parsed as JSON
  const sensorData = data?.payload as SensorData

  return (
    <div>
      <h2>Living Room Sensor</h2>
      <p>Temperature: {sensorData?.temperature}°C</p>
      <p>Humidity: {sensorData?.humidity}%</p>
      <p>Last Update: {sensorData?.timestamp}</p>
    </div>
  )
}
```

#### Key Differences from useQuery

- **No wildcards**: `useQueryJson` doesn't support `+` or `#` wildcards
- **Automatic JSON parsing**: Payload is automatically parsed as JSON
- **Better error messages**: JSON-specific error handling and messages
- **Type safety**: Better TypeScript support for JSON payloads

#### Error Handling

```typescript
const JsonWithErrorHandling: React.FC = () => {
  const { data, error, refetch } = useQueryJson('sensors/json-data', {
    retry: (failureCount, error) => {
      // Don't retry JSON parse errors
      if (error.name === 'HttpPayloadParseError') {
        return false
      }
      return failureCount < 3
    }
  })

  if (error) {
    if (error.name === 'HttpPayloadParseError') {
      return (
        <div>
          <h3>Invalid JSON Data</h3>
          <p>The sensor is sending invalid JSON. Please check the device configuration.</p>
          <button onClick={() => refetch()}>Try Again</button>
        </div>
      )
    }

    return (
      <div>
        <h3>Connection Error</h3>
        <p>{error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    )
  }

  return <div>Data: {JSON.stringify(data?.payload, null, 2)}</div>
}
```

### useQueryJsonBatch Hook

Query multiple MQTT topics simultaneously with automatic JSON parsing for each. This hook handles individual JSON parsing errors gracefully and returns results for all topics.

#### Basic Usage

```typescript
import React, { useMemo } from 'react'
import { useQueryJsonBatch } from '@artcom/mqtt-topping-react'

const JsonBatchDashboard: React.FC = () => {
  // IMPORTANT: Memoize topics array to prevent infinite re-renders
  const topics = useMemo(() => [
    'sensors/temperature/data',
    'sensors/humidity/data',
    'sensors/pressure/data',
    'config/settings'
  ], [])

  const { data, isLoading, error } = useQueryJsonBatch(topics)

  if (isLoading) return <div>Loading JSON data from {topics.length} topics...</div>
  if (error) return <div>Batch query failed: {error.message}</div>

  return (
    <div>
      <h2>JSON Data Dashboard</h2>
      {data?.map((result, index) => (
        <div key={index} style={{
          margin: '10px 0',
          padding: '10px',
          border: '1px solid #ccc',
          backgroundColor: result instanceof Error ? '#ffe6e6' : '#e6ffe6'
        }}>
          <h3>{topics[index]}</h3>
          {result instanceof Error ? (
            <div style={{ color: 'red' }}>
              <strong>Error:</strong> {result.message}
              {result.name === 'HttpPayloadParseError' && (
                <div><em>Invalid JSON format</em></div>
              )}
            </div>
          ) : (
            <div>
              <strong>Topic:</strong> {result.topic}<br/>
              <strong>Payload:</strong>
              <pre>{JSON.stringify(result.payload, null, 2)}</pre>
              <small>Updated: {result.timestamp}</small>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

#### Advanced Error Handling and Data Processing

```typescript
import React, { useMemo } from 'react'
import { useQueryJsonBatch } from '@artcom/mqtt-topping-react'

interface SensorReading {
  value: number
  unit: string
  timestamp: string
}

interface ConfigData {
  enabled: boolean
  interval: number
  thresholds: Record<string, number>
}

const AdvancedJsonBatch: React.FC = () => {
  const topics = useMemo(() => [
    'sensors/temperature/reading',
    'sensors/humidity/reading',
    'sensors/pressure/reading',
    'system/config'
  ], [])

  const { data, isLoading, error, refetch } = useQueryJsonBatch(topics, {
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 5000,
  })

  // Process and categorize results
  const processedData = useMemo(() => {
    if (!data) return null

    const successful: Array<{ topic: string; data: any; index: number }> = []
    const failed: Array<{ topic: string; error: Error; index: number }> = []

    data.forEach((result, index) => {
      if (result instanceof Error) {
        failed.push({ topic: topics[index], error: result, index })
      } else {
        successful.push({ topic: topics[index], data: result, index })
      }
    })

    // Separate sensor readings from config
    const sensorReadings = successful.filter(item =>
      item.topic.includes('sensors/')
    ).map(item => ({
      ...item,
      reading: item.data.payload as SensorReading
    }))

    const configData = successful.find(item =>
      item.topic.includes('config')
    )

    return { successful, failed, sensorReadings, configData }
  }, [data, topics])

  const handleRetryFailed = async () => {
    await refetch()
  }

  if (isLoading) {
    return (
      <div>
        <h2>Loading System Data...</h2>
        <div>Fetching data from {topics.length} sources</div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2>System Error</h2>
        <p>{error.message}</p>
        <button onClick={handleRetryFailed}>Retry All</button>
      </div>
    )
  }

  const config = processedData?.configData?.data.payload as ConfigData

  return (
    <div>
      <h2>System Dashboard</h2>

      {/* System Status */}
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f8ff' }}>
        <h3>System Status</h3>
        <p>Monitoring: {config?.enabled ? '✅ Enabled' : '❌ Disabled'}</p>
        <p>Update Interval: {config?.interval || 'Unknown'}ms</p>
        <p>Data Sources: {processedData?.successful.length}/{topics.length} online</p>
        {processedData?.failed.length > 0 && (
          <button onClick={handleRetryFailed} style={{ marginTop: '10px' }}>
            Retry Failed ({processedData.failed.length})
          </button>
        )}
      </div>

      {/* Sensor Readings */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Sensor Readings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {processedData?.sensorReadings.map((sensor, index) => {
            const sensorType = sensor.topic.split('/')[1]
            const threshold = config?.thresholds?.[sensorType]
            const isOverThreshold = threshold && sensor.reading.value > threshold

            return (
              <div key={index} style={{
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: isOverThreshold ? '#fff3cd' : 'white'
              }}>
                <h4>{sensorType.charAt(0).toUpperCase() + sensorType.slice(1)}</h4>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {sensor.reading.value} {sensor.reading.unit}
                </div>
                {isOverThreshold && (
                  <div style={{ color: '#856404', marginTop: '5px' }}>
                    ⚠️ Above threshold ({threshold})
                  </div>
                )}
                <small>Updated: {new Date(sensor.reading.timestamp).toLocaleTimeString()}</small>
              </div>
            )
          })}
        </div>
      </div>

      {/* Failed Sources */}
      {processedData?.failed.length > 0 && (
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px' }}>
          <h3>Failed Data Sources</h3>
          {processedData.failed.map((failure, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <strong>{failure.topic}:</strong> {failure.error.message}
              {failure.error.name === 'HttpPayloadParseError' && (
                <div style={{ fontSize: '12px', color: '#721c24' }}>
                  The data source is sending invalid JSON
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Performance Considerations for Batch Queries

#### Memoization is Critical

```typescript
// ❌ BAD - Creates new array on every render, causing infinite re-renders
const BadBatchComponent = () => {
  const { data } = useQueryBatch([
    { topic: 'sensor1', depth: 1 },
    { topic: 'sensor2', depth: 1 }
  ])
  return <div>{JSON.stringify(data)}</div>
}

// ✅ GOOD - Memoized queries array
const GoodBatchComponent = () => {
  const queries = useMemo(() => [
    { topic: 'sensor1', depth: 1 },
    { topic: 'sensor2', depth: 1 }
  ], [])

  const { data } = useQueryBatch(queries)
  return <div>{JSON.stringify(data)}</div>
}

// ✅ ALSO GOOD - Static queries outside component
const STATIC_QUERIES = [
  { topic: 'sensor1', depth: 1 },
  { topic: 'sensor2', depth: 1 }
]

const AnotherGoodBatchComponent = () => {
  const { data } = useQueryBatch(STATIC_QUERIES)
  return <div>{JSON.stringify(data)}</div>
}
```

#### Optimizing Large Batches

```typescript
const OptimizedLargeBatch: React.FC = () => {
  const queries = useMemo(() =>
    // Generate 100 sensor queries
    Array.from({ length: 100 }, (_, i) => ({
      topic: `sensors/device${i}`,
      depth: 0,
      parseJson: true
    })), [])

  const { data, isLoading } = useQueryBatch(queries, {
    // Cache results for 1 minute to reduce server load
    staleTime: 60000,
    // Keep in memory for 5 minutes
    gcTime: 300000,
    // Reduce retry attempts for large batches
    retry: 1,
    // Don't refetch on window focus for large batches
    refetchOnWindowFocus: false,
  })

  // Use virtual scrolling or pagination for large result sets
  const [page, setPage] = useState(0)
  const pageSize = 20

  const paginatedResults = useMemo(() => {
    if (!data?.results) return []
    const start = page * pageSize
    return data.results.slice(start, start + pageSize)
  }, [data?.results, page, pageSize])

  if (isLoading) return <div>Loading {queries.length} sensors...</div>

  return (
    <div>
      <h2>Large Sensor Network ({data?.successfulQueries}/{data?.totalQueries})</h2>

      {/* Pagination controls */}
      <div>
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Previous
        </button>
        <span> Page {page + 1} of {Math.ceil((data?.results.length || 0) / pageSize)} </span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={(page + 1) * pageSize >= (data?.results.length || 0)}
        >
          Next
        </button>
      </div>

      {/* Render only current page */}
      <div>
        {paginatedResults.map((result, index) => (
          <div key={page * pageSize + index}>
            {/* Render individual result */}
          </div>
        ))}
      </div>
    </div>
  )
}
```

#### Error Recovery Strategies

```typescript
const RobustBatchQuery: React.FC = () => {
  const [retryCount, setRetryCount] = useState(0)

  const queries = useMemo(() => [
    { topic: 'critical/sensor1', depth: 1 },
    { topic: 'critical/sensor2', depth: 1 },
    { topic: 'optional/sensor3', depth: 1 },
  ], [])

  const { data, error, refetch, isError } = useQueryBatch(queries, {
    retry: (failureCount, error) => {
      // Retry network errors but not client errors
      if (error.message.includes('Network')) {
        return failureCount < 3
      }
      return false
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff with jitter
      const baseDelay = 1000 * Math.pow(2, attemptIndex)
      const jitter = Math.random() * 1000
      return Math.min(baseDelay + jitter, 30000)
    }
  })

  const handleManualRetry = async () => {
    setRetryCount(prev => prev + 1)
    await refetch()
  }

  // Separate critical from optional failures
  const criticalFailures = data?.results.filter(result =>
    result.error && result.query.topic.includes('critical')
  ).length || 0

  const optionalFailures = data?.results.filter(result =>
    result.error && result.query.topic.includes('optional')
  ).length || 0

  if (isError && criticalFailures > 0) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f8d7da' }}>
        <h2>Critical System Error</h2>
        <p>Critical sensors are offline. System functionality may be impaired.</p>
        <button onClick={handleManualRetry}>
          Retry Connection (Attempt #{retryCount + 1})
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2>System Status</h2>
      {optionalFailures > 0 && (
        <div style={{ padding: '10px', backgroundColor: '#fff3cd', marginBottom: '10px' }}>
          ⚠️ {optionalFailures} optional sensors offline
        </div>
      )}
      {/* Render successful results */}
      {data?.results.filter(r => !r.error).map((result, index) => (
        <div key={index}>
          {/* Render result */}
        </div>
      ))}
    </div>
  )
}
```

### Common Patterns and Best Practices

#### 1. Always Memoize Query Arrays

```typescript
// Use useMemo for dynamic queries
const queries = useMemo(
  () => selectedTopics.map((topic) => ({ topic, depth: 1 })),
  [selectedTopics]
)

// Or define static queries outside the component
const STATIC_QUERIES = [{ topic: 'sensor1' }, { topic: 'sensor2' }]
```

#### 2. Handle Individual Query Failures

```typescript
// Check each result for errors
data?.results.forEach((result, index) => {
  if (result.error) {
    console.error(`Query ${index} failed:`, result.error.message)
  } else {
    console.log(`Query ${index} succeeded:`, result.result)
  }
})
```

#### 3. Use Appropriate Caching Strategies

```typescript
// For frequently changing data
const { data } = useQueryBatch(queries, {
  staleTime: 1000, // 1 second
  refetchInterval: 5000 // Refresh every 5 seconds
})

// For configuration data
const { data } = useQueryBatch(configQueries, {
  staleTime: 300000, // 5 minutes
  gcTime: 600000 // Keep for 10 minutes
})
```

#### 4. Implement Progressive Loading

```typescript
const [enabledQueries, setEnabledQueries] = useState(1)

// Load queries progressively to avoid overwhelming the server
const { data } = useQueryBatch(queries.slice(0, enabledQueries), {
  onSuccess: () => {
    if (enabledQueries < queries.length) {
      setTimeout(() => setEnabledQueries((prev) => prev + 5), 100)
    }
  },
})
```

## MqttProvider & Context

The `MqttProvider` is the foundation of mqtt-topping-react, providing MQTT and HTTP clients to your React component tree through React Context. It manages client instances and provides convenient bound methods for common MQTT operations.

### Basic Setup

The `MqttProvider` accepts both `mqttClient` and `httpClient` props, though both are optional. This flexibility allows you to use only the features you need.

```typescript
import React, { useEffect, useState } from 'react'
import {
  MqttProvider,
  connectAsync,
  createHttpClient,
  useMqttContext,
  type MqttClient,
  type HttpClient
} from '@artcom/mqtt-topping-react'

const App: React.FC = () => {
  const [clients, setClients] = useState<{
    mqttClient: MqttClient
    httpClient: HttpClient
  } | null>(null)

  useEffect(() => {
    const setupClients = async () => {
      // Connect to MQTT broker
      const mqttClient = await connectAsync('ws://broker.hivemq.com:8000/mqtt')

      // Create HTTP client for retained message queries
      const httpClient = createHttpClient('http://your-api-server.com')

      setClients({ mqttClient, httpClient })
    }

    setupClients()
  }, [])

  if (!clients) return <div>Connecting...</div>

  return (
    <MqttProvider mqttClient={clients.mqttClient} httpClient={clients.httpClient}>
      <Dashboard />
    </MqttProvider>
  )
}
```

### Provider Props

| Prop         | Type         | Required | Description                                       |
| ------------ | ------------ | -------- | ------------------------------------------------- |
| `children`   | `ReactNode`  | Yes      | Child components that will have access to context |
| `mqttClient` | `MqttClient` | No       | MQTT client instance for real-time messaging      |
| `httpClient` | `HttpClient` | No       | HTTP client instance for retained message queries |

### Context Value

The `useMqttContext` hook provides access to the following context value:

```typescript
interface MqttContextValue {
  // Direct client access
  mqttClient?: MqttClient
  httpClient?: HttpClient

  // Convenient bound methods (available when mqttClient is provided)
  publish?: (topic: string, data: unknown, opts?: MqttPublishOptions) => Promise<MqttResult | void>
  unpublish?: (topic: string, qos?: MqttQoS) => Promise<MqttResult | void>
  subscribe?: (
    topic: string,
    callback: MessageCallback,
    opts?: MqttSubscribeOptions
  ) => Promise<void>
  unsubscribe?: (topic: string, callback: MessageCallback) => Promise<MqttResult | void>
  unpublishRecursively?: (
    topic: string,
    qos?: MqttQoS
  ) => Promise<PromiseSettledResult<MqttResult | void>[]>
}
```

### Connection Management

#### WebSocket Connections

Most modern MQTT brokers support WebSocket connections, which work well in browser environments:

```typescript
import { connectAsync } from '@artcom/mqtt-topping-react'

// Basic WebSocket connection
const mqttClient = await connectAsync('ws://broker.hivemq.com:8000/mqtt')

// WebSocket with SSL/TLS
const secureMqttClient = await connectAsync('wss://secure-broker.com:8443/mqtt')

// WebSocket with custom options
const customMqttClient = await connectAsync('ws://localhost:9001/mqtt', {
  clientId: 'my-react-app',
  clean: true,
  keepalive: 60,
  reconnectPeriod: 1000,
  connectTimeout: 30000,
})
```

#### TCP Connections (Node.js)

For Node.js environments, you can use TCP connections:

```typescript
// TCP connection
const tcpClient = await connectAsync('mqtt://broker.hivemq.com:1883')

// TCP with SSL/TLS
const secureTcpClient = await connectAsync('mqtts://secure-broker.com:8883')
```

#### Connection Error Handling

Always implement proper error handling for connection failures:

```typescript
const App: React.FC = () => {
  const [clients, setClients] = useState<{ mqttClient: MqttClient; httpClient: HttpClient } | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)

  useEffect(() => {
    const setupClients = async () => {
      try {
        setIsConnecting(true)
        setConnectionError(null)

        const mqttClient = await connectAsync('ws://broker.hivemq.com:8000/mqtt', {
          clientId: `app-${Math.random().toString(36).substr(2, 9)}`,
          clean: true,
          keepalive: 60,
          reconnectPeriod: 1000,
          will: {
            topic: 'clients/disconnect',
            payload: JSON.stringify({ clientId: 'my-app', timestamp: Date.now() }),
            qos: 1,
            retain: false
          }
        })

        const httpClient = createHttpClient('http://your-api-server.com')
        setClients({ mqttClient, httpClient })
      } catch (error) {
        console.error('Connection failed:', error)
        setConnectionError(error instanceof Error ? error.message : 'Connection failed')
      } finally {
        setIsConnecting(false)
      }
    }

    setupClients()
  }, [])

  if (isConnecting) return <div>🔌 Connecting to MQTT broker...</div>
  if (connectionError) return <div>❌ Connection failed: {connectionError}</div>
  if (!clients) return <div>⚠️ No clients available</div>

  return (
    <MqttProvider mqttClient={clients.mqttClient} httpClient={clients.httpClient}>
      <Dashboard />
    </MqttProvider>
  )
}
```

### Publishing Messages

The context provides a convenient `publish` method that's bound to the MQTT client:

#### Basic Publishing

```typescript
import { useMqttContext } from '@artcom/mqtt-topping-react'

const PublishExample: React.FC = () => {
  const { publish } = useMqttContext()

  const handlePublish = async () => {
    if (!publish) {
      console.error('MQTT client not available')
      return
    }

    try {
      await publish('sensors/temperature', { value: 23.5, unit: 'celsius' })
      console.log('Message published successfully')
    } catch (error) {
      console.error('Failed to publish:', error)
    }
  }

  return <button onClick={handlePublish}>Publish Temperature</button>
}
```

#### Publishing with Options

```typescript
const AdvancedPublishExample: React.FC = () => {
  const { publish } = useMqttContext()

  const publishWithOptions = async () => {
    if (!publish) return

    try {
      // Publish with QoS and retain options
      await publish('config/settings',
        { theme: 'dark', language: 'en' },
        {
          qos: 1,        // Ensure delivery
          retain: true   // Keep as retained message
        }
      )
    } catch (error) {
      console.error('Publish failed:', error)
    }
  }

  const publishBinary = async () => {
    if (!publish) return

    try {
      // Publish binary data
      const binaryData = new Uint8Array([0x01, 0x02, 0x03, 0x04])
      await publish('sensors/binary', binaryData, { qos: 0 })
    } catch (error) {
      console.error('Binary publish failed:', error)
    }
  }

  return (
    <div>
      <button onClick={publishWithOptions}>Publish Config</button>
      <button onClick={publishBinary}>Publish Binary</button>
    </div>
  )
}
```

### Unpublishing Messages

Remove retained messages from topics using the `unpublish` method:

```typescript
const UnpublishExample: React.FC = () => {
  const { unpublish } = useMqttContext()

  const handleUnpublish = async () => {
    if (!unpublish) return

    try {
      // Remove retained message from topic
      await unpublish('sensors/temperature', 1)
      console.log('Message unpublished')
    } catch (error) {
      console.error('Unpublish failed:', error)
    }
  }

  return <button onClick={handleUnpublish}>Clear Temperature</button>
}
```

### Recursive Unpublishing

The `unpublishRecursively` method removes all retained messages from a topic hierarchy:

```typescript
const RecursiveUnpublishExample: React.FC = () => {
  const { unpublishRecursively } = useMqttContext()

  const clearAllSensors = async () => {
    if (!unpublishRecursively) {
      console.error('Recursive unpublish not available (requires both MQTT and HTTP clients)')
      return
    }

    try {
      // Clear all sensor data recursively
      const results = await unpublishRecursively('sensors/', 1)

      // Check results
      const successful = results.filter(result => result.status === 'fulfilled').length
      const failed = results.filter(result => result.status === 'rejected').length

      console.log(`Cleared ${successful} topics, ${failed} failed`)
    } catch (error) {
      console.error('Recursive unpublish failed:', error)
    }
  }

  return <button onClick={clearAllSensors}>Clear All Sensors</button>
}
```

### Direct Subscription Management

While `useMqttSubscribe` hook is recommended for most use cases, you can also manage subscriptions directly:

```typescript
const DirectSubscriptionExample: React.FC = () => {
  const { subscribe, unsubscribe } = useMqttContext()
  const [isSubscribed, setIsSubscribed] = useState(false)

  const messageCallback = useCallback((payload: unknown, topic: string) => {
    console.log(`Received on ${topic}:`, payload)
  }, [])

  const handleSubscribe = async () => {
    if (!subscribe) return

    try {
      await subscribe('alerts/+', messageCallback, { qos: 1 })
      setIsSubscribed(true)
    } catch (error) {
      console.error('Subscribe failed:', error)
    }
  }

  const handleUnsubscribe = async () => {
    if (!unsubscribe) return

    try {
      await unsubscribe('alerts/+', messageCallback)
      setIsSubscribed(false)
    } catch (error) {
      console.error('Unsubscribe failed:', error)
    }
  }

  return (
    <div>
      <button onClick={handleSubscribe} disabled={isSubscribed}>
        Subscribe to Alerts
      </button>
      <button onClick={handleUnsubscribe} disabled={!isSubscribed}>
        Unsubscribe from Alerts
      </button>
    </div>
  )
}
```

### Broker-Specific Configurations

#### HiveMQ Cloud

```typescript
const connectToHiveMQ = async () => {
  const mqttClient = await connectAsync('wss://your-cluster.s1.eu.hivemq.cloud:8884/mqtt', {
    username: 'your-username',
    password: 'your-password',
    clientId: 'react-app-' + Math.random().toString(36).substr(2, 9),
    clean: true,
    keepalive: 60,
  })

  return mqttClient
}
```

#### AWS IoT Core

```typescript
const connectToAWSIoT = async () => {
  // Note: AWS IoT requires WebSocket authentication with SigV4
  const mqttClient = await connectAsync('wss://your-endpoint.iot.region.amazonaws.com/mqtt', {
    clientId: 'react-client-' + Math.random().toString(36).substr(2, 9),
    clean: true,
    keepalive: 300, // AWS IoT recommends 300 seconds
    protocol: 'wss',
    // Additional AWS-specific configuration would go here
  })

  return mqttClient
}
```

#### Eclipse Mosquitto

```typescript
const connectToMosquitto = async () => {
  // Local Mosquitto with WebSocket support
  const mqttClient = await connectAsync('ws://localhost:9001', {
    clientId: 'react-app',
    clean: true,
    keepalive: 60,
    username: 'mqtt-user',
    password: 'mqtt-password',
  })

  return mqttClient
}
```

### Authentication Patterns

#### Username/Password Authentication

```typescript
const authenticatedConnection = async () => {
  const mqttClient = await connectAsync('wss://secure-broker.com:8443/mqtt', {
    username: process.env.REACT_APP_MQTT_USERNAME,
    password: process.env.REACT_APP_MQTT_PASSWORD,
    clientId: 'authenticated-client',
    clean: true,
  })

  return mqttClient
}
```

#### Certificate-Based Authentication (Node.js)

```typescript
import fs from 'fs'

const certificateConnection = async () => {
  const mqttClient = await connectAsync('mqtts://secure-broker.com:8883', {
    key: fs.readFileSync('client-key.pem'),
    cert: fs.readFileSync('client-cert.pem'),
    ca: fs.readFileSync('ca-cert.pem'),
    clientId: 'cert-client',
    clean: true,
  })

  return mqttClient
}
```

### Environment-Specific Configuration

#### Development Environment

```typescript
const developmentConfig = {
  mqttUrl: 'ws://localhost:9001',
  httpUrl: 'http://localhost:3001',
  clientId: 'dev-client',
  debug: true,
}

const connectDevelopment = async () => {
  const mqttClient = await connectAsync(developmentConfig.mqttUrl, {
    clientId: developmentConfig.clientId,
    clean: true,
    keepalive: 30, // Shorter keepalive for development
  })

  const httpClient = createHttpClient(developmentConfig.httpUrl)

  return { mqttClient, httpClient }
}
```

#### Production Environment

```typescript
const productionConfig = {
  mqttUrl: process.env.REACT_APP_MQTT_URL!,
  httpUrl: process.env.REACT_APP_HTTP_URL!,
  username: process.env.REACT_APP_MQTT_USERNAME,
  password: process.env.REACT_APP_MQTT_PASSWORD,
}

const connectProduction = async () => {
  const mqttClient = await connectAsync(productionConfig.mqttUrl, {
    clientId: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    clean: true,
    keepalive: 60,
    username: productionConfig.username,
    password: productionConfig.password,
    reconnectPeriod: 5000, // Longer reconnect period for production
    will: {
      topic: 'clients/disconnect',
      payload: JSON.stringify({
        clientId: 'production-client',
        timestamp: Date.now(),
        reason: 'unexpected_disconnect',
      }),
      qos: 1,
      retain: false,
    },
  })

  const httpClient = createHttpClient(productionConfig.httpUrl)

  return { mqttClient, httpClient }
}
```

### Error Handling Patterns

#### Connection Retry Logic

```typescript
const connectWithRetry = async (maxRetries = 3, retryDelay = 1000) => {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const mqttClient = await connectAsync('ws://broker.hivemq.com:8000/mqtt', {
        clientId: `retry-client-${attempt}`,
        connectTimeout: 10000,
      })

      console.log(`Connected successfully on attempt ${attempt}`)
      return mqttClient
    } catch (error) {
      lastError = error as Error
      console.warn(`Connection attempt ${attempt} failed:`, error)

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt))
      }
    }
  }

  throw new Error(`Failed to connect after ${maxRetries} attempts: ${lastError?.message}`)
}
```

#### Graceful Error Handling

```typescript
const RobustMqttComponent: React.FC = () => {
  const { publish, mqttClient } = useMqttContext()
  const [publishError, setPublishError] = useState<string | null>(null)

  const handlePublishWithErrorHandling = async (topic: string, data: unknown) => {
    if (!publish) {
      setPublishError('MQTT client not available')
      return
    }

    try {
      setPublishError(null)
      await publish(topic, data)
      console.log('Published successfully')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setPublishError(errorMessage)

      // Log detailed error information
      console.error('Publish error details:', {
        topic,
        data,
        error: errorMessage,
        clientConnected: mqttClient?.connected,
        timestamp: new Date().toISOString()
      })
    }
  }

  return (
    <div>
      <button onClick={() => handlePublishWithErrorHandling('test/topic', { test: true })}>
        Publish Test Message
      </button>
      {publishError && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {publishError}
        </div>
      )}
    </div>
  )
}
```

### Performance Considerations

#### Provider Optimization

The `MqttProvider` is optimized with `React.memo` to prevent unnecessary re-renders:

```typescript
// The provider only re-renders when client instances change
const OptimizedApp: React.FC = () => {
  const [clients] = useState(() => {
    // Initialize clients once and memoize
    return {
      mqttClient: /* your mqtt client */,
      httpClient: /* your http client */
    }
  })

  return (
    <MqttProvider mqttClient={clients.mqttClient} httpClient={clients.httpClient}>
      <App />
    </MqttProvider>
  )
}
```

#### Context Value Stability

The context value is memoized to prevent unnecessary re-renders of consuming components:

```typescript
// Context value only changes when clients change
const { publish, subscribe } = useMqttContext() // Stable references
```

### Testing with MqttProvider

#### Mock Provider for Testing

```typescript
import { render } from '@testing-library/react'
import { MqttProvider } from '@artcom/mqtt-topping-react'

const mockMqttClient = {
  publish: jest.fn(),
  unpublish: jest.fn(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
} as any

const mockHttpClient = {
  query: jest.fn(),
  queryBatch: jest.fn(),
} as any

const renderWithMqttProvider = (component: React.ReactElement) => {
  return render(
    <MqttProvider mqttClient={mockMqttClient} httpClient={mockHttpClient}>
      {component}
    </MqttProvider>
  )
}

// Use in tests
test('component publishes message', async () => {
  const { getByText } = renderWithMqttProvider(<MyComponent />)

  fireEvent.click(getByText('Publish'))

  expect(mockMqttClient.publish).toHaveBeenCalledWith('test/topic', { data: 'test' })
})
```

### Common Patterns

#### Conditional Client Usage

```typescript
const ConditionalFeatures: React.FC = () => {
  const { mqttClient, httpClient, publish } = useMqttContext()

  return (
    <div>
      {mqttClient && (
        <button onClick={() => publish?.('test', 'data')}>
          Publish (MQTT Available)
        </button>
      )}

      {httpClient && (
        <div>HTTP queries available</div>
      )}

      {!mqttClient && !httpClient && (
        <div>No clients available</div>
      )}
    </div>
  )
}
```

#### Multiple Provider Pattern

```typescript
// For complex applications, you might need multiple MQTT connections
const MultiProviderApp: React.FC = () => {
  return (
    <MqttProvider mqttClient={sensorMqttClient} httpClient={sensorHttpClient}>
      <SensorDashboard />

      <MqttProvider mqttClient={controlMqttClient}>
        <ControlPanel />
      </MqttProvider>
    </MqttProvider>
  )
}
```

---

## ⚡ Advanced Patterns & Performance Optimization

This section covers advanced usage patterns, performance optimization techniques, and production deployment considerations for mqtt-topping-react applications.

### Connection Pooling and Management

#### Connection Pool Pattern

For applications with multiple MQTT connections, implement a connection pool to manage resources efficiently:

```typescript
import { connectAsync, MqttClient } from '@artcom/mqtt-topping-react'

interface ConnectionPool {
  [key: string]: MqttClient
}

class MqttConnectionManager {
  private connections: ConnectionPool = {}
  private connectionPromises: { [key: string]: Promise<MqttClient> } = {}

  async getConnection(brokerUrl: string, options?: any): Promise<MqttClient> {
    const key = `${brokerUrl}-${JSON.stringify(options || {})}`

    // Return existing connection if available
    if (this.connections[key]) {
      return this.connections[key]
    }

    // Return existing promise if connection is in progress
    if (this.connectionPromises[key]) {
      return this.connectionPromises[key]
    }

    // Create new connection
    this.connectionPromises[key] = this.createConnection(brokerUrl, options)

    try {
      const client = await this.connectionPromises[key]
      this.connections[key] = client
      delete this.connectionPromises[key]
      return client
    } catch (error) {
      delete this.connectionPromises[key]
      throw error
    }
  }

  private async createConnection(brokerUrl: string, options?: any): Promise<MqttClient> {
    const client = await connectAsync(brokerUrl, {
      keepalive: 60,
      reconnectPeriod: 1000,
      connectTimeout: 30000,
      ...options
    })

    // Add connection event handlers
    client.on('connect', () => {
      console.log(`Connected to ${brokerUrl}`)
    })

    client.on('disconnect', () => {
      console.log(`Disconnected from ${brokerUrl}`)
    })

    client.on('error', (error) => {
      console.error(`Connection error for ${brokerUrl}:`, error)
      // Remove failed connection from pool
      const key = `${brokerUrl}-${JSON.stringify(options || {})}`
      delete this.connections[key]
    })

    return client
  }

  closeConnection(brokerUrl: string, options?: any): void {
    const key = `${brokerUrl}-${JSON.stringify(options || {})}`
    const client = this.connections[key]

    if (client) {
      client.end()
      delete this.connections[key]
    }
  }

  closeAllConnections(): void {
    Object.values(this.connections).forEach(client => client.end())
    this.connections = {}
  }
}

// Usage in your application
const connectionManager = new MqttConnectionManager()

const App: React.FC = () => {
  const [clients, setClients] = useState<{
    sensorClient: MqttClient
    controlClient: MqttClient
  } | null>(null)

  useEffect(() => {
    const setupConnections = async () => {
      try {
        const [sensorClient, controlClient] = await Promise.all([
          connectionManager.getConnection('ws://sensors.broker.com:8000/mqtt', {
            clientId: 'sensor-client'
          }),
          connectionManager.getConnection('ws://control.broker.com:8000/mqtt', {
            clientId: 'control-client'
          })
        ])

        setClients({ sensorClient, controlClient })
      } catch (error) {
        console.error('Failed to setup connections:', error)
      }
    }

    setupConnections()

    // Cleanup on unmount
    return () => {
      connectionManager.closeAllConnections()
    }
  }, [])

  if (!clients) return <div>Connecting...</div>

  return (
    <MqttProvider mqttClient={clients.sensorClient}>
      <SensorDashboard />

      <MqttProvider mqttClient={clients.controlClient}>
        <ControlPanel />
      </MqttProvider>
    </MqttProvider>
  )
}
```

#### Subscription Management

Implement centralized subscription management to avoid duplicate subscriptions and optimize performance:

```typescript
import { useCallback, useMemo, useRef } from 'react'

import { useMqttSubscribe } from '@artcom/mqtt-topping-react'

interface SubscriptionManager {
  subscriptions: Map<string, Set<string>>
  callbacks: Map<string, ((payload: unknown) => void)[]>
}

const useSubscriptionManager = () => {
  const manager = useRef<SubscriptionManager>({
    subscriptions: new Map(),
    callbacks: new Map(),
  })

  const subscribe = useCallback(
    (topic: string, callback: (payload: unknown) => void, componentId: string) => {
      // Track subscription by component
      if (!manager.current.subscriptions.has(topic)) {
        manager.current.subscriptions.set(topic, new Set())
      }
      manager.current.subscriptions.get(topic)!.add(componentId)

      // Track callback
      if (!manager.current.callbacks.has(topic)) {
        manager.current.callbacks.set(topic, [])
      }
      manager.current.callbacks.get(topic)!.push(callback)

      return () => {
        // Cleanup on unsubscribe
        const componentSet = manager.current.subscriptions.get(topic)
        if (componentSet) {
          componentSet.delete(componentId)
          if (componentSet.size === 0) {
            manager.current.subscriptions.delete(topic)
            manager.current.callbacks.delete(topic)
          }
        }
      }
    },
    []
  )

  const getActiveTopics = useCallback(() => {
    return Array.from(manager.current.subscriptions.keys())
  }, [])

  const getSubscriberCount = useCallback((topic: string) => {
    return manager.current.subscriptions.get(topic)?.size || 0
  }, [])

  return { subscribe, getActiveTopics, getSubscriberCount }
}

// Optimized subscription hook
const useOptimizedSubscription = (topic: string, callback: (payload: unknown) => void) => {
  const componentId = useMemo(() => Math.random().toString(36), [])
  const { subscribe } = useSubscriptionManager()

  const memoizedCallback = useCallback(callback, [callback])

  useMqttSubscribe(topic, memoizedCallback, {
    enabled: true,
    qos: 1,
  })

  useEffect(() => {
    return subscribe(topic, memoizedCallback, componentId)
  }, [topic, memoizedCallback, componentId, subscribe])
}
```

### TanStack Query Caching Configuration and Optimization

#### Advanced Query Configuration

Configure TanStack Query for optimal MQTT data caching:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Optimized query client configuration for MQTT data
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // MQTT data is often real-time, so shorter stale times
      staleTime: 30 * 1000, // 30 seconds

      // Keep data in cache longer for offline scenarios
      gcTime: 10 * 60 * 1000, // 10 minutes

      // Retry configuration for network issues
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error.message.includes('4')) return false
        // Retry network errors up to 3 times
        return failureCount < 3
      },

      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Background refetch configuration
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,

      // Network mode for offline scenarios
      networkMode: 'online'
    },
    mutations: {
      // MQTT publish operations
      retry: 1,
      networkMode: 'online'
    }
  }
})

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MqttProvider mqttClient={mqttClient} httpClient={httpClient}>
        <Dashboard />
      </MqttProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

#### Smart Caching Strategies

Implement intelligent caching based on data types and update frequencies:

```typescript
import { useQuery, useQueryClient } from '@tanstack/react-query'

// Cache configuration based on data characteristics
const useCachedQuery = <T>(
  topic: string,
  options: {
    updateFrequency: 'high' | 'medium' | 'low'
    dataType: 'sensor' | 'config' | 'status'
    critical: boolean
  }
) => {
  const queryClient = useQueryClient()

  const cacheConfig = useMemo(() => {
    const baseConfig = {
      topic,
      parseJson: true
    }

    switch (options.updateFrequency) {
      case 'high':
        return {
          ...baseConfig,
          staleTime: 5 * 1000, // 5 seconds
          refetchInterval: options.critical ? 1000 : 5000
        }
      case 'medium':
        return {
          ...baseConfig,
          staleTime: 30 * 1000, // 30 seconds
          refetchInterval: 30 * 1000
        }
      case 'low':
        return {
          ...baseConfig,
          staleTime: 5 * 60 * 1000, // 5 minutes
          refetchInterval: false
        }
    }
  }, [topic, options])

  const query = useQuery<T>(cacheConfig)

  // Prefetch related data
  useEffect(() => {
    if (options.dataType === 'sensor' && query.data) {
      // Prefetch related sensor data
      queryClient.prefetchQuery({
        queryKey: ['httpQuery', { topic: topic.replace('/temperature', '/humidity') }]
      })
    }
  }, [query.data, options.dataType, topic, queryClient])

  return query
}

// Usage examples
const HighFrequencySensor: React.FC = () => {
  const { data, isLoading } = useCachedQuery<SensorData>('sensors/critical/temperature', {
    updateFrequency: 'high',
    dataType: 'sensor',
    critical: true
  })

  return <div>Critical Temp: {data?.temperature}°C</div>
}

const ConfigurationData: React.FC = () => {
  const { data } = useCachedQuery<ConfigData>('system/config', {
    updateFrequency: 'low',
    dataType: 'config',
    critical: false
  })

  return <div>Config loaded: {data?.version}</div>
}
```

### High-Frequency Message Handling with Throttling

#### Message Throttling and Batching

Handle high-frequency MQTT messages efficiently:

```typescript
import { useCallback, useRef, useState, useEffect } from 'react'
import { useMqttSubscribe } from '@artcom/mqtt-topping-react'

// Throttling hook for high-frequency messages
const useThrottledSubscription = (
  topic: string,
  callback: (payload: unknown) => void,
  throttleMs: number = 100
) => {
  const lastCallTime = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const latestPayload = useRef<unknown>()

  const throttledCallback = useCallback((payload: unknown) => {
    latestPayload.current = payload
    const now = Date.now()

    if (now - lastCallTime.current >= throttleMs) {
      // Execute immediately if enough time has passed
      lastCallTime.current = now
      callback(payload)
    } else {
      // Schedule execution for later
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        lastCallTime.current = Date.now()
        callback(latestPayload.current)
      }, throttleMs - (now - lastCallTime.current))
    }
  }, [callback, throttleMs])

  useMqttSubscribe(topic, throttledCallback)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
}

// Batching hook for collecting multiple messages
const useBatchedSubscription = <T>(
  topic: string,
  callback: (batch: T[]) => void,
  batchSize: number = 10,
  maxWaitMs: number = 1000
) => {
  const batch = useRef<T[]>([])
  const timeoutRef = useRef<NodeJS.Timeout>()

  const processBatch = useCallback(() => {
    if (batch.current.length > 0) {
      callback([...batch.current])
      batch.current = []
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }, [callback])

  const batchedCallback = useCallback((payload: unknown) => {
    batch.current.push(payload as T)

    // Process batch if size limit reached
    if (batch.current.length >= batchSize) {
      processBatch()
      return
    }

    // Set timeout for maximum wait time
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(processBatch, maxWaitMs)
    }
  }, [batchSize, maxWaitMs, processBatch])

  useMqttSubscribe(topic, batchedCallback)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
}

// Usage examples
const HighFrequencyDashboard: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null)
  const [messageBatch, setMessageBatch] = useState<any[]>([])

  // Throttle high-frequency sensor updates
  useThrottledSubscription(
    'sensors/high-frequency/+',
    useCallback((payload: unknown) => {
      setSensorData(payload as SensorData)
    }, []),
    100 // Update UI at most every 100ms
  )

  // Batch log messages for efficient processing
  useBatchedSubscription<LogMessage>(
    'system/logs/+',
    useCallback((batch: LogMessage[]) => {
      setMessageBatch(prev => [...prev, ...batch].slice(-100)) // Keep last 100
    }, []),
    20, // Process every 20 messages
    2000 // Or every 2 seconds
  )

  return (
    <div>
      <h2>High-Frequency Dashboard</h2>
      <div>Latest Sensor: {sensorData?.value}</div>
      <div>Log Messages: {messageBatch.length}</div>
    </div>
  )
}
```

#### Selective Updates with React.memo

Optimize component re-rendering for high-frequency updates:

```typescript
import React, { memo, useMemo } from 'react'

interface SensorDisplayProps {
  sensorData: SensorData
  threshold: number
}

// Memoized component that only re-renders when relevant data changes
const SensorDisplay = memo<SensorDisplayProps>(({ sensorData, threshold }) => {
  const isAlert = useMemo(() =>
    sensorData.temperature > threshold,
    [sensorData.temperature, threshold]
  )

  const displayValue = useMemo(() =>
    Math.round(sensorData.temperature * 10) / 10,
    [sensorData.temperature]
  )

  return (
    <div style={{ color: isAlert ? 'red' : 'black' }}>
      Temperature: {displayValue}°C
      {isAlert && <span> ⚠️ ALERT</span>}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function - only re-render if temperature changed significantly
  const tempDiff = Math.abs(prevProps.sensorData.temperature - nextProps.sensorData.temperature)
  return tempDiff < 0.1 && prevProps.threshold === nextProps.threshold
})

// Usage with high-frequency data
const OptimizedDashboard: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData>({ temperature: 20, timestamp: '' })

  useThrottledSubscription('sensors/temperature', (payload: unknown) => {
    setSensorData(payload as SensorData)
  }, 50)

  return (
    <div>
      <SensorDisplay sensorData={sensorData} threshold={25} />
    </div>
  )
}
```

### Memory Management and Cleanup Patterns

#### Subscription Cleanup

Implement proper cleanup to prevent memory leaks:

```typescript
import { useEffect, useRef, useCallback } from 'react'
import { useMqttSubscribe } from '@artcom/mqtt-topping-react'

// Hook with automatic cleanup tracking
const useCleanupTracking = () => {
  const cleanupFunctions = useRef<(() => void)[]>([])

  const addCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup)
  }, [])

  useEffect(() => {
    return () => {
      // Execute all cleanup functions on unmount
      cleanupFunctions.current.forEach(cleanup => {
        try {
          cleanup()
        } catch (error) {
          console.error('Cleanup error:', error)
        }
      })
      cleanupFunctions.current = []
    }
  }, [])

  return { addCleanup }
}

// Memory-safe subscription component
const MemorySafeComponent: React.FC = () => {
  const { addCleanup } = useCleanupTracking()
  const [messages, setMessages] = useState<string[]>([])
  const messagesRef = useRef<string[]>([])

  // Keep messages ref in sync
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const handleMessage = useCallback((payload: unknown) => {
    setMessages(prev => {
      const newMessages = [...prev, JSON.stringify(payload)].slice(-50) // Keep only last 50
      return newMessages
    })
  }, [])

  useMqttSubscribe('sensors/+', handleMessage)

  // Add cleanup for any intervals or external resources
  useEffect(() => {
    const interval = setInterval(() => {
      // Periodic cleanup of old messages
      setMessages(prev => prev.slice(-25)) // Keep only last 25
    }, 30000)

    addCleanup(() => clearInterval(interval))
  }, [addCleanup])

  return (
    <div>
      <h3>Recent Messages ({messages.length})</h3>
      {messages.map((msg, index) => (
        <div key={index}>{msg}</div>
      ))}
    </div>
  )
}
```

#### WeakMap-based Caching

Use WeakMap for memory-efficient caching:

```typescript
// Memory-efficient topic cache
class TopicCache {
  private cache = new WeakMap<object, Map<string, any>>()
  private keyCache = new Map<string, WeakRef<object>>()

  set(topic: string, data: any, component: object): void {
    if (!this.cache.has(component)) {
      this.cache.set(component, new Map())
    }

    this.cache.get(component)!.set(topic, data)
    this.keyCache.set(topic, new WeakRef(component))
  }

  get(topic: string, component: object): any {
    const componentCache = this.cache.get(component)
    return componentCache?.get(topic)
  }

  cleanup(): void {
    // Clean up dead weak references
    for (const [topic, weakRef] of this.keyCache.entries()) {
      if (weakRef.deref() === undefined) {
        this.keyCache.delete(topic)
      }
    }
  }
}

const topicCache = new TopicCache()

// Hook using memory-efficient caching
const useCachedTopic = (topic: string) => {
  const componentRef = useRef({}) // Unique object for this component instance
  const [data, setData] = useState(() => topicCache.get(topic, componentRef.current))

  const handleMessage = useCallback(
    (payload: unknown) => {
      topicCache.set(topic, payload, componentRef.current)
      setData(payload)
    },
    [topic]
  )

  useMqttSubscribe(topic, handleMessage)

  // Periodic cleanup
  useEffect(() => {
    const interval = setInterval(() => topicCache.cleanup(), 60000)
    return () => clearInterval(interval)
  }, [])

  return data
}
```

### Testing Strategies with Mocking

#### Comprehensive MQTT Mocking

Create robust mocks for testing MQTT functionality:

```typescript
// __mocks__/@artcom/mqtt-topping-react.ts
import { jest } from '@jest/globals'

// Mock MQTT client
export const mockMqttClient = {
  publish: jest.fn().mockResolvedValue(undefined),
  unpublish: jest.fn().mockResolvedValue(undefined),
  unpublishRecursively: jest.fn().mockResolvedValue(undefined),
  subscribe: jest.fn().mockResolvedValue(undefined),
  unsubscribe: jest.fn().mockResolvedValue(undefined),
  on: jest.fn(),
  off: jest.fn(),
  end: jest.fn(),
  connected: true,
}

// Mock HTTP client
export const mockHttpClient = {
  query: jest.fn().mockResolvedValue({ data: 'mock-data' }),
  queryBatch: jest.fn().mockResolvedValue([{ data: 'mock-data-1' }, { data: 'mock-data-2' }]),
}

// Mock hooks
export const useQuery = jest.fn().mockReturnValue({
  data: null,
  isLoading: false,
  isError: false,
  error: null,
  refetch: jest.fn(),
})

export const useMqttSubscribe = jest.fn()

export const useMqttContext = jest.fn().mockReturnValue({
  mqttClient: mockMqttClient,
  httpClient: mockHttpClient,
  publish: mockMqttClient.publish,
  unpublish: mockMqttClient.unpublish,
  unpublishRecursively: mockMqttClient.unpublishRecursively,
})

export const MqttProvider = ({ children }: { children: React.ReactNode }) => children

export const connectAsync = jest.fn().mockResolvedValue(mockMqttClient)
export const createHttpClient = jest.fn().mockReturnValue(mockHttpClient)
```

#### Test Utilities

Create utilities for testing MQTT components:

```typescript
// test-utils/mqtt-test-utils.tsx
import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MqttProvider } from '@artcom/mqtt-topping-react'

// Test-specific query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0
    }
  }
})

interface MqttTestProviderProps {
  children: React.ReactNode
  mqttClient?: any
  httpClient?: any
}

const MqttTestProvider: React.FC<MqttTestProviderProps> = ({
  children,
  mqttClient = mockMqttClient,
  httpClient = mockHttpClient
}) => {
  const queryClient = createTestQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <MqttProvider mqttClient={mqttClient} httpClient={httpClient}>
        {children}
      </MqttProvider>
    </QueryClientProvider>
  )
}

// Custom render function
export const renderWithMqtt = (
  ui: React.ReactElement,
  options: RenderOptions & {
    mqttClient?: any
    httpClient?: any
  } = {}
) => {
  const { mqttClient, httpClient, ...renderOptions } = options

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MqttTestProvider mqttClient={mqttClient} httpClient={httpClient}>
      {children}
    </MqttTestProvider>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock message simulation
export const simulateMessage = (topic: string, payload: any) => {
  const callbacks = (useMqttSubscribe as jest.Mock).mock.calls
    .filter(([callTopic]) => callTopic === topic)
    .map(([, callback]) => callback)

  callbacks.forEach(callback => callback(payload))
}

// Mock query response
export const mockQueryResponse = (data: any, loading = false, error = null) => {
  ;(useQuery as jest.Mock).mockReturnValue({
    data,
    isLoading: loading,
    isError: !!error,
    error,
    refetch: jest.fn()
  })
}
```

#### Example Test Cases

```typescript
// components/__tests__/SensorDashboard.test.tsx
import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithMqtt, simulateMessage, mockQueryResponse } from '../test-utils/mqtt-test-utils'
import { SensorDashboard } from '../SensorDashboard'

describe('SensorDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('displays sensor data from query', async () => {
    mockQueryResponse({ temperature: 25.5, humidity: 60 })

    renderWithMqtt(<SensorDashboard />)

    expect(screen.getByText('Temperature: 25.5°C')).toBeInTheDocument()
    expect(screen.getByText('Humidity: 60%')).toBeInTheDocument()
  })

  it('handles real-time updates via subscription', async () => {
    renderWithMqtt(<SensorDashboard />)

    // Simulate incoming MQTT message
    simulateMessage('sensors/temperature', { temperature: 30.0 })

    await waitFor(() => {
      expect(screen.getByText(/30.0/)).toBeInTheDocument()
    })
  })

  it('publishes control messages', async () => {
    const mockMqttClient = {
      ...mockMqttClient,
      publish: jest.fn().mockResolvedValue(undefined)
    }

    renderWithMqtt(<SensorDashboard />, { mqttClient: mockMqttClient })

    fireEvent.click(screen.getByText('Toggle Device'))

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'devices/control',
      { action: 'toggle' },
      expect.any(Object)
    )
  })

  it('handles connection errors gracefully', async () => {
    const errorClient = {
      ...mockMqttClient,
      connected: false
    }

    renderWithMqtt(<SensorDashboard />, { mqttClient: errorClient })

    expect(screen.getByText(/connection error/i)).toBeInTheDocument()
  })
})
```

### Production Deployment Considerations

#### Environment Configuration

Configure the library for different deployment environments:

```typescript
// config/mqtt-config.ts
interface MqttConfig {
  brokerUrl: string
  options: {
    keepalive: number
    reconnectPeriod: number
    connectTimeout: number
    clientId?: string
    username?: string
    password?: string
    clean: boolean
  }
  httpApiUrl?: string
}

const getEnvironmentConfig = (): MqttConfig => {
  const env = process.env.NODE_ENV || 'development'

  const configs: Record<string, MqttConfig> = {
    development: {
      brokerUrl: 'ws://localhost:8000/mqtt',
      options: {
        keepalive: 60,
        reconnectPeriod: 1000,
        connectTimeout: 30000,
        clean: true,
      },
      httpApiUrl: 'http://localhost:3001',
    },

    staging: {
      brokerUrl: process.env.REACT_APP_MQTT_BROKER_URL!,
      options: {
        keepalive: 60,
        reconnectPeriod: 5000,
        connectTimeout: 30000,
        clientId: `staging-${Math.random().toString(36).substr(2, 9)}`,
        username: process.env.REACT_APP_MQTT_USERNAME,
        password: process.env.REACT_APP_MQTT_PASSWORD,
        clean: true,
      },
      httpApiUrl: process.env.REACT_APP_HTTP_API_URL,
    },

    production: {
      brokerUrl: process.env.REACT_APP_MQTT_BROKER_URL!,
      options: {
        keepalive: 120,
        reconnectPeriod: 10000,
        connectTimeout: 45000,
        clientId: `prod-${Math.random().toString(36).substr(2, 9)}`,
        username: process.env.REACT_APP_MQTT_USERNAME,
        password: process.env.REACT_APP_MQTT_PASSWORD,
        clean: false, // Persistent sessions in production
      },
      httpApiUrl: process.env.REACT_APP_HTTP_API_URL,
    },
  }

  return configs[env] || configs.development
}

export default getEnvironmentConfig
```

#### Error Monitoring and Logging

Implement comprehensive error monitoring:

```typescript
// utils/mqtt-monitoring.ts
interface MqttMetrics {
  connectionAttempts: number
  connectionFailures: number
  messagesPublished: number
  messagesReceived: number
  subscriptionCount: number
  lastError?: Error
  lastErrorTime?: Date
}

class MqttMonitor {
  private metrics: MqttMetrics = {
    connectionAttempts: 0,
    connectionFailures: 0,
    messagesPublished: 0,
    messagesReceived: 0,
    subscriptionCount: 0,
  }

  private errorReporter?: (error: Error, context: string) => void

  constructor(errorReporter?: (error: Error, context: string) => void) {
    this.errorReporter = errorReporter
  }

  recordConnectionAttempt(): void {
    this.metrics.connectionAttempts++
  }

  recordConnectionFailure(error: Error): void {
    this.metrics.connectionFailures++
    this.metrics.lastError = error
    this.metrics.lastErrorTime = new Date()

    this.errorReporter?.(error, 'mqtt-connection')

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('MQTT Connection Failed:', error)
    }
  }

  recordMessagePublished(): void {
    this.metrics.messagesPublished++
  }

  recordMessageReceived(): void {
    this.metrics.messagesReceived++
  }

  recordSubscription(): void {
    this.metrics.subscriptionCount++
  }

  recordUnsubscription(): void {
    this.metrics.subscriptionCount = Math.max(0, this.metrics.subscriptionCount - 1)
  }

  getMetrics(): MqttMetrics {
    return { ...this.metrics }
  }

  getHealthStatus(): 'healthy' | 'degraded' | 'unhealthy' {
    const { connectionAttempts, connectionFailures, lastErrorTime } = this.metrics

    // Unhealthy if recent failures
    if (lastErrorTime && Date.now() - lastErrorTime.getTime() < 60000) {
      return 'unhealthy'
    }

    // Degraded if high failure rate
    const failureRate = connectionFailures / Math.max(connectionAttempts, 1)
    if (failureRate > 0.1) {
      return 'degraded'
    }

    return 'healthy'
  }
}

// Usage with error reporting service (e.g., Sentry)
const monitor = new MqttMonitor((error, context) => {
  // Report to your error monitoring service
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureException(error, {
      tags: { component: 'mqtt-topping-react', context },
    })
  }
})

export default monitor
```

#### Performance Monitoring

Monitor performance metrics in production:

```typescript
// utils/performance-monitor.ts
interface PerformanceMetrics {
  queryResponseTimes: number[]
  subscriptionLatency: number[]
  memoryUsage: number[]
  renderCount: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    queryResponseTimes: [],
    subscriptionLatency: [],
    memoryUsage: [],
    renderCount: 0,
  }

  private maxSamples = 100

  recordQueryTime(startTime: number): void {
    const responseTime = performance.now() - startTime
    this.metrics.queryResponseTimes.push(responseTime)

    if (this.metrics.queryResponseTimes.length > this.maxSamples) {
      this.metrics.queryResponseTimes.shift()
    }
  }

  recordSubscriptionLatency(publishTime: number): void {
    const latency = Date.now() - publishTime
    this.metrics.subscriptionLatency.push(latency)

    if (this.metrics.subscriptionLatency.length > this.maxSamples) {
      this.metrics.subscriptionLatency.shift()
    }
  }

  recordRender(): void {
    this.metrics.renderCount++
  }

  recordMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage.push(memory.usedJSHeapSize)

      if (this.metrics.memoryUsage.length > this.maxSamples) {
        this.metrics.memoryUsage.shift()
      }
    }
  }

  getAverageQueryTime(): number {
    const times = this.metrics.queryResponseTimes
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
  }

  getAverageLatency(): number {
    const latencies = this.metrics.subscriptionLatency
    return latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0
  }

  getMetrics(): PerformanceMetrics & {
    averageQueryTime: number
    averageLatency: number
  } {
    return {
      ...this.metrics,
      averageQueryTime: this.getAverageQueryTime(),
      averageLatency: this.getAverageLatency(),
    }
  }
}

// Hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const monitor = useRef(new PerformanceMonitor())

  useEffect(() => {
    const interval = setInterval(() => {
      monitor.current.recordMemoryUsage()
    }, 10000) // Record memory usage every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return monitor.current
}
```

#### Security Best Practices

Implement security measures for production deployments:

```typescript
// utils/security.ts
export const validateBrokerUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)

    // Only allow secure protocols in production
    if (process.env.NODE_ENV === 'production') {
      return parsed.protocol === 'wss:' || parsed.protocol === 'mqtts:'
    }

    // Allow insecure protocols in development
    return ['ws:', 'wss:', 'mqtt:', 'mqtts:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

export const sanitizeClientId = (clientId: string): string => {
  // Remove potentially dangerous characters
  return clientId.replace(/[^a-zA-Z0-9-_]/g, '').substring(0, 23)
}

export const validateTopicName = (topic: string): boolean => {
  // Basic topic validation
  if (!topic || topic.length === 0) return false
  if (topic.length > 65535) return false
  if (topic.includes('\0')) return false

  return true
}

// Secure connection setup
export const createSecureConnection = async (config: MqttConfig) => {
  if (!validateBrokerUrl(config.brokerUrl)) {
    throw new Error('Invalid broker URL')
  }

  const secureOptions = {
    ...config.options,
    clientId: sanitizeClientId(config.options.clientId || ''),

    // Security options
    rejectUnauthorized: process.env.NODE_ENV === 'production',

    // Connection limits
    keepalive: Math.min(config.options.keepalive, 300), // Max 5 minutes
    connectTimeout: Math.min(config.options.connectTimeout, 60000), // Max 1 minute

    // Protocol version
    protocolVersion: 4, // Use MQTT 3.1.1

    // Will message for connection monitoring
    will: {
      topic: `clients/${config.options.clientId}/status`,
      payload: 'offline',
      qos: 1,
      retain: true,
    },
  }

  return connectAsync(config.brokerUrl, secureOptions)
}
```

This comprehensive advanced patterns section provides production-ready solutions for connection management, performance optimization, memory management, testing, and deployment considerations. The examples demonstrate real-world patterns that developers can implement to build robust, scalable MQTT applications with React.

---

## 🌐 Broker Configuration

Comprehensive guide to connecting mqtt-topping-react with different MQTT brokers, connection types, and authentication methods. This section covers everything from basic WebSocket connections to production-ready secure configurations.

### WebSocket Connections

WebSocket connections are the most common way to connect to MQTT brokers from web browsers. They provide real-time bidirectional communication over HTTP/HTTPS.

#### Basic WebSocket Connection

```typescript
import { connectAsync } from '@artcom/mqtt-topping-react'

// Basic WebSocket connection
const connectToWebSocketBroker = async () => {
  try {
    const client = await connectAsync('ws://broker.hivemq.com:8000/mqtt', {
      clientId: `web-client-${Math.random().toString(36).substr(2, 9)}`,
      clean: true,
      keepalive: 60,
      reconnectPeriod: 1000,
    })

    console.log('Connected to WebSocket broker')
    return client
  } catch (error) {
    console.error('WebSocket connection failed:', error)
    throw error
  }
}
```

#### Secure WebSocket (WSS) Connection

```typescript
// Secure WebSocket connection with SSL/TLS
const connectToSecureWebSocketBroker = async () => {
  try {
    const client = await connectAsync('wss://secure-broker.example.com:8883/mqtt', {
      clientId: `secure-web-client-${Date.now()}`,
      clean: true,
      keepalive: 60,
      reconnectPeriod: 1000,

      // SSL/TLS options for secure connections
      rejectUnauthorized: true, // Verify server certificate

      // Connection timeout
      connectTimeout: 30000, // 30 seconds

      // Protocol version
      protocolVersion: 4, // MQTT 3.1.1
    })

    console.log('Connected to secure WebSocket broker')
    return client
  } catch (error) {
    console.error('Secure WebSocket connection failed:', error)
    throw error
  }
}
```

#### WebSocket with Custom Headers

```typescript
// WebSocket connection with custom headers (useful for proxy authentication)
const connectWithCustomHeaders = async () => {
  try {
    const client = await connectAsync('ws://proxy-broker.example.com:8000/mqtt', {
      clientId: 'web-client-with-headers',
      clean: true,
      keepalive: 60,

      // Custom WebSocket headers
      wsOptions: {
        headers: {
          Authorization: 'Bearer your-jwt-token',
          'X-Custom-Header': 'custom-value',
          'User-Agent': 'mqtt-topping-react/3.0.0',
        },
      },
    })

    return client
  } catch (error) {
    console.error('WebSocket connection with headers failed:', error)
    throw error
  }
}
```

### Secure Connections

Production applications require secure connections with proper authentication and encryption. Here are comprehensive examples for different security scenarios.

#### Certificate-Based Authentication

```typescript
import { connectAsync } from '@artcom/mqtt-topping-react'

// Client certificate authentication (Node.js environment)
const connectWithClientCertificate = async () => {
  try {
    const client = await connectAsync('mqtts://secure-broker.example.com:8883', {
      clientId: 'cert-authenticated-client',
      clean: true,
      keepalive: 60,

      // Certificate-based authentication
      key: process.env.MQTT_CLIENT_KEY, // Client private key
      cert: process.env.MQTT_CLIENT_CERT, // Client certificate
      ca: process.env.MQTT_CA_CERT, // Certificate Authority

      // SSL/TLS options
      rejectUnauthorized: true,
      secureProtocol: 'TLSv1_2_method',

      // Connection options
      connectTimeout: 30000,
      reconnectPeriod: 5000,
    })

    console.log('Connected with client certificate')
    return client
  } catch (error) {
    console.error('Certificate authentication failed:', error)
    throw error
  }
}
```

#### Username/Password Authentication

```typescript
// Username and password authentication
const connectWithCredentials = async () => {
  try {
    const client = await connectAsync('wss://authenticated-broker.example.com:8883/mqtt', {
      clientId: 'authenticated-client',
      clean: true,
      keepalive: 60,

      // Authentication credentials
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,

      // Connection options
      connectTimeout: 30000,
      reconnectPeriod: 1000,

      // Will message for connection monitoring
      will: {
        topic: `clients/${process.env.MQTT_USERNAME}/status`,
        payload: 'offline',
        qos: 1,
        retain: true,
      },
    })

    console.log('Connected with username/password')
    return client
  } catch (error) {
    console.error('Credential authentication failed:', error)
    throw error
  }
}
```

#### JWT Token Authentication

```typescript
// JWT token authentication (common with cloud MQTT services)
const connectWithJWTToken = async () => {
  try {
    // Generate or retrieve JWT token
    const jwtToken = await getJWTToken() // Your JWT generation logic

    const client = await connectAsync('wss://cloud-broker.example.com:443/mqtt', {
      clientId: 'jwt-authenticated-client',
      clean: true,
      keepalive: 60,

      // JWT authentication (typically as password)
      username: 'jwt',
      password: jwtToken,

      // Connection options
      connectTimeout: 30000,
      reconnectPeriod: 1000,
    })

    console.log('Connected with JWT token')
    return client
  } catch (error) {
    console.error('JWT authentication failed:', error)
    throw error
  }
}

// Helper function to get JWT token
const getJWTToken = async (): Promise<string> => {
  // Your JWT token generation/retrieval logic
  const response = await fetch('/api/mqtt-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: 'jwt-authenticated-client' }),
  })

  if (!response.ok) {
    throw new Error('Failed to get JWT token')
  }

  const { token } = await response.json()
  return token
}
```

### Authentication

Different MQTT brokers support various authentication methods. Here are examples for popular broker types and authentication patterns.

#### HiveMQ Cloud Authentication

```typescript
// HiveMQ Cloud connection with username/password
const connectToHiveMQCloud = async () => {
  try {
    const client = await connectAsync('wss://your-cluster.s1.eu.hivemq.cloud:8884/mqtt', {
      clientId: `hivemq-client-${Date.now()}`,
      clean: true,
      keepalive: 60,

      // HiveMQ Cloud credentials
      username: process.env.HIVEMQ_USERNAME,
      password: process.env.HIVEMQ_PASSWORD,

      // Connection options
      connectTimeout: 30000,
      reconnectPeriod: 1000,

      // Protocol version (HiveMQ supports MQTT 5.0)
      protocolVersion: 5,
    })

    console.log('Connected to HiveMQ Cloud')
    return client
  } catch (error) {
    console.error('HiveMQ Cloud connection failed:', error)
    throw error
  }
}
```

#### AWS IoT Core Authentication

```typescript
// AWS IoT Core connection with SigV4 authentication
const connectToAWSIoTCore = async () => {
  try {
    // AWS IoT Core requires WebSocket with SigV4 signing
    const client = await connectAsync('wss://your-endpoint.iot.region.amazonaws.com/mqtt', {
      clientId: 'aws-iot-client',
      clean: true,
      keepalive: 60,

      // AWS IoT Core specific options
      transformWsUrl: (url: string, options: any, client: any) => {
        // Custom URL transformation for AWS SigV4 signing
        return signAWSIoTUrl(url, {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          region: process.env.AWS_REGION!,
          service: 'iotdevicegateway',
        })
      },

      // Connection options
      connectTimeout: 30000,
      reconnectPeriod: 5000,
    })

    console.log('Connected to AWS IoT Core')
    return client
  } catch (error) {
    console.error('AWS IoT Core connection failed:', error)
    throw error
  }
}

// Helper function for AWS SigV4 URL signing
const signAWSIoTUrl = (url: string, credentials: any): string => {
  // Implementation of AWS SigV4 signing for WebSocket URLs
  // This is a simplified example - use aws-sdk or similar library in production
  const signedUrl = `${url}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${credentials.accessKeyId}...`
  return signedUrl
}
```

#### Mosquitto Broker Authentication

```typescript
// Mosquitto broker with ACL-based authentication
const connectToMosquitto = async () => {
  try {
    const client = await connectAsync('ws://mosquitto-broker.example.com:9001/mqtt', {
      clientId: 'mosquitto-client',
      clean: true,
      keepalive: 60,

      // Mosquitto authentication
      username: process.env.MOSQUITTO_USERNAME,
      password: process.env.MOSQUITTO_PASSWORD,

      // Connection options
      connectTimeout: 30000,
      reconnectPeriod: 1000,

      // Protocol version (Mosquitto supports MQTT 3.1.1 and 5.0)
      protocolVersion: 4,
    })

    console.log('Connected to Mosquitto broker')
    return client
  } catch (error) {
    console.error('Mosquitto connection failed:', error)
    throw error
  }
}
```

#### Custom Authentication Hook

```typescript
import { useState, useEffect, useCallback } from 'react'

// Custom hook for managing MQTT authentication
const useMqttAuthentication = () => {
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Authenticate with your backend
  const authenticate = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      setAuthError(null)

      const response = await fetch('/api/mqtt-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        throw new Error('Authentication failed')
      }

      const { token } = await response.json()
      setAuthToken(token)
      setIsAuthenticated(true)

      return token
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      setAuthError(errorMessage)
      setIsAuthenticated(false)
      throw error
    }
  }, [])

  // Refresh token before expiration
  const refreshToken = useCallback(async () => {
    if (!authToken) return null

    try {
      const response = await fetch('/api/mqtt-refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const { token } = await response.json()
      setAuthToken(token)
      return token
    } catch (error) {
      setAuthError('Token refresh failed')
      setIsAuthenticated(false)
      return null
    }
  }, [authToken])

  // Auto-refresh token
  useEffect(() => {
    if (!authToken) return

    // Refresh token every 50 minutes (assuming 1-hour expiration)
    const interval = setInterval(refreshToken, 50 * 60 * 1000)
    return () => clearInterval(interval)
  }, [authToken, refreshToken])

  return {
    authToken,
    isAuthenticated,
    authError,
    authenticate,
    refreshToken
  }
}

// Usage example
const AuthenticatedMqttConnection: React.FC = () => {
  const { authToken, isAuthenticated, authError, authenticate } = useMqttAuthentication()
  const [client, setClient] = useState<any>(null)

  const connectWithAuth = useCallback(async () => {
    if (!authToken) return

    try {
      const mqttClient = await connectAsync('wss://secure-broker.example.com:8883/mqtt', {
        clientId: 'authenticated-client',
        username: 'token',
        password: authToken,
        clean: true,
        keepalive: 60,
      })

      setClient(mqttClient)
    } catch (error) {
      console.error('MQTT connection failed:', error)
    }
  }, [authToken])

  useEffect(() => {
    if (isAuthenticated && authToken) {
      connectWithAuth()
    }
  }, [isAuthenticated, authToken, connectWithAuth])

  if (authError) {
    return <div>Authentication Error: {authError}</div>
  }

  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={() => authenticate({ username: 'user', password: 'pass' })}>
          Authenticate
        </button>
      </div>
    )
  }

  return <div>Connected and authenticated!</div>
}
```

### Environment Configuration

Configure MQTT connections for different environments (development, staging, production) with proper error handling and retry strategies.

#### Environment-Specific Configuration

```typescript
// Environment configuration interface
interface MqttEnvironmentConfig {
  brokerUrl: string
  username?: string
  password?: string
  clientIdPrefix: string
  keepalive: number
  reconnectPeriod: number
  connectTimeout: number
  maxReconnectAttempts: number
  qosLevel: 0 | 1 | 2
  retainMessages: boolean
}

// Environment configurations
const mqttConfigs: Record<string, MqttEnvironmentConfig> = {
  development: {
    brokerUrl: 'ws://localhost:9001/mqtt',
    clientIdPrefix: 'dev',
    keepalive: 60,
    reconnectPeriod: 1000,
    connectTimeout: 30000,
    maxReconnectAttempts: 5,
    qosLevel: 0,
    retainMessages: false,
  },

  staging: {
    brokerUrl: 'wss://staging-broker.example.com:8883/mqtt',
    username: process.env.MQTT_STAGING_USERNAME,
    password: process.env.MQTT_STAGING_PASSWORD,
    clientIdPrefix: 'staging',
    keepalive: 60,
    reconnectPeriod: 2000,
    connectTimeout: 30000,
    maxReconnectAttempts: 10,
    qosLevel: 1,
    retainMessages: true,
  },

  production: {
    brokerUrl: 'wss://prod-broker.example.com:8883/mqtt',
    username: process.env.MQTT_PROD_USERNAME,
    password: process.env.MQTT_PROD_PASSWORD,
    clientIdPrefix: 'prod',
    keepalive: 300, // Longer keepalive for production
    reconnectPeriod: 5000,
    connectTimeout: 60000,
    maxReconnectAttempts: -1, // Infinite retries in production
    qosLevel: 1,
    retainMessages: true,
  },
}

// Get current environment configuration
const getCurrentConfig = (): MqttEnvironmentConfig => {
  const env = process.env.NODE_ENV || 'development'
  return mqttConfigs[env] || mqttConfigs.development
}
```

#### Connection with Retry Logic

```typescript
import { connectAsync } from '@artcom/mqtt-topping-react'

// Enhanced connection function with retry logic
const connectWithRetry = async (
  config: MqttEnvironmentConfig,
  maxAttempts: number = 3
): Promise<any> => {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`MQTT connection attempt ${attempt}/${maxAttempts}`)

      const client = await connectAsync(config.brokerUrl, {
        clientId: `${config.clientIdPrefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        username: config.username,
        password: config.password,
        clean: true,
        keepalive: config.keepalive,
        reconnectPeriod: config.reconnectPeriod,
        connectTimeout: config.connectTimeout,

        // Will message for connection monitoring
        will: {
          topic: `clients/${config.clientIdPrefix}/status`,
          payload: JSON.stringify({
            status: 'offline',
            timestamp: new Date().toISOString(),
            clientId: `${config.clientIdPrefix}-${Date.now()}`,
          }),
          qos: config.qosLevel,
          retain: config.retainMessages,
        },
      })

      console.log('MQTT connection successful')

      // Set up connection event handlers
      client.on('connect', () => {
        console.log('MQTT client connected')
      })

      client.on('reconnect', () => {
        console.log('MQTT client reconnecting...')
      })

      client.on('close', () => {
        console.log('MQTT client connection closed')
      })

      client.on('error', (error: Error) => {
        console.error('MQTT client error:', error)
      })

      return client
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown connection error')
      console.error(`MQTT connection attempt ${attempt} failed:`, lastError.message)

      if (attempt < maxAttempts) {
        // Exponential backoff delay
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
        console.log(`Retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw new Error(
    `Failed to connect after ${maxAttempts} attempts. Last error: ${lastError?.message}`
  )
}
```

#### React Hook for Environment-Aware Connection

```typescript
import { useCallback, useEffect, useState } from 'react'

// Hook for environment-aware MQTT connection
const useEnvironmentMqttConnection = () => {
  const [client, setClient] = useState<any>(null)
  const [connectionState, setConnectionState] = useState<
    'disconnected' | 'connecting' | 'connected' | 'error'
  >('disconnected')
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const connect = useCallback(async () => {
    const config = getCurrentConfig()

    try {
      setConnectionState('connecting')
      setError(null)

      const mqttClient = await connectWithRetry(
        config,
        config.maxReconnectAttempts > 0 ? config.maxReconnectAttempts : 3
      )

      setClient(mqttClient)
      setConnectionState('connected')
      setRetryCount(0)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed'
      setError(errorMessage)
      setConnectionState('error')
      setRetryCount((prev) => prev + 1)
    }
  }, [])

  const disconnect = useCallback(async () => {
    if (client) {
      try {
        await client.endAsync()
        setClient(null)
        setConnectionState('disconnected')
      } catch (error) {
        console.error('Error disconnecting MQTT client:', error)
      }
    }
  }, [client])

  // Auto-connect on mount
  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  // Auto-retry on error (with exponential backoff)
  useEffect(() => {
    if (connectionState === 'error' && retryCount < 5) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 30000)
      const timer = setTimeout(connect, delay)
      return () => clearTimeout(timer)
    }
  }, [connectionState, retryCount, connect])

  return {
    client,
    connectionState,
    error,
    retryCount,
    connect,
    disconnect,
  }
}
```

#### Production-Ready Connection Component

```typescript
import React from 'react'
import { MqttProvider, createHttpClient } from '@artcom/mqtt-topping-react'

// Production-ready MQTT connection wrapper
const ProductionMqttProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { client, connectionState, error, retryCount } = useEnvironmentMqttConnection()
  const [httpClient] = useState(() => {
    const config = getCurrentConfig()
    // Create HTTP client for retained message queries
    return createHttpClient(config.brokerUrl.replace(/^wss?/, 'http').replace('/mqtt', ''))
  })

  // Show connection status
  if (connectionState === 'connecting') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🔌 Connecting to MQTT broker...</h2>
        <p>Environment: {process.env.NODE_ENV}</p>
        {retryCount > 0 && <p>Retry attempt: {retryCount}</p>}
      </div>
    )
  }

  if (connectionState === 'error') {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>❌ MQTT Connection Failed</h2>
        <p>Environment: {process.env.NODE_ENV}</p>
        <p>Error: {error}</p>
        <p>Retry attempts: {retryCount}</p>
        <p>Retrying automatically...</p>
      </div>
    )
  }

  if (!client) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>⚠️ MQTT client not available</h2>
      </div>
    )
  }

  return (
    <MqttProvider mqttClient={client} httpClient={httpClient}>
      {children}
    </MqttProvider>
  )
}

// Usage in your app
const App: React.FC = () => {
  return (
    <ProductionMqttProvider>
      <YourAppComponents />
    </ProductionMqttProvider>
  )
}
```

#### Environment Variables Configuration

Create a `.env` file for each environment:

```bash
# .env.development
NODE_ENV=development
MQTT_BROKER_URL=ws://localhost:9001/mqtt
MQTT_USERNAME=dev_user
MQTT_PASSWORD=dev_password

# .env.staging
NODE_ENV=staging
MQTT_BROKER_URL=wss://staging-broker.example.com:8883/mqtt
MQTT_USERNAME=staging_user
MQTT_PASSWORD=staging_password

# .env.production
NODE_ENV=production
MQTT_BROKER_URL=wss://prod-broker.example.com:8883/mqtt
MQTT_USERNAME=prod_user
MQTT_PASSWORD=prod_password
```

#### Docker Configuration

```dockerfile
# Dockerfile for different environments
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Build for specific environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Environment-specific MQTT configuration
ARG MQTT_BROKER_URL
ARG MQTT_USERNAME
ARG MQTT_PASSWORD

ENV MQTT_BROKER_URL=${MQTT_BROKER_URL}
ENV MQTT_USERNAME=${MQTT_USERNAME}
ENV MQTT_PASSWORD=${MQTT_PASSWORD}

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml for different environments
version: '3.8'

services:
  app-dev:
    build:
      context: .
      args:
        NODE_ENV: development
        MQTT_BROKER_URL: ws://mosquitto:9001/mqtt
        MQTT_USERNAME: dev_user
        MQTT_PASSWORD: dev_password
    environment:
      - NODE_ENV=development
    depends_on:
      - mosquitto

  app-prod:
    build:
      context: .
      args:
        NODE_ENV: production
        MQTT_BROKER_URL: wss://prod-broker.example.com:8883/mqtt
        MQTT_USERNAME: ${PROD_MQTT_USERNAME}
        MQTT_PASSWORD: ${PROD_MQTT_PASSWORD}
    environment:
      - NODE_ENV=production

  mosquitto:
    image: eclipse-mosquitto:2
    ports:
      - '1883:1883'
      - '9001:9001'
    volumes:
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf
```

This comprehensive broker configuration section provides developers with everything they need to connect mqtt-topping-react to various MQTT brokers in different environments, with proper authentication, security, and error handling patterns.

---

## 🚨 Error Handling & Troubleshooting Guide

This comprehensive guide covers all error types, debugging techniques, and solutions for common issues you might encounter when using mqtt-topping-react.

### 📋 Error Types Reference

#### Connection Errors

##### MQTT Connection Failed

```typescript
// Error: Connection refused: Not authorized
// Error: Connection refused: Bad username or password
// Error: Connection timeout
```

**Common Causes:**

- Incorrect broker URL or port
- Authentication credentials invalid
- Network connectivity issues
- Firewall blocking connection
- Broker not running or misconfigured

**Solutions:**

```typescript
// 1. Verify connection parameters
const connectWithValidation = async () => {
  try {
    const mqttClient = await connectAsync('ws://broker.hivemq.com:8000/mqtt', {
      clientId: `client-${Date.now()}`, // Unique client ID
      username: 'your-username',
      password: 'your-password',
      connectTimeout: 10000, // 10 second timeout
      keepalive: 60,
      clean: true,
      reconnectPeriod: 1000,
    })

    console.log('✅ MQTT connection successful')
    return mqttClient
  } catch (error) {
    console.error('❌ MQTT connection failed:', error)

    // Detailed error analysis
    if (error.message.includes('Not authorized')) {
      console.error('🔐 Check username/password credentials')
    } else if (error.message.includes('timeout')) {
      console.error('⏱️ Connection timeout - check network/firewall')
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 DNS resolution failed - check broker URL')
    }

    throw error
  }
}

// 2. Connection health monitoring
const monitorConnection = (mqttClient: MqttClient) => {
  mqttClient.on('connect', () => {
    console.log('🟢 MQTT connected')
  })

  mqttClient.on('disconnect', () => {
    console.log('🔴 MQTT disconnected')
  })

  mqttClient.on('error', (error) => {
    console.error('❌ MQTT error:', error)
  })

  mqttClient.on('reconnect', () => {
    console.log('🔄 MQTT reconnecting...')
  })
}
```

##### HTTP Client Connection Failed

```typescript
// Error: HTTP query failed for topic "sensors/temp": Network request failed
// Error: HttpClient not available for query
```

**Solutions:**

```typescript
// 1. Verify HTTP client setup
const setupHttpClient = () => {
  try {
    const httpClient = createHttpClient('http://your-api-server.com', {
      timeout: 5000,
      headers: {
        Authorization: 'Bearer your-token',
        'Content-Type': 'application/json',
      },
    })

    console.log('✅ HTTP client created successfully')
    return httpClient
  } catch (error) {
    console.error('❌ HTTP client setup failed:', error)
    throw error
  }
}

// 2. Test HTTP client connectivity
const testHttpClient = async (httpClient: HttpClient) => {
  try {
    const result = await httpClient.query({ topic: 'test/connectivity' })
    console.log('✅ HTTP client connectivity test passed')
    return result
  } catch (error) {
    console.error('❌ HTTP client connectivity test failed:', error)

    if (error.message.includes('CORS')) {
      console.error('🌐 CORS issue - check server CORS configuration')
    } else if (error.message.includes('timeout')) {
      console.error('⏱️ Request timeout - check server response time')
    } else if (error.message.includes('404')) {
      console.error('🔍 Endpoint not found - verify API URL')
    }

    throw error
  }
}
```

#### Query Errors

##### Topic Not Found

```typescript
// Error: HTTP query failed for topic "nonexistent/topic": Topic not found
```

**Debugging Steps:**

```typescript
// 1. Topic existence checker
const debugTopicAvailability = async (httpClient: HttpClient, topic: string) => {
  console.log(`🔍 Debugging topic: ${topic}`)

  try {
    // Try exact topic
    const result = await httpClient.query({ topic, depth: 0 })
    console.log('✅ Topic found:', result)
    return result
  } catch (error) {
    console.log('❌ Exact topic not found, trying wildcard search...')

    // Try parent topics with wildcards
    const topicParts = topic.split('/')
    for (let i = topicParts.length - 1; i >= 0; i--) {
      const wildcardTopic = [...topicParts.slice(0, i), '+'].join('/')
      try {
        const wildcardResult = await httpClient.query({ topic: wildcardTopic, depth: 1 })
        console.log(`✅ Found related topics under: ${wildcardTopic}`, wildcardResult)
        return wildcardResult
      } catch (wildcardError) {
        console.log(`❌ No topics found under: ${wildcardTopic}`)
      }
    }

    console.error('❌ No related topics found')
    throw new Error(`Topic ${topic} and related topics not found`)
  }
}

// Usage
const MyComponent = () => {
  const { data, error } = useQuery({
    topic: 'sensors/temperature',
    onError: (error) => {
      if (error.message.includes('Topic not found')) {
        debugTopicAvailability(httpClient, 'sensors/temperature')
      }
    },
  })

  // ... component logic
}
```

##### JSON Parse Errors

```typescript
// Error: Failed to parse JSON payload
// Error: Unexpected token in JSON
```

**Solutions:**

```typescript
// 1. Safe JSON parsing with fallback
const SafeJsonComponent: React.FC = () => {
  const { data, error } = useQuery({
    topic: 'sensors/data',
    parseJson: false, // Disable automatic parsing
    select: (rawData) => {
      try {
        // Custom parsing with validation
        if (typeof rawData === 'string') {
          return JSON.parse(rawData)
        }
        return rawData
      } catch (parseError) {
        console.warn('JSON parse failed, returning raw data:', parseError)
        return { raw: rawData, parseError: parseError.message }
      }
    }
  })

  if (error) {
    return <div>Query error: {error.message}</div>
  }

  return (
    <div>
      {data?.parseError ? (
        <div>
          <p>⚠️ Raw data (JSON parse failed): {data.raw}</p>
          <p>Parse error: {data.parseError}</p>
        </div>
      ) : (
        <p>✅ Parsed data: {JSON.stringify(data)}</p>
      )}
    </div>
  )
}

// 2. Data validation with schema
import { z } from 'zod'

const SensorDataSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  timestamp: z.string()
})

const ValidatedSensorComponent: React.FC = () => {
  const { data, error } = useQuery({
    topic: 'sensors/validated',
    parseJson: true,
    select: (rawData) => {
      try {
        const validated = SensorDataSchema.parse(rawData)
        return { data: validated, isValid: true }
      } catch (validationError) {
        console.error('Data validation failed:', validationError)
        return {
          data: rawData,
          isValid: false,
          validationError: validationError.message
        }
      }
    }
  })

  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.isValid ? (
        <div>
          <p>Temperature: {data.data.temperature}°C</p>
          <p>Humidity: {data.data.humidity}%</p>
        </div>
      ) : (
        <div>
          <p>⚠️ Invalid data format</p>
          <p>Error: {data?.validationError}</p>
          <p>Raw data: {JSON.stringify(data?.data)}</p>
        </div>
      )}
    </div>
  )
}
```

#### Subscription Errors

##### Callback Not Persisting

```typescript
// Problem: Subscription callback changes on every render
const ProblematicComponent = () => {
  const [count, setCount] = useState(0)

  // ❌ This creates a new callback on every render
  useMqttSubscribe('sensors/data', (payload) => {
    console.log('Count:', count) // Always logs 0
    setCount(count + 1)
  })

  return <div>Count: {count}</div>
}

// ✅ Solution: Use useCallback
const FixedComponent = () => {
  const [count, setCount] = useState(0)

  const handleMessage = useCallback((payload) => {
    console.log('Received:', payload)
    setCount(prev => prev + 1) // Use functional update
  }, []) // Empty dependency array

  useMqttSubscribe('sensors/data', handleMessage)

  return <div>Count: {count}</div>
}
```

##### Subscription Memory Leaks

```typescript
// Problem: Subscriptions not cleaning up properly
const LeakyComponent = () => {
  const [isActive, setIsActive] = useState(true)

  // ❌ Subscription continues even when component unmounts
  useMqttSubscribe('sensors/data', (payload) => {
    if (isActive) {
      console.log('Processing:', payload)
    }
  })

  return <div>Active: {isActive}</div>
}

// ✅ Solution: Use enabled parameter and proper cleanup
const CleanComponent = () => {
  const [isActive, setIsActive] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  const handleMessage = useCallback((payload) => {
    console.log('Processing:', payload)
  }, [])

  useMqttSubscribe('sensors/data', handleMessage, {
    enabled: isActive && isVisible, // Conditional subscription
    qos: 1
  })

  useEffect(() => {
    return () => {
      // Component cleanup
      console.log('Component unmounting, subscriptions will be cleaned up')
    }
  }, [])

  return (
    <div>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Deactivate' : 'Activate'}
      </button>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}
```

#### Publishing Errors

##### Publish Without Connection

```typescript
// Error: Cannot publish - MQTT client not connected
```

**Solution:**

```typescript
const RobustPublisher: React.FC = () => {
  const { publish, mqttClient } = useMqttContext()
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const safePublish = async (topic: string, payload: unknown) => {
    setPublishStatus('publishing')
    setError(null)

    try {
      // Check connection status
      if (!mqttClient?.connected) {
        throw new Error('MQTT client not connected')
      }

      if (!publish) {
        throw new Error('Publish function not available')
      }

      await publish(topic, payload, { qos: 1 })
      setPublishStatus('success')

      // Auto-reset status after 3 seconds
      setTimeout(() => setPublishStatus('idle'), 3000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(errorMessage)
      setPublishStatus('error')

      console.error('Publish failed:', {
        topic,
        payload,
        error: errorMessage,
        clientConnected: mqttClient?.connected,
        timestamp: new Date().toISOString()
      })
    }
  }

  return (
    <div>
      <button
        onClick={() => safePublish('test/topic', { message: 'Hello' })}
        disabled={publishStatus === 'publishing'}
      >
        {publishStatus === 'publishing' ? '⏳ Publishing...' : '📤 Publish Message'}
      </button>

      {publishStatus === 'success' && (
        <div style={{ color: 'green' }}>✅ Published successfully</div>
      )}

      {publishStatus === 'error' && error && (
        <div style={{ color: 'red' }}>❌ Publish failed: {error}</div>
      )}

      <div>
        Connection Status: {mqttClient?.connected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
    </div>
  )
}
```

### 🔧 Debugging Techniques

#### Enable Debug Logging

```typescript
// 1. MQTT.js debug logging
import { connectAsync } from '@artcom/mqtt-topping-react'

const mqttClient = await connectAsync('ws://broker.hivemq.com:8000/mqtt', {
  clientId: 'debug-client',
  // Enable MQTT.js debug logging
  log: console.log,
  // Additional debug options
  properties: {
    sessionExpiryInterval: 300,
    receiveMaximum: 100,
    maximumPacketSize: 1024 * 1024,
    topicAliasMaximum: 10,
    requestResponseInformation: true,
    requestProblemInformation: true,
  },
})

// 2. Custom debug wrapper
const createDebugMqttClient = async (brokerUrl: string, options = {}) => {
  console.log('🔌 Attempting MQTT connection:', { brokerUrl, options })

  try {
    const client = await connectAsync(brokerUrl, {
      ...options,
      // Wrap all event handlers with logging
      onConnect: () => {
        console.log('✅ MQTT connected successfully')
        options.onConnect?.()
      },
      onDisconnect: () => {
        console.log('🔴 MQTT disconnected')
        options.onDisconnect?.()
      },
      onError: (error) => {
        console.error('❌ MQTT error:', error)
        options.onError?.(error)
      },
    })

    // Wrap publish method with logging
    const originalPublish = client.publish
    client.publish = async (topic, payload, options) => {
      console.log('📤 Publishing:', { topic, payload, options })
      try {
        const result = await originalPublish.call(client, topic, payload, options)
        console.log('✅ Publish successful:', { topic })
        return result
      } catch (error) {
        console.error('❌ Publish failed:', { topic, error })
        throw error
      }
    }

    return client
  } catch (error) {
    console.error('❌ MQTT connection failed:', error)
    throw error
  }
}
```

#### Network Debugging

```typescript
// Network connectivity checker
const debugNetworkConnectivity = async () => {
  const tests = [
    {
      name: 'DNS Resolution',
      test: () => fetch('https://8.8.8.8', { mode: 'no-cors' }),
    },
    {
      name: 'HTTP Connectivity',
      test: () => fetch('https://httpbin.org/get'),
    },
    {
      name: 'WebSocket Support',
      test: () =>
        new Promise((resolve, reject) => {
          const ws = new WebSocket('wss://echo.websocket.org')
          ws.onopen = () => {
            ws.close()
            resolve('WebSocket supported')
          }
          ws.onerror = reject
          setTimeout(() => reject(new Error('WebSocket timeout')), 5000)
        }),
    },
  ]

  console.log('🔍 Running network connectivity tests...')

  for (const { name, test } of tests) {
    try {
      await test()
      console.log(`✅ ${name}: OK`)
    } catch (error) {
      console.error(`❌ ${name}: Failed`, error)
    }
  }
}

// MQTT broker connectivity test
const testMqttBrokerConnectivity = async (brokerUrl: string) => {
  console.log(`🔍 Testing MQTT broker connectivity: ${brokerUrl}`)

  try {
    // Parse broker URL
    const url = new URL(brokerUrl)
    console.log('📋 Broker details:', {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
    })

    // Test basic connectivity
    if (url.protocol === 'ws:' || url.protocol === 'wss:') {
      const ws = new WebSocket(brokerUrl)

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          ws.close()
          reject(new Error('Connection timeout'))
        }, 10000)

        ws.onopen = () => {
          clearTimeout(timeout)
          ws.close()
          console.log('✅ WebSocket connection successful')
          resolve('Connected')
        }

        ws.onerror = (error) => {
          clearTimeout(timeout)
          console.error('❌ WebSocket connection failed:', error)
          reject(error)
        }
      })
    }
  } catch (error) {
    console.error('❌ Broker connectivity test failed:', error)
    throw error
  }
}
```

#### Performance Debugging

```typescript
// Query performance monitor
const useQueryWithPerformanceMonitoring = (queryConfig) => {
  const startTime = useRef(Date.now())
  const [performanceMetrics, setPerformanceMetrics] = useState({
    queryTime: 0,
    renderCount: 0,
    lastUpdate: null,
  })

  const query = useQuery({
    ...queryConfig,
    onSuccess: (data) => {
      const queryTime = Date.now() - startTime.current
      setPerformanceMetrics((prev) => ({
        queryTime,
        renderCount: prev.renderCount + 1,
        lastUpdate: new Date().toISOString(),
      }))

      console.log('📊 Query performance:', {
        topic: queryConfig.topic,
        queryTime: `${queryTime}ms`,
        dataSize: JSON.stringify(data).length,
        renderCount: performanceMetrics.renderCount + 1,
      })

      queryConfig.onSuccess?.(data)
    },
  })

  useEffect(() => {
    startTime.current = Date.now()
  }, [queryConfig.topic])

  return { ...query, performanceMetrics }
}

// Memory usage monitor
const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState(null)

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo({
          usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
        })
      }
    }

    updateMemoryInfo()
    const interval = setInterval(updateMemoryInfo, 5000)

    return () => clearInterval(interval)
  }, [])

  return memoryInfo
}
```

### 🔄 Troubleshooting Flowchart

```
🚨 MQTT Issue Detected
         |
         v
    Connection Issue?
    /              \
  YES               NO
   |                |
   v                v
Check Network    Query Issue?
   |            /           \
   v          YES            NO
DNS OK?        |             |
/     \        v             v
YES   NO   Topic Exists?  Subscription Issue?
|     |    /         \    /              \
v     v   YES        NO   YES             NO
...   Fix DNS        |    |               |
      |              v    v               v
      v          Check Data  Check Callback  Check Publishing
  Test Broker    Format      Persistence     |
      |              |           |           v
      v              v           v       Check Client
  Check Auth     Parse JSON   Use useCallback  Connection
      |              |           |           |
      v              v           v           v
  Verify Creds   Validate Schema  Fix Deps   Verify Publish
                                              Function
```

### ❓ Frequently Asked Questions

#### Q: Why is my component re-rendering constantly?

**A:** This usually happens due to unstable callback references in subscriptions.

```typescript
// ❌ Problem: New callback on every render
const BadComponent = () => {
  const [data, setData] = useState([])

  useMqttSubscribe('sensors/+', (payload) => {
    setData(prev => [...prev, payload]) // New callback every render
  })

  return <div>{data.length} messages</div>
}

// ✅ Solution: Stable callback with useCallback
const GoodComponent = () => {
  const [data, setData] = useState([])

  const handleMessage = useCallback((payload) => {
    setData(prev => [...prev, payload])
  }, [])

  useMqttSubscribe('sensors/+', handleMessage)

  return <div>{data.length} messages</div>
}
```

#### Q: My queries are not updating with new data

**A:** Check your TanStack Query cache configuration:

```typescript
// Problem: Data cached too long
const { data } = useQuery({
  topic: 'sensors/temp',
  staleTime: Infinity, // ❌ Never refetches
})

// Solution: Appropriate cache settings
const { data } = useQuery({
  topic: 'sensors/temp',
  staleTime: 30000, // ✅ 30 seconds
  refetchInterval: 60000, // ✅ Refetch every minute
})
```

#### Q: WebSocket connection fails in production

**A:** Common production issues and solutions:

```typescript
// 1. Check protocol (ws vs wss)
const brokerUrl =
  process.env.NODE_ENV === 'production'
    ? 'wss://your-broker.com:8084/mqtt' // ✅ Secure WebSocket
    : 'ws://localhost:8000/mqtt' // ✅ Local development

// 2. Handle proxy/load balancer issues
const mqttClient = await connectAsync(brokerUrl, {
  // Increase timeouts for production
  connectTimeout: 30000,
  keepalive: 30,
  // Handle connection drops
  reconnectPeriod: 5000,
  // Unique client IDs
  clientId: `prod-client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
})
```

#### Q: High memory usage with many subscriptions

**A:** Optimize subscription management:

```typescript
// ❌ Problem: Too many individual subscriptions
const ManySubscriptions = () => {
  useMqttSubscribe('sensors/1/temp', handler1)
  useMqttSubscribe('sensors/2/temp', handler2)
  useMqttSubscribe('sensors/3/temp', handler3)
  // ... 100 more subscriptions
}

// ✅ Solution: Use wildcard subscriptions
const OptimizedSubscriptions = () => {
  const handleSensorData = useCallback((payload, topic) => {
    const sensorId = topic.split('/')[1]
    // Route to appropriate handler based on sensor ID
    switch (sensorId) {
      case '1':
        return handler1(payload)
      case '2':
        return handler2(payload)
      case '3':
        return handler3(payload)
      default:
        console.log('Unknown sensor:', sensorId)
    }
  }, [])

  useMqttSubscribe('sensors/+/temp', handleSensorData)
}
```

#### Q: TypeScript errors with payload types

**A:** Proper TypeScript usage:

```typescript
// ❌ Problem: No type safety
const { data } = useQuery({ topic: 'sensors/temp' })
console.log(data.temperature) // TypeScript error

// ✅ Solution: Use generics
interface SensorData {
  temperature: number
  humidity: number
}

const { data } = useQuery<SensorData>({
  topic: 'sensors/temp',
  parseJson: true
})

console.log(data?.temperature) // ✅ Type safe
```

### 🔗 External Debugging Resources

#### MQTT Tools

- **[MQTT Explorer](http://mqtt-explorer.com/)** - Desktop MQTT client for debugging
- **[HiveMQ WebSocket Client](http://www.hivemq.com/demos/websocket-client/)** - Browser-based MQTT testing
- **[Mosquitto CLI Tools](https://mosquitto.org/download/)** - Command-line MQTT utilities

#### Network Debugging

- **[WebSocket King](https://websocketking.com/)** - WebSocket connection testing
- **[Postman](https://www.postman.com/)** - HTTP API testing
- **[Wireshark](https://www.wireshark.org/)** - Network packet analysis

#### Browser Developer Tools

- **Network Tab**: Monitor WebSocket connections and HTTP requests
- **Console**: Enable verbose logging with `localStorage.debug = '*'`
- **Performance Tab**: Profile React component rendering
- **Memory Tab**: Monitor memory usage and detect leaks

#### React Debugging

- **[React Developer Tools](https://react.dev/learn/react-developer-tools)** - Component inspection
- **[TanStack Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)** - Query debugging

```typescript
// Enable TanStack Query DevTools in development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const App = () => (
  <MqttProvider mqttClient={mqttClient} httpClient={httpClient}>
    <YourApp />
    {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
  </MqttProvider>
)
```

#### Logging and Monitoring

- **[LogRocket](https://logrocket.com/)** - Session replay and error tracking
- **[Sentry](https://sentry.io/)** - Error monitoring and performance tracking
- **[DataDog](https://www.datadoghq.com/)** - Application performance monitoring

### 🛠️ Debug Configuration Template

```typescript
// debug-config.ts - Comprehensive debugging setup
export const createDebugConfig = (environment: 'development' | 'production') => {
  const isDev = environment === 'development'

  return {
    mqtt: {
      brokerUrl: isDev ? 'ws://localhost:8000/mqtt' : 'wss://your-production-broker.com:8084/mqtt',
      options: {
        clientId: `debug-client-${Date.now()}`,
        keepalive: isDev ? 10 : 60,
        connectTimeout: isDev ? 5000 : 30000,
        reconnectPeriod: isDev ? 1000 : 5000,
        // Enable debug logging in development
        log: isDev ? console.log : undefined,
      },
    },

    http: {
      baseUrl: isDev ? 'http://localhost:3001' : 'https://your-api-server.com',
      timeout: isDev ? 2000 : 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(isDev && { 'X-Debug': 'true' }),
      },
    },

    query: {
      // More aggressive refetching in development
      staleTime: isDev ? 0 : 30000,
      refetchInterval: isDev ? 5000 : false,
      retry: isDev ? 1 : 3,
      // Enable query devtools in development
      devtools: isDev,
    },

    logging: {
      level: isDev ? 'debug' : 'error',
      enablePerformanceLogging: isDev,
      enableNetworkLogging: isDev,
    },
  }
}

// Usage
const debugConfig = createDebugConfig(process.env.NODE_ENV)
```

This comprehensive troubleshooting guide provides developers with everything they need to diagnose and resolve issues with mqtt-topping-react, from basic connection problems to advanced performance optimization.

---

## Development

Welcome to mqtt-topping-react development! This section provides comprehensive guidance for contributors, from setting up your development environment to submitting pull requests.

### 🛠️ Development Environment Setup

#### Prerequisites

Before you begin, ensure you have the following tools installed:

**Required:**

- **Node.js 18+** - We recommend using [nvm](https://github.com/nvm-sh/nvm) for version management
  ```bash
  # Install and use the correct Node.js version
  nvm install 18
  nvm use 18
  ```
- **npm 9+** - Comes with Node.js, or install separately
  ```bash
  npm install -g npm@latest
  ```
- **Git** - For version control
  ```bash
  git --version  # Verify installation
  ```

**Recommended:**

- **VS Code** - With our pre-configured workspace settings
- **GitHub CLI** - For easier pull request management
  ```bash
  gh --version  # Verify installation
  ```

#### Initial Setup

1. **Fork and Clone the Repository**

   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/your-username/mqtt-topping-react.git
   cd mqtt-topping-react

   # Add upstream remote for syncing
   git remote add upstream https://github.com/artcom/mqtt-topping-react.git
   ```

2. **Install Dependencies**

   ```bash
   # Install all project dependencies
   npm install

   # Verify installation
   npm list --depth=0
   ```

3. **Verify Setup**

   ```bash
   # Run tests to ensure everything works
   npm test

   # Build the project
   npm run build

   # Check types
   npm run type-check
   ```

#### Development Workflow

```bash
# 1. Create a new branch for your feature/fix
git checkout -b feature/your-feature-name

# 2. Start development mode (if available)
npm run dev

# 3. Run tests in watch mode while developing
npm run test -- --watch

# 4. Make your changes and test them
# ... make changes ...

# 5. Run quality checks
npm run lint
npm run type-check
npm test

# 6. Build and verify
npm run build

# 7. Commit your changes
git add .
git commit -m "feat: add your feature description"

# 8. Push and create pull request
git push origin feature/your-feature-name
```

### 📋 Available Scripts

Our package.json includes comprehensive scripts for development, testing, and building:

#### Build Commands

```bash
# Clean build artifacts
npm run clean

# Build TypeScript to JavaScript
npm run build

# Type check without emitting files
npm run type-check

# Full pre-publish build (clean + type-check + test + build)
npm run prepublishOnly
```

**Build Process:**

1. TypeScript compilation (`tsc`)
2. Path alias resolution (`tsc-alias`)
3. Output to `dist/` directory with both `.js` and `.d.ts` files

#### Testing Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (for development)
npm run test -- --watch

# Run tests with coverage report
npm run test:coverage

# Debug tests with Node.js inspector
npm run test:debug

# Run specific test file
npm test -- useQuery.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="should handle errors"
```

**Testing Stack:**

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for testing
- **MSW (Mock Service Worker)** - API mocking for HTTP tests

#### Code Quality Commands

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint -- --fix

# Format code with Prettier
npm run format

# Check formatting without fixing
npm run format -- --check
```

**Quality Tools Configuration:**

- **ESLint** - Configured with React, TypeScript, and TanStack Query rules
- **Prettier** - Consistent code formatting with import sorting
- **TypeScript** - Strict type checking enabled

### 🧪 Testing Requirements

We maintain high testing standards to ensure reliability and prevent regressions.

#### Coverage Requirements

- **Minimum Coverage**: 90% for statements, branches, functions, and lines
- **Critical Paths**: 100% coverage for core hooks and error handling
- **New Features**: Must include comprehensive tests before merging

#### Testing Guidelines

1. **Unit Tests**: Test individual functions and hooks in isolation

   ```typescript
   // Example: Testing a custom hook
   import { renderHook } from '@testing-library/react'

   import { useQuery } from '../src/useQuery'

   test('should handle loading state correctly', () => {
     const { result } = renderHook(() => useQuery({ topic: 'test/topic' }))
     expect(result.current.isLoading).toBe(true)
   })
   ```

2. **Integration Tests**: Test component interactions with MQTT context

   ```typescript
   // Example: Testing component with MQTT provider
   import { render, screen } from '@testing-library/react'
   import { MqttProvider } from '../src/MqttProvider'
   import { TestComponent } from './TestComponent'

   test('should publish message when button clicked', async () => {
     render(
       <MqttProvider mqttClient={mockMqttClient} httpClient={mockHttpClient}>
         <TestComponent />
       </MqttProvider>
     )
     // ... test implementation
   })
   ```

3. **Error Handling Tests**: Verify proper error handling and recovery
   ```typescript
   test('should handle connection errors gracefully', async () => {
     const mockClient = createMockClient({ shouldFail: true })
     // ... test error scenarios
   })
   ```

#### Test Organization

```
tests/
├── __mocks__/           # Mock implementations
├── helpers/             # Test utilities and helpers
├── integration/         # Integration tests
└── unit/               # Unit tests
    ├── hooks/          # Hook-specific tests
    ├── components/     # Component tests
    └── utils/          # Utility function tests
```

### 📏 Code Quality Standards

#### TypeScript Standards

- **Strict Mode**: All TypeScript strict checks enabled
- **No `any` Types**: Use proper typing or `unknown` with type guards
- **Generic Constraints**: Use proper generic constraints for reusable code
- **JSDoc Comments**: Document all public APIs

```typescript
// ✅ Good: Proper typing with generics
interface QueryOptions<T = unknown> {
  topic: string
  parseJson?: boolean
  select?: (data: unknown) => T
}

// ❌ Bad: Using any type
interface QueryOptions {
  topic: string
  data: any
}
```

#### React Standards

- **Functional Components**: Use function components with hooks
- **Proper Dependencies**: Correct dependency arrays for useEffect/useCallback
- **Error Boundaries**: Implement error boundaries for robust error handling
- **Accessibility**: Follow WCAG guidelines for accessible components

```typescript
// ✅ Good: Proper hook usage
const MyComponent: React.FC<Props> = ({ topic, enabled }) => {
  const { data, isLoading } = useQuery({
    topic,
    enabled, // Properly passed dependency
  })

  return <div>{isLoading ? 'Loading...' : data}</div>
}

// ❌ Bad: Missing dependencies
const MyComponent = ({ topic }) => {
  const [data, setData] = useState()

  useEffect(() => {
    fetchData(topic).then(setData)
  }, []) // Missing topic dependency
}
```

#### Performance Standards

- **Memoization**: Use React.memo, useMemo, useCallback appropriately
- **Bundle Size**: Monitor and minimize bundle size impact
- **Memory Leaks**: Proper cleanup in useEffect hooks
- **Re-render Optimization**: Minimize unnecessary re-renders

### 🔄 Pull Request Guidelines

#### Before Submitting

1. **Sync with Upstream**

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run Full Quality Check**

   ```bash
   npm run prepublishOnly  # Runs clean + type-check + test + build
   ```

3. **Update Documentation**
   - Update README if adding new features
   - Add JSDoc comments for new public APIs
   - Update CHANGELOG.md following [Conventional Commits](https://conventionalcommits.org/)

#### Pull Request Template

When creating a pull request, include:

**Description:**

- Clear description of what the PR does
- Link to related issues (e.g., "Fixes #123")
- Screenshots for UI changes

**Type of Change:**

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

**Testing:**

- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Coverage requirements met

**Checklist:**

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console.log statements left in code

#### Review Process

1. **Automated Checks**: All CI checks must pass
   - TypeScript compilation
   - ESLint and Prettier checks
   - Test suite with coverage
   - Build verification

2. **Code Review**: At least one maintainer review required
   - Code quality and style
   - Test coverage and quality
   - Documentation completeness
   - Performance impact

3. **Merge Requirements**:
   - All conversations resolved
   - CI checks passing
   - Approved by maintainer
   - Up-to-date with main branch

### 🐛 Issue Reporting Guidelines

#### Bug Reports

Use our [bug report template](https://github.com/artcom/mqtt-topping-react/issues/new?template=bug_report.md) and include:

**Required Information:**

- **Environment Details**:

  ```
  - mqtt-topping-react version: 3.0.0
  - React version: 19.0.0
  - TypeScript version: 5.8.3
  - Browser: Chrome 120.0.0
  - Node.js version: 18.17.0
  ```

- **Minimal Reproducible Example**:
  - CodeSandbox link preferred
  - Minimal code that demonstrates the issue
  - Steps to reproduce

- **Expected vs Actual Behavior**:
  - What you expected to happen
  - What actually happened
  - Error messages or console output

**Bug Report Template:**

```markdown
## Bug Description

Brief description of the bug

## Environment

- mqtt-topping-react version:
- React version:
- Browser:
- Node.js version:

## Steps to Reproduce

1. Step one
2. Step two
3. Step three

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Minimal Reproducible Example

[CodeSandbox link or code snippet]

## Additional Context

Any other relevant information
```

#### Feature Requests

Use our [feature request template](https://github.com/artcom/mqtt-topping-react/issues/new?template=feature_request.md):

**Required Information:**

- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: How should it work?
- **Use Case**: Real-world scenario where this would be useful
- **Alternative Solutions**: Other approaches considered
- **API Design**: Proposed API (if applicable)

**Feature Request Template:**

````markdown
## Problem Statement

Clear description of the problem this feature would solve

## Proposed Solution

Detailed description of the proposed feature

## Use Case

Real-world scenario where this would be useful

## Proposed API

```typescript
// Example of how the API might look
const { data } = useNewFeature({ option: 'value' })
```
````

## Alternative Solutions

Other approaches considered and why they were rejected

## Additional Context

Any other relevant information

```

#### Issue Labels

We use labels to categorize and prioritize issues:

- **Type**: `bug`, `feature`, `documentation`, `question`
- **Priority**: `critical`, `high`, `medium`, `low`
- **Status**: `needs-triage`, `in-progress`, `blocked`, `ready-for-review`
- **Area**: `hooks`, `provider`, `types`, `testing`, `build`

### 🚀 Release Process

Our release process follows semantic versioning and conventional commits:

#### Version Types

- **Patch** (1.0.1): Bug fixes and small improvements
- **Minor** (1.1.0): New features that don't break existing APIs
- **Major** (2.0.0): Breaking changes

#### Release Workflow

1. **Development**: Features developed in feature branches
2. **Integration**: Merged to `main` branch after review
3. **Testing**: Comprehensive testing in CI/CD pipeline
4. **Release**: Automated release based on conventional commits
5. **Documentation**: Automatic documentation updates

#### Contributing to Releases

- Use [Conventional Commits](https://conventionalcommits.org/) format:
```

feat: add new useQueryBatch hook
fix: resolve memory leak in subscription cleanup
docs: update API documentation for useQuery
BREAKING CHANGE: remove deprecated status constants

````

- Breaking changes trigger major version bumps
- Features trigger minor version bumps
- Fixes trigger patch version bumps

---

## 🤝 Community & Support

### 📚 Resources

- **[📖 Full Documentation](https://github.com/artcom/mqtt-topping-react/wiki)** - Complete API reference and guides
- **[💡 Examples Repository](https://github.com/artcom/mqtt-topping-react-examples)** - Real-world usage examples and starter templates
- **[🎮 Interactive Playground](https://codesandbox.io/s/mqtt-topping-react-playground)** - Try the library online with live MQTT broker
- **[📺 Video Tutorials](https://www.youtube.com/playlist?list=PLxxx)** - Step-by-step video guides and walkthroughs
- **[📋 Cheat Sheet](https://github.com/artcom/mqtt-topping-react/blob/main/CHEAT_SHEET.md)** - Quick reference for common patterns
- **[🔧 Migration Tool](https://github.com/artcom/mqtt-topping-react/tree/main/tools/migrate)** - Automated migration from v2.x to v3.0

### 🆘 Getting Help

- **[💬 GitHub Discussions](https://github.com/artcom/mqtt-topping-react/discussions)** - Ask questions, share ideas, and get community support
- **[🐛 Issue Tracker](https://github.com/artcom/mqtt-topping-react/issues)** - Report bugs and request features
- **[💡 Stack Overflow](https://stackoverflow.com/questions/tagged/mqtt-topping-react)** - Community Q&A with `mqtt-topping-react` tag
- **[💬 Discord Community](https://discord.gg/mqtt-topping)** - Real-time chat with other developers
- **[📧 Email Support](mailto:mqtt-topping@artcom.de)** - Direct support for enterprise users

**Before asking for help:**

1. Check the [FAQ section](#-frequently-asked-questions) for common issues
2. Search existing [GitHub issues](https://github.com/artcom/mqtt-topping-react/issues) and [discussions](https://github.com/artcom/mqtt-topping-react/discussions)
3. Try the [troubleshooting guide](#-error-handling--troubleshooting-guide)
4. Provide a minimal reproducible example when reporting issues

### 🚀 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or sharing examples, your help makes mqtt-topping-react better for everyone.

**📖 For comprehensive development guidelines, see our [Development section](#development) which covers:**
- Complete development environment setup
- Available scripts and build commands
- Testing requirements and guidelines
- Code quality standards
- Pull request process
- Issue reporting guidelines

#### Quick Start for Contributors

```bash
# 1. Fork and clone the repository
git clone https://github.com/your-username/mqtt-topping-react.git
cd mqtt-topping-react

# 2. Install dependencies
npm install

# 3. Run tests to ensure everything works
npm test

# 4. Make your changes and test them
npm run lint && npm run type-check && npm test

# 5. Build and verify
npm run build
```

#### Ways to Contribute

- **🐛 Bug Reports**: Help us identify and fix issues
- **✨ Feature Requests**: Suggest new functionality
- **📝 Documentation**: Improve guides, examples, and API docs
- **🧪 Testing**: Add test cases and improve coverage
- **💡 Examples**: Share real-world usage patterns
- **🔧 Code**: Fix bugs and implement new features

#### Before Contributing

1. **Read the [Development Guidelines](#development)** - Comprehensive setup and standards
2. **Check Existing Issues** - Avoid duplicate work
3. **Start Small** - Begin with documentation or small bug fixes
4. **Ask Questions** - Use [GitHub Discussions](https://github.com/artcom/mqtt-topping-react/discussions) for guidance

### 📈 Roadmap

We're continuously improving mqtt-topping-react. Here's what's planned:

#### 🎯 Version 3.1 (Q2 2025)

- **React Server Components Support** - Enable server-side MQTT queries
- **Enhanced TypeScript Inference** - Better type inference for generic hooks
- **Performance Monitoring Tools** - Built-in performance metrics and debugging
- **WebRTC Transport Layer** - Direct peer-to-peer MQTT communication

#### 🔮 Version 3.2 (Q3 2025)

- **GraphQL Integration** - Query MQTT data using GraphQL syntax
- **Real-time Analytics** - Built-in analytics for MQTT message patterns
- **Advanced Caching Strategies** - Intelligent caching based on topic patterns
- **Mobile Optimization** - React Native compatibility and mobile-specific optimizations

#### 🚀 Future Considerations

- **Edge Computing Support** - Integration with edge MQTT brokers
- **AI/ML Integration** - Smart message filtering and pattern recognition
- **Multi-Protocol Support** - Support for AMQP, CoAP, and other IoT protocols
- **Visual Debugging Tools** - Browser extension for MQTT debugging

**Want to influence the roadmap?**

- 👍 Vote on [existing feature requests](https://github.com/artcom/mqtt-topping-react/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)
- 💡 [Propose new features](https://github.com/artcom/mqtt-topping-react/issues/new?template=feature_request.md)
- 🗣️ Join the discussion in [GitHub Discussions](https://github.com/artcom/mqtt-topping-react/discussions)

### 🙏 Acknowledgments

mqtt-topping-react is built with ❤️ by [ART+COM](https://artcom.de) and powered by these amazing technologies:

#### Core Dependencies

- **[TanStack Query](https://tanstack.com/query)** - Powerful data fetching and caching library
- **[MQTT.js](https://github.com/mqttjs/MQTT.js)** - Robust MQTT client implementation
- **[mqtt-topping](https://github.com/artcom/mqtt-topping)** - Core MQTT functionality and HTTP client
- **[React](https://react.dev/)** - The library that makes it all possible

#### Development Tools

- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and developer experience
- **[Jest](https://jestjs.io/)** - Testing framework
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** - Component testing utilities
- **[ESLint](https://eslint.org/)** - Code linting and quality
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks for quality assurance

#### Infrastructure & Tooling

- **[GitHub Actions](https://github.com/features/actions)** - Continuous integration and deployment
- **[CodeSandbox](https://codesandbox.io/)** - Online development environment for examples
- **[npm](https://www.npmjs.com/)** - Package distribution
- **[Semantic Release](https://semantic-release.gitbook.io/)** - Automated versioning and publishing

#### Community & Inspiration

- **[HiveMQ](https://www.hivemq.com/)** - MQTT broker and retained message query plugin
- **[Eclipse Mosquitto](https://mosquitto.org/)** - Open source MQTT broker
- **[MQTT.org](https://mqtt.org/)** - MQTT protocol specification and community
- **React Community** - For patterns, best practices, and inspiration

#### Special Thanks

- **Contributors** - Everyone who has contributed code, documentation, or feedback
- **Early Adopters** - Companies and developers who trusted us with their production applications
- **Open Source Community** - For the tools, libraries, and knowledge that make this project possible

---

**Built with 💙 in Berlin by [ART+COM](https://artcom.de)**

_ART+COM is a Berlin-based studio for digital art and technology, creating innovative digital experiences since 1988._
````
