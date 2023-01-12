import mongoose from 'mongoose';

const logSchema = mongoose.Schema({
    message: String,
    response: String,
    image_url: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var LogMessage = mongoose.model('LogMessage', logSchema);

export default LogMessage;