

export enum supportMessage {
    addChat = "ADD_CHAT",
    Updatechat = "UPDATE_CHAT",
    upvoteMessage = "UPVOTE_MESSAGE"
}

type messagePayload =
    {
        roomId: string,
        message: string,
        name: string,
        upvotes: number,
        chatId: string,
    }

export type OutgoingMessages = {
        type: supportMessage.addChat,
        payload: messagePayload
    } | {
        type: supportMessage.Updatechat,
        payload: Partial<messagePayload>
    }