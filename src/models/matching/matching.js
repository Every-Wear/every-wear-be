import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const matchingSchema = mongoose.Schema({ // 몽구스 요청하고 필드 정의
    uuid: {
        type: String,
        default: uuidv4,
        unique: true
    },
    qrCodeValue: {
        type: String,
        unique: true
    },
    publishUserId: {
        type: String,
        required: true,
    },
    // 매칭 하기를 누른 코디 값으로 patch 되어야 한다.
    subscriptionUserId: {
        type: String,
    },
    statusType: {
        type: String,
        default: "매칭대기중",
        enum: ["매칭대기중", "매칭중", "매칭완료", "진행중", "진행완료", "취소"]
    },

    // 매칭에 대한 세부 내역
    clothesType: { // 어떤 옷을 사려고 하는지, 생각한 값 콤마 기준 중복해서 들어감
        type: String,
        required: true,
    },
    limitPrice: { // 예산
        type: Number,
    },
    preferPlace: { // 선호하는 쇼핑 위치, 생각한 값 콤마 기준 중복해서 들어감
        type: String,
    },
    preferTime: { // 선호 시간 
        type: String,
    },
    preferStyle: { // 선호하는 코디 형태
        type: String,
    },
    preferGender: { // 선호하는 코디 성별
        type: String,
        enum: ["man", "woman"]
    },
    remark: { // 기타 및 비고란 
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

matchingSchema.set("collection", "matching"); // collection 이름 정하기
const Matching = mongoose.model("Matching", matchingSchema);
export default Matching;