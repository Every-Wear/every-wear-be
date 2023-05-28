import mongoose from "mongoose";

const matchingDetailSchema = mongoose.Schema({ // 몽구스 요청하고 필드 정의
    // 견적서, 매칭의 uuid 값 공유
    uuid: {
        type: String,
        unique: true,
        required: true,
    },
    publishUserId: {
        type: String,
        required: true,
    },
    subscriptionUserId: {
        type: String,
        required: true,
    },
    // 매칭에 대한 더 상세 내역
    is_buy: { // 실제 의류 구매 여부 
        type: Boolean,
        required: true,
    },
    // image URL 을 저장할지, buffer로 그 이미자 자체를 저장할지,,
    clothesPictures: { // 구매한 옷이 있으면 사진
        type: [String],
    },
    billingPictures: { // 구매한 옷이 있으면 영수증 사진
        type: [String],
    },
    otherPictures: { // 진행하면서 찍은 사진
        type: [String],
    },
    epilogue: { // server(코디네이터)의 후기
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

matchingDetailSchema.set("collection", "matchingDetail"); // collection 이름 정하기
const MatchingDetail = mongoose.model("Matching", matchingDetailSchema);
export default MatchingDetail;