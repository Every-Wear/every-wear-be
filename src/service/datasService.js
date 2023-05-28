
import Geolocation from "../models/datas/geoLocation.js";

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