import { connection, server as WebSocketServer } from "websocket";
import http from "http";

const server = http.createServer((req, res) => {
    res.writeHead(404);
    res.end();
});

server.listen(8080, () => {
    console.log("Server is listening on port 8080");
});

const wsServer = new WebSocketServer({ httpServer: server, autoAcceptConnections: true });

wsServer.on("request", (request) => {
    const connection = request.accept("echo-protocol", request.origin);
    console.log("Connection accepted");

    connection.on("message", (message) => {
        if (message.type === "utf8") {
            console.log("Received message:", message.utf8Data);
        }
    });

    connection.on("close", () => {
        console.log("Connection closed");
    });
});
