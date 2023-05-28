"use strict";

import { findMatchByUUID } from "../service/matchingService.js";
import { createGeolocationData, findAllGeolocationByUUID } from "../service/datasService.js";


export const checkTargetMatching = async (req, res, next) => {
    const matchingUUID = req.params.uuid;
    const targetMatching = await findMatchByUUID(matchingUUID);

    if (!targetMatching)
        return res.status(404).json({ error: "신청서가 존재하지 않습니다!" });

    // 진행중 상태인 매칭만 geolocation 데이터 수집
    if (targetMatching.statusType != "진행중")
        return res.status(400).json({ error: "신청서가 진행중 상태가 아닙니다!" });

    req.targetMatchingUUID = targetMatching.uuid;
    next();
};

export const recordGeolocation = async (req, res) => {
    try {
        const newGelocation = await createGeolocationData(req.targetMatchingUUID, req.body, req.user);
        const data = {
            msg: `${req.user.id} geolocation data 수집 성공`,
            newGelocation,
        };
        return res.status(201).json({ data });
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};

export const getAllGeolocation = async (req, res) => {
    const page = parseInt(req.query.page) || null;
    const limit = parseInt(req.query.limit) || null;

    const { totalCount, targetGeolocations } = await findAllGeolocationByUUID(req.targetMatchingUUID, page, limit);
    return res.status(200).json({
        totalCount,
        totalPages: (limit === null ? "total" : Math.ceil(totalCount / limit)),
        currentPage: (page === null ? "total" : page),
        targetGeolocations,
    });
};

// // GET all geolocation documents with pagination
// router.get('/geolocation', async (req, res) => {
//     const page = parseInt(req.query.page) || 1; // Current page number, defaulting to 1
//     const limit = parseInt(req.query.limit) || 10; // Number of documents per page, defaulting to 10

//     try {
//         const skip = (page - 1) * limit;

//         // Query the total count of documents
//         const totalCount = await Geolocation.countDocuments();

//         // Query the documents for the current page with pagination
//         const geolocations = await Geolocation.find().skip(skip).limit(limit);

//         res.json({
//             totalCount,
//             totalPages: Math.ceil(totalCount / limit),
//             currentPage: page,
//             geolocations,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// module.exports = router;
