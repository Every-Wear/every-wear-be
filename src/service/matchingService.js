import qrcode from "qrcode";
import Matching from "../models/matching/matching.js";


export const generateQRCode = async (data, options = {}) => {
    try {
        const qrCode = await qrcode.toDataURL(data, options);
        console.log(qrCode); // QR 코드 데이터 URL 출력
        return qrCode;
    } catch (err) {
        console.error("QR 코드 생성 중 오류가 발생했습니다:", err);
        return err;
    }
};


export const findUserByUUID = async (uuid) => {
    try {
        const matching = await Matching.findOne({ uuid }).exec()
        return matching;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export const createMatching = async (body) => {
    const { uuid, publishUserId, subscriptionUserId, statusType } = body;
    try {
        const newMatching = new Matching({
            uuid: uuid,
            publishUserId: publishUserId,
            subscriptionUserId: subscriptionUserId,
            statusType: statusType
        });

        const saveMatching = await newMatching.save();
        return saveMatching;
    } catch (err) {
        console.error(err);
        return err;
    }
};