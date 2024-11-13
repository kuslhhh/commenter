import { OutgoingMessages, supportMessage as OutgoingSupportedMessages } from "./messages/outgoingMessages";
import {server as WebSocketServer, connection} from "websocket"
import http from 'http';
import { UserManager } from "./userManager";
import { IncomingMessages, supportMessage } from "./messages/incomingMessages";

import { inMemoryStore } from "./store/inMemoryStore";

const server = http.createServer(function(request: any, response: any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server
const userManager = new UserManager();
const store = new inMemoryStore();

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

 const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
  return true;
}

wsServer.on('request', function(request) {
    console.log("inside connect");
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        console.log(message);
        // Todo add rate limitting logic here 
        if (message.type === 'utf8') {
            try {
                console.log("indie with message" + message.utf8Data)
                messageHandler(connection, JSON.parse(message.utf8Data));
            } catch(e) {

            }
        }
    });
});

function messageHandler(ws: connection, message: IncomingMessages) {
    if (message.type == supportMessage.joinRoom) {
        const payload = message.payload;
        userManager.addUser(payload.name, payload.userId, payload.roomId, ws);
    }

    if (message.type === supportMessage.sendMessage) {
        const payload = message.payload;
        const user = userManager.getUser(payload.roomId, payload.userId);
        if (!user) {
            console.error("User not found in the db");
            return;
        }
        let chat = store.addChat(payload.userId, user.name, payload.roomId, payload.message);
        if (!chat) {
            return;
        }

        const outgoingPayload: OutgoingMessages= {
            type: OutgoingSupportedMessages.addChat,
            payload: {
                chatId: chat.id,
                roomId: payload.roomId,
                message: payload.message,
                name: user.name,
                upvotes: 0
            }
        }
        userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
    }

    if (message.type === supportMessage.upvoteMessage) {
        const payload = message.payload;
        const chat = store.upvote(payload.userId, payload.roomId, payload.chatId);

        console.log("inside upvote 1")

        if (!chat) {
            return;
        }
        console.log("inside upvote 2")

        const outgoingPayload: OutgoingMessages= {
            type: OutgoingSupportedMessages.Updatechat,
            payload: {
                chatId: payload.chatId,
                roomId: payload.roomId,
                upvotes: chat.upvotes.length
            }
        }

        console.log("inside upvote 3")


        userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
    }
}