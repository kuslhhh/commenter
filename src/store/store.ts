
export type UserId = string

export interface Chat {

    id: string;
    userId: UserId;
    name: string;
    message: string;
    upVotes: UserId[];
    

}


export abstract class store {

    constructor(){

    }

    initRoom(roomId: string){

    }

    getchats(room:string, limit: number, offset: number){

    }

    addChat(userId: UserId, name: string, room:string, message: string){

    }

    upvote( userId: UserId, room: string, chatId: string){

    }


}