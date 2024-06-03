import { ethers, BigNumberish } from "ethers";
import CHATROOMABI from "../abis/ChatRoom.json";
import getProvider from "./provider";

const provider = getProvider();

export const getChatRoomName = async (chatRoomAddress: string) => {
    const chatRoom = new ethers.Contract(chatRoomAddress, CHATROOMABI, provider);
    const chatRoomName = (await chatRoom.roomName()) as String;

    return chatRoomName
}

export const getChatRoomFee = async (chatRoomAddress: string) => {
    const chatRoom = new ethers.Contract(chatRoomAddress, CHATROOMABI, provider);
    const chatRoomFee = (await chatRoom.joinFee()) as BigNumberish;

    return chatRoomFee.toString();
}

export const getChatRoomCreator = async (chatRoomAddress: string) => {
    const chatRoom = new ethers.Contract(chatRoomAddress, CHATROOMABI, provider);
    const chatRoomCreator = (await chatRoom.roomCreator()) as String;

    return chatRoomCreator
}

export const getUserJoined = async (chatRoomAddress: string, userAddress: string) => {
    const chatRoom = new ethers.Contract(chatRoomAddress, CHATROOMABI, provider);
    const userJoined = await chatRoom.joinedUsers(userAddress);

    return userJoined
}

export const validateChatRoom = async (chatRoomAddress: string) => {
    try {
        const TAG = 'Exo-Terra-Chat-Contract';
        const chatRoom = new ethers.Contract(chatRoomAddress, CHATROOMABI, provider);
        const chatRoomTag = (await chatRoom.chatRoomTag()) as (string | undefined);

        return chatRoomTag === TAG
    } catch (error) {
        if ((error as Error).message.includes('revert')) {
            return false;
        }
        throw error;
    }
}