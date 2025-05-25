// models/Chat.js
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    pdf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PDF',
        required: true
    },
    sender: {
        type: String,
        enum: ['user', 'ai'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
