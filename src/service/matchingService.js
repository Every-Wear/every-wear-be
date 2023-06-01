import qrcode from "qrcode";
import Matching from "../models/matching/matching.js";
import MatchingDetail from "../models/matching/matchingDetail.js";


export const generateQRCode = async (data, options = {}) => {
    try {
        const qrCode = await qrcode.toDataURL(data, options);
        // console.log(qrCode); // QR 코드 데이터 URL 출력
        return qrCode;
    } catch (err) {
        console.error("QR 코드 생성 중 오류가 발생했습니다:", err);
        return err;
    }
};

export const findMatchByUUID = async (uuid) => {
    try {
        const matching = await Matching.findOne({ uuid }).exec()
        return matching;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export const findPendingMatchByClientId = async (publishUserId) => {
    try {
        const matching = await Matching.findOne({ publishUserId: publishUserId, statusType: "매칭대기중" }).exec()
        return matching;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export const findServiceMatchByClientId = async (publishUserId) => {
    try {
        const matching = await Matching.findOne({ publishUserId: publishUserId, statusType: { $ne: "진행완료", $ne: "취소" } }).exec();
        return matching;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export const findAllMatchByServerId = async (subscriptionUserId) => {
    try {
        const matchings = await Matching.find({ subscriptionUserId }).exec();
        return matchings;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export const findAllMatchByStatus = async (status) => {
    try {
        const matchings = await Matching.find({ statusType: status });
        return matchings;
    } catch (err) {
        console.error(err);
        return err;
    }
}

export const createMatching = async (body) => {
    const { publishUserId, clothesType, limitPrice, preferPlace, preferStyle, preferGender, remark } = body;
    try {
        const newMatching = new Matching({
            publishUserId: publishUserId,
            clothesType: clothesType,
            limitPrice: limitPrice,
            preferPlace: preferPlace,
            preferStyle: preferStyle,
            preferGender: preferGender,
            remark: remark,
        });
        await newMatching.save();
        const qrCodeValue = await generateQRCode(String(newMatching.uuid));
        newMatching.qrCodeValue = qrCodeValue;
        const saveMatching = await newMatching.save();
        return saveMatching;
    } catch (err) {
        console.error(err);
        return err;
    }
};

// 매칭 취소하기
export const updateMatchingCancle = async (uuid, remark) => {
    try {
        const updatedQuery = { statusType: "취소", remark: remark };
        const updatedMatching = await Matching.findOneAndUpdate(
            { uuid },
            { $set: updatedQuery },
            { new: true }
        );
        return updatedMatching;
    } catch (err) {
        console.error(err);
        return err;
    }
};


// ===================================================================================== //
// 견적서 이제 step by step으로 update & patch
// ===================================================================================== //

// 매칭 대기중 to 매칭 중
export const updateMatchingStepOne = async (uuid, req) => {
    try {
        const updatedQuery = {
            subscriptionUserId: req.user.id,
            statusType: "매칭중",
        };
        const updatedMatching = await Matching.findOneAndUpdate(
            { uuid },
            { $set: updatedQuery },
            { new: true }
        );
        return updatedMatching;
    } catch (err) {
        console.error(err);
        return err;
    }
};

// 매칭 중 to 매칭 완료
export const updateMatchingStepTwo = async (uuid, req) => {
    const { clothesType, limitPrice, preferPlace, preferStyle, remark } = req.body;
    try {
        const updatedQuery = {
            statusType: "매칭완료",
            clothesType: clothesType,
            limitPrice: limitPrice,
            preferPlace: preferPlace,
            preferStyle: preferStyle,
            remark: remark,
        };
        const updatedMatching = await Matching.findOneAndUpdate(
            { uuid },
            { $set: updatedQuery },
            { new: true }
        );
        return updatedMatching;
    } catch (err) {
        console.error(err);
        return err;
    }
};

// 매칭 완료 to 진행중
export const updateMatchingStepThree = async (uuid, req) => {
    try {
        const updatedQuery = { statusType: "진행중" };
        const updatedMatching = await Matching.findOneAndUpdate(
            { uuid },
            { $set: updatedQuery },
            { new: true }
        );
        return updatedMatching;
    } catch (err) {
        console.error(err);
        return err;
    }
};

// 진행중 to 진행완료
export const updateMatchingStepFour = async (uuid, req) => {


    try {
        const updatedQuery = { statusType: "진행완료" };
        const updatedMatching = await Matching.findOneAndUpdate(
            { uuid },
            { $set: updatedQuery },
            { new: true }
        );
        // 여기서는 매칭 디테일이 추가되어야 한다!
        const newMatchingDetail = new MatchingDetail({
            uuid,
            publishUserId: updatedMatching.publishUserId,
            subscriptionUserId: req.user.id,
            is_buy,
            // clothesPictures,
            // billingPictures,
            // otherPictures,
            epilogue,
        });
        await newMatchingDetail.save();
        return updatedMatching;
    } catch (err) {
        console.error(err);
        return err;
    }
};