import mongoose , {Schema} from "mongoose";

const apiKeySchema = new Schema({
    apiKey: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    expiresAt: { type: Date }

},{timestamps : true});

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

export default ApiKey;