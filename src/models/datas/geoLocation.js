import mongoose from "mongoose";

const geolocationSchema = mongoose.Schema({ // 몽구스 요청하고 필드 정의
    targetMatching: {
        type: String,
        required: true,
    },
    publishUserId: {
        type: String,
    },
    subscriptionUserId: {
        type: String,
    },
    latitude: { // 37.5486743
        type: String,
        required: true,
    },
    longitude: { // 127.0687687
        type: String,
        required: true,
    },
    remark: { // 기타 및 비고란 
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

geolocationSchema.set("collection", "geolocation"); // collection 이름 정하기
const Geolocation = mongoose.model("Geolocation", geolocationSchema);
export default Geolocation;