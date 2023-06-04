"use strict";
import {
    findByUUID,
    findAllByServerId,
} from "../service/matchingDetailService.js";

export const getAllMatchingAndDetailByUUID = async (req, res) => {
    if (req.user.userType != "server")
        return res.status(403).json({ error: "접근 권한이 없습니다. 잘못된 접근 권한 요청입니다." });

    const matchingUUID = req.params.uuid;
    const findMatchingResult = await findByUUID(matchingUUID);
    if (!findMatchingResult)
        return res.status(404).json({ error: "요청한 uuid에 해당하는 견적서를 찾을 수 없습니다!" });

    const { matching, matchingDetail } = findMatchingResult;
    return res.status(200).json({ matching, matchingDetail });
};

export const getAllMatchingAndDetailByServerId = async (req, res) => {
    if (req.user.userType != "server")
        return res.status(403).json({ error: "접근 권한이 없습니다. 잘못된 접근 권한 요청입니다." });

    const findAllMatchingResult = await findAllByServerId(req.user.id);
    if (!findAllMatchingResult)
        return res.status(404).json({ error: "요청한 유저에 해당하는 견적서를 찾을 수 없습니다!" });

    return res.status(200).json(findAllMatchingResult);
};
