import mongoose from "mongoose";


const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        default: []
    },
    viewsCount: {
        type: Number,
        default: 0
    }, 

    commentsCount: {
        type: Number,
        default: 0
    },

    imageUrl: {
        type: String,
        default: []
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    comments: [{
        text: {
            type: String,
            required: true
        },
        postedBy : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }]

}, 
{
    timestamps: true
});
export default mongoose.model('Post', PostSchema);