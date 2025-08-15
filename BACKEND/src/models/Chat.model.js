import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    name: {
    type: String,
    required: function () {
            return this.isGroup; // required only if it's a group chat
        }
    },
    isGroup: {
        type:Boolean,
        default:false
    },
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
},{timestamps:true});

export const Chat = mongoose.model('Chat', chatSchema);