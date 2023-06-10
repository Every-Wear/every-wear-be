
import Geolocation from "../models/datas/geoLocation.js";
import Logging from "../models/datas/logging.js";

export const createGeolocationData = async (targetMatchingUUID, body, user) => {
    const { latitude, longitude, remark } = body;
    try {
        const newGeolocation = new Geolocation({
            targetMatching: targetMatchingUUID,
            latitude,
            longitude,
            remark,
        });
        // 수집 주체 체크
        newGeolocation[user.userType === "client" ? "publishUserId" : "subscriptionUserId"] = user.id;
        const savedGeolocation = await newGeolocation.save();
        return savedGeolocation;
    } catch (err) {
        console.error(err);
        return err;
    }
};

// 얘는 비동기적으로만 수행되며 굳이 await 걸릴필요가 없다!
export const createLoggingData = async (req) => {
    try {
        const newLogging = new Logging({
            loginId: req.ip,
            reqUrl: req.url,
            reqMethod: req.method,
            reqHeaders: req.headers,
            reqBody: req.body,
        });
        newLogging.save();
    } catch (err) {
        console.error(err);
        return err;
    }
};


export const findAllGeolocationByUUID = async (targetMatchingUUID, page = null, limit = null) => {
    if (page != null & limit != null) {
        try {
            const skip = (page - 1) * limit;
            const totalCount = await Geolocation.countDocuments().exec();
            const targetGeolocations = await Geolocation.find({ targetMatching: targetMatchingUUID }).skip(skip).limit(limit).exec();
            return { totalCount, targetGeolocations }
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    try {
        const totalCount = await Geolocation.countDocuments().exec();
        const targetGeolocations = await Geolocation.find({ targetMatching: targetMatchingUUID }).exec();
        return { totalCount, targetGeolocations }
    } catch (err) {
        console.error(err);
        return err;
    }
}