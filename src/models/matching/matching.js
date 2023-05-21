import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const matchingSchema = mongoose.Schema({ // 몽구스 요청하고 필드 정의
    uuid: {
        type: String,
        default: uuidv4,
        unique: true
    
    },
    publishUserId: {
        type: String,
        required: true,
    },
    subscriptionUserId: {
        type: String,
    },
    statusType: {
        type: String,
        enum: ["대기중", "매칭",]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

matchingSchema.set("collection", "matching"); // collection 이름 정하기
const Matching = mongoose.model("Matching", matchingSchema);
export default Matching;