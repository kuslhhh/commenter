import { store, Chat } from "./store/store";

export interface Room {
    roomId: string,
    chats: Chat[]
}

export class inMemoryStore implements store {

    private store: Map<string, Room>;

    constructor() {
        this.store = new Map<string, Room>()
    }

    initRoom(roomId: string) {
        this.store.set(roomId, {
            roomId,
            chats: []
        })
    }


    getchats(roomId: string, limit: number, offset: number) {
        const room = this.store.get(roomId)

        if(!room){
            return []
        }
        return room.chats;
    }

    addChat(room: string, limit: number, offset: number) {

    }

    upvote(room: string, chatId: string) {

    }


}