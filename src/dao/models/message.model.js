import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    "user": String,
    "message": String
})

export const messageModel = mongoose.model("messages", messageSchema);
