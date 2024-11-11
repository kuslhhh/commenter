
type UserId = string

export interface Chat {

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

    addChat(room:string, limit: number, offset: number){

    }

    upvote(room: string, chatId: string){

    }


}