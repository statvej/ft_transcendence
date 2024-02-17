import { findIndex } from "rxjs";
import {
    ArrayUnique,
    ArrayMinSize,
    IsBoolean,
    IsOptional,
    IsString,
} from "class-validator";
import { Chat, Chat_User, Message } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { ChatService } from "src/chat/chat.service";

export class CreateNewChatDTO {
    name: string;
    dm: boolean;
    pw_protected: boolean;
    password: string;
    chat_users: ChatUserDTO[] = [];

    constructor(
        name: string,
        dm: boolean,
        pw_protected: boolean,
        password: string,
        chat_users: ChatUserDTO[]
    ) {
        this.name = name;
        this.dm = dm;
        this.pw_protected = pw_protected;
        this.password = password;
        this.chat_users = chat_users;
    }
}

export interface Chat_ChatUser extends Chat {
    chatUsers: Chat_User[];
}

export interface Chat_complete extends Chat {
    chatUsers: Chat_User[];
    messages: Message[];
}

export class ChatListDTO {
    chatName: string;
    chatId: number;

    constructor(chatName: string, chatId: number) {
        this.chatName = chatName;
        this.chatId = chatId;
    }
}

export class MessageListElementDTO {
    id: number;
    content: string;
    author: number;

    constructor(id: number, content: string, author: number) {
        this.id = id;
        this.content = content;
        this.author = author;
    }
}

export class MessageDTO {
    id: number;
    timeStamp: Date;
    content: string;
    authorId: number;
    chatId: number;

    constructor(id: number, timeStamp: Date, content: string, authorId: number, chatId: number) {
        this.id = id;
        this.timeStamp = timeStamp;
        this.content = content;
        this.authorId = authorId;
        this.chatId = chatId;
    }

    static fromMessage(message: Message): MessageDTO {
        return new MessageDTO(
            message.id,
            message.createdAt,
            message.content,
            message.author,
            message.chatId
        );
    }
}

export class ParticipantListElementDTO {
    userName: string;
    userId: number;
    owner: boolean;
    admin: boolean;
    online: boolean;
    pictureUrl: string;

    constructor(
        userName: string,
        userId: number,
        owner: boolean,
        admin: boolean,
        online: boolean
    ) {
        this.userName = userName;
        this.userId = userId;
        this.owner = owner;
        this.admin = admin;
        this.online = online;
    }
}

export class SendMessageDTO {
    chatId: number;
    userId: number;
    content: string;

    constructor(chatID: number, userID: number, content: string) {
        this.chatId = chatID;
        this.userId = userID;
        this.content = content;
    }
}

export class EstablishConnectDTO {
    userID: number;
}

export class NewChatDTO {
    @IsBoolean()
    dm: boolean;

    @IsBoolean()
    @IsOptional()
    isPrivate?: boolean;

    @IsString()
    @IsOptional()
    password?: string;

    @ArrayMinSize(1, { message: "At least 1 user id required" })
    @ArrayUnique({ message: "User ids must be unique" })
    userIds: number[];
}

export class ChatUserDTO {
    userId: number;
    chatId: number;
    owner: boolean;
    admin: boolean;
    blocked: boolean;
    muted: boolean;
    mutedUntil?: Date;
    invited: boolean;

    constructor(
        userId: number,
        chatId: number,
        owner: boolean,
        admin: boolean,
        blocked: boolean,
        muted: boolean,
        mutedUntil: Date,
        invited: boolean
    ) {
        this.userId = userId;
        this.chatId = chatId;
        this.owner = owner;
        this.admin = admin;
        this.blocked = blocked;
        this.muted = muted;
        this.mutedUntil = mutedUntil;
        this.invited = invited;
    }

    static fromChatUser(chatUser: Chat_User): ChatUserDTO {
        return new ChatUserDTO(
            chatUser.userId,
            chatUser.chatId,
            chatUser.owner,
            chatUser.admin,
            chatUser.blocked,
            chatUser.muted,
            chatUser.muted_until,
            chatUser.invited
        );
    }
}

export class ExtendedChatUserDTO {
    userId: number;
    userName?: string | null;
    chatId: number;
    chatName?: string | null;
    owner: boolean;
    admin: boolean;
    blocked: boolean;
    muted: boolean;
    mutedUntil?: Date | null;
    invited: boolean;

    constructor(
        userId: number,
        userName: string | null,
        chatId: number,
       // chatName: string | null,
        owner: boolean,
        admin: boolean,
        blocked: boolean,
        muted: boolean,
        mutedUntil: Date,
        invited: boolean
    ) {
        this.userId = userId;
        this.userName = userName;
        this.chatId = chatId;
        //this.chatName = chatName;
        this.owner = owner;
        this.admin = admin;
        this.blocked = blocked;
        this.muted = muted;
        this.mutedUntil = mutedUntil;
        this.invited = invited;
    }

    static async fromChatUser(
        chatUser: Chat_User,
        userService: UserService,
        //chatService: ChatService
    ): Promise<ExtendedChatUserDTO> {
        const userName = await userService.getNameById(chatUser.userId);
        //const chatName = await chatService.getChatName(chatUser.chatId, chatUser.userId);

        return new ExtendedChatUserDTO(
            chatUser.userId,
            userName,
            chatUser.chatId,
            //chatName,
            chatUser.owner,
            chatUser.admin,
            chatUser.blocked,
            chatUser.muted,
            chatUser.muted_until,
            chatUser.invited
        );
    }
}

export class ChatInfoDTO {
    id: number;
    name: string;
    dm: boolean;
    isPrivate: boolean;
    passwordRequired: boolean;

    constructor(
        id: number,
        name: string,
        dm: boolean,
        isPrivate: boolean,
        passwordRequired: boolean
    ) {
        this.id = id;
        this.name = name;
        this.dm = dm;
        this.isPrivate = isPrivate;
        this.passwordRequired = passwordRequired;
    }

    static fromChatDTO(chat: ChatDTO): ChatInfoDTO {
        return new ChatInfoDTO(
            chat.id,
            chat.name,
            chat.dm,
            chat.isPrivate,
            chat.passwordRequired
        );
    }

    static fromChat(chat: Chat): ChatInfoDTO {
        return new ChatInfoDTO(
            chat.id,
            chat.name,
            chat.dm,
            chat.isPrivate,
            !!chat.password
        );
    }
}

export class ChatDTO {
    id: number;
    name: string;
    dm: boolean;
    isPrivate: boolean;
    passwordRequired: boolean;
    chatUsers: ChatUserDTO[];
    messages: MessageDTO[];

    constructor(
        id: number,
        name: string,
        dm: boolean,
        isPrivate: boolean,
        passwordRequired: boolean,
        chatUsers: ChatUserDTO[],
        messages: MessageDTO[]
    ) {
        this.id = id;
        this.name = name;
        this.dm = dm;
        this.isPrivate = isPrivate;
        this.passwordRequired = passwordRequired;
        this.chatUsers = chatUsers;
        this.messages = messages;
    }
}

//Its json for tests
// {
//     "name": "name??",
//     "dm": false,
//     "pw_protected": false,
//     "password": false,
//     "chat_users": [
//     {
//         "userId" : 1,
//         "owner": false,
//         "admin": false,
//         "blocked": false,
//         "muted": false,
//         "invited": false
//     },
//     {
//         "userId" : 2,
//         "owner": false,
//         "admin": false,
//         "blocked": false,
//         "muted": false,
//         "invited": false
//     }
// ]
// }

export class InviteUserDTO {
    chatId: number;
    userId: number;
    password: string;

    constructor(chatID: number, userId: number, password: string) {
        this.chatId = chatID;
        this.userId = userId;
        this.password = password;
    }
}

export class ChangeChatUserStatusDTO {
    operatorId: number;
    chatId: number;
    userId: number;
    status: string;
    value: boolean;
    constructor(
        operatorId: number,
        chatId: number,
        userId: number,
        status: string,
        value: boolean
    ) {
        this.operatorId = operatorId;
        this.chatId = chatId;
        this.userId = userId;
        this.status = status;
        this.value = value;
    }
}

// {
//     "operatorId": 1,
//     "chatId": 2,
//     "userId": 2,
//     "status": "mute",
//     "value": true
// }
