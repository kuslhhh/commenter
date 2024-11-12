import { connection, Message, server as WebSocketServer } from "websocket"
import { IncomingMessages, InitMessageType, supportMessage, UpvoteMessageType } from "./messages/incomingMessages";
import { OutgoingMessages, supportMessage as OutgoingSupportMessages } from "./messages/outgoingMessages"
import http from "http";
import { UserManager } from "./userManager";
import { inMemoryStore } from "./store/inMemoryStore";

const server = http.createServer(function (request: any, response: any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

const userManager = new UserManager();
const store = new inMemoryStore();

server.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});


const wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function (message) {

        //adding rate limiting logic here
        if (message.type === 'utf8') {

            try {
                messageHandler(connection, JSON.parse(message.utf8Data));
            } catch (e) {

            }

            // console.log('Received Message: ' + message.utf8Data);
            // connection.sendUTF(message.utf8Data);
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function messageHandler(ws: connection, message: IncomingMessages) {
    if (message.type == supportMessage.joinRoom) {
        const payload = message.payload;
        userManager.addUser(payload.name, payload.roomId, payload.userId, ws)
    }
    if (message.type == supportMessage.sendMessage) {
        const payload = message.payload;
        const user = userManager.getUser(payload.roomId, payload.userId);
        if (!user) {
            console.error("User not found in db!")
            return;
        }
        let chat = store.addChat(payload.message, user.name, payload.roomId, payload.userId,)

        if(!chat){
            return;
        }

        const OutgoingPayload: OutgoingMessages = {
            type: OutgoingSupportMessages.addChat,
            payload: {
                chatId: chat.id,
                roomId: payload.roomId,
                message: payload.message,
                name: user.name,
                upvotes: 0
            }
        }
        userManager.broadcast(payload.roomId, payload.userId, OutgoingPayload)
    }
    if (message.type == supportMessage.upvoteMessage) {
        const payload = message.payload;
        const chat = store.upvote(payload.roomId, payload.chatId, payload.userId,)

        if(!chat){
            return;
        }

        const OutgoingPayload: OutgoingMessages = {
            type: OutgoingSupportMessages.Updatechat,
            payload: {
                chatId: payload.chatId,
                roomId: payload.roomId,
                upvotes: chat.upVotes.length
            }
        }
        userManager.broadcast(payload.roomId, payload.userId, OutgoingPayload)

    }

}