"use strict";
import Matching from "../models/matching/matching.js";
import MatchingDetail from "../models/matching/matchingDetail.js";

export const findByUUID = async (uuid) => {
    try {
        const matching = await Matching.findOne({ uuid }).exec()
        if (!matching) return null;
        const matchingDetail = await MatchingDetail.findOne({ uuid }).exec()
        return { matching, matchingDetail };
    } catch (err) {
        console.error(err);
        return err;
    }
};

export const findAllByServerId = async (subscriptionUserId) => {
    try {
        const matchings = await Matching.find({ subscriptionUserId, statusType: "진행완료" }).exec()
        if (!matchings || matchings.length === 0) return null;

        const matchingDetailList = await Promise.all(
            matchings.map(async (matching) => {
                const { uuid } = matching;
                return await MatchingDetail.findOne({ uuid }).exec();
            })
        );

        // matchingList와 matchingDetailList를 조합하여 객체의 배열로 생성
        const combinedList = matchings.map((matching, index) => ({
            matching,
            matchingDetail: matchingDetailList[index],
        }));

        if (!combinedList || combinedList.length === 0) return null;
        return combinedList;
    } catch (err) {
        console.error(err);
        return err;
    }
};
