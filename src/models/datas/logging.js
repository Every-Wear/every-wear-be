import mongoose from "mongoose";

const loggingSchema = mongoose.Schema({ // 몽구스 요청하고 필드 정의
    loginId: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

loggingSchema.set("collection", "logging"); // collection 이름 정하기
const Logging = mongoose.model("Logging", loggingSchema);
export default Logging;