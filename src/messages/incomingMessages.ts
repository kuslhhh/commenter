import z from "zod"

export enum supportMessage {
    joinRoom = "JOIN_ROOM",
    sendMessage = "SEND_MESSAGE",
    upvoteMessage= "UPVOTE_MESSAGE"
}

export type IncomingMessages = {
    type: supportMessage.joinRoom,
    payload: InitMessageType
} | {
    type: supportMessage.sendMessage,
    payload: UserMessagesType
} | {
    type: supportMessage.upvoteMessage,
    payload: UpvoteMessageType
};

export const InitMessage = z.object({
    name: z.string(),
    userId: z.string(),
    roomId: z.string(),

})  

export type InitMessageType = z.infer<typeof InitMessage>;

export const UserMessages = z.object({
    userId: z.string(),
    roomId: z.string(),
    message: z.string()

})

export type UserMessagesType = z.infer<typeof UserMessages>;

export const UpvoteMessage = z.object({
    chatId: z.string(),
    userId: z.string(),
    roomId: z.string(),

})

export type UpvoteMessageType = z.infer<typeof UpvoteMessage>;
