import { messageModel } from "../models/message.model.js"

class MessageManager {
    constructor(){
        this.model = messageModel;
    }
    async getMessages(){
        return await messageModel.find().lean();
    }
    async postMessage(message){
        return await messageModel.create(message);
    }
    async deleteMessage(mid){
        return await messageModel.deleteOne({_id: mid})
    }
}

const messageManager = new MessageManager();

export default messageManager;