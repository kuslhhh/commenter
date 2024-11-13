# Commenter: Real time comments/QNA App

A lightweight WebSocket server implemented using the `websocket` package, designed for real-time communication.

## Overview

This project provides a simple WebSocket server using the `websocket` package. Data received from clients can be validated using `zod`.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/kuslhhh/commenter.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd commenter
   ```

3. **Install Dependencies**

   ```bash
   npm install websocket zod
   ```

## Dependencies

- **websocket**: A WebSocket protocol library for implementing real-time server-client communication.
- **@types/websocket**: TypeScript definitions for the `websocket` package.
- **zod**: A data validation library for handling structured data.

## Running the Server

To run the WebSocket server, use the following command:

```bash
node index.js
```

The server will be running on port `8080`.

## Testing with Hoppscotch

You can easily test your WebSocket server using [Hoppscotch](https://hoppscotch.io/):

1. **Open Hoppscotch**: Visit [https://hoppscotch.io/](https://hoppscotch.io/).
2. **Switch to WebSocket**: Click on the "WebSocket" tab at the top.
3. **Enter WebSocket URL**: Use `ws://localhost:8080` (or the URL of your server).
4. **Connect**: Click "Connect" to establish a connection.
5. **Send Messages**: Type a message and click "Send". You should see responses from your WebSocket server based on the data validation logic.

## Contribution

Feel happy to contribute! Open issues, suggest improvements, or fork the project and make your own changes.
