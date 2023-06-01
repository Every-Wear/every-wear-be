"use strict";

import {
    findMatchByUUID,
    findPendingMatchByClientId,
    findServiceMatchByClientId,
    findAllMatchByStatus,
    createMatching,
    updateMatchingCancle,
    updateMatchingStepOne,
    updateMatchingStepTwo,
    updateMatchingStepThree,
    updateMatchingStepFour,
} from "../service/matchingService.js";

export const requestNewMatching = async (req, res) => {
    try {
        req.body.publishUserId = req.user.id;

        // 매칭 생성은 client밖에 못한다.
        // client는 하나의 matching 만 매칭대기중 인 상태로 둘 수 있다.
        // 즉 매칭대기중인 상태가 하나라도 있으면, 안된다!
        const clientMatchings = await findPendingMatchByClientId(req.user.id);
        if (clientMatchings)
            return res.status(400).json({ error: "이미 매칭대기중인 신청서가 존재합니다!" });

        const newMatching = await createMatching(req.body);
        const data = {
            msg: `${req.user.id}님 매칭 요청에 성공했습니다.`,
            newMatching,
        };
        return res.status(201).json({ data });
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};

export const getMatchingClientCookie = async (req, res) => {
    const matching = await findServiceMatchByClientId(req.user.id);
    if (!matching)
        return res.status(400).json({ error: "존재하는 매칭이 없습니다!" });
    return res.status(200).json({ matching });
};

export const getAllMatchingByStatus = async (req, res) => {
    const matchingStatus = req.query.status;
    const matchings = await findAllMatchByStatus(matchingStatus);
    return res.status(200).json({ matchings });
};

export const getMatching = async (req, res) => {
    const matchingUUID = req.params.uuid;
    const matching = await findMatchByUUID(matchingUUID);
    delete matching._doc._id;
    return res.status(200).json({ matching });
};

export const getMatchingQRcodeImage = async (req, res) => {
    const matchingUUID = req.params.uuid;
    const matching = await findMatchByUUID(matchingUUID);
    const data = matching["qrCodeValue"].replace(/.*,/, "")
    const img = Buffer.from(data, "base64")
    res.writeHead(200, { "Content-Type": "image/png" })
    return res.status(200).end(img)
};

export const cancleMatching = async (req, res) => {
    // clinet(시각장애인) 만 cancle 가능 
    if (req.user.userType != "client")
        return res.status(403).json({ error: "접근 권한이 없습니다. 잘못된 접근 권한 요청입니다." });

    // 해당 매칭 견적서의 상태가 "매칭대기중", "매칭중", "매칭완료" 중 하나여야만 함
    const matchingUUID = req.params.uuid;
    const matching = await findMatchByUUID(matchingUUID);
    if (!matching)
        return res.status(404).json({ error: "요청한 uuid에 해당하는 견적서를 찾을 수 없습니다!" });

    const possibleCancleStatus = ["매칭대기중", "매칭중", "매칭완료"];
    if (!possibleCancleStatus.includes(matching.statusType))
        return res.status(403).json({ error: "요청한 uuid에 해당하는 견적서는 취소할 수 없는 상태입니다!" });

    // 해당 매칭 견적서 상태 취소로 변경
    const cancleReason = req.body.reason;
    const matchingUpdateRemakr = `${matching.remark} / 취소사유: ${cancleReason}`;
    const cancledMatching = await updateMatchingCancle(matchingUUID, matchingUpdateRemakr);
    if (!cancledMatching)
        return res.status(404).json({ error: "요청한 uuid에 해당하는 견적서를 찾을 수 없습니다!" });

    delete cancledMatching._doc._id;
    return res.status(200).json({ matching: cancledMatching });

    // 취소로 변경 이후 server에게 알려야한다!!

};

// ===================================================================================== //
// 견적서 이제 step by step으로 update & patch
// ===================================================================================== //
// ["매칭대기중", "매칭중", "매칭완료", "진행중", "진행완료"]

export const checkTargetMatchingStatus = async (req, res, next) => {
    // 매칭대기중 -> 매칭중, 상태를 바꿀 수 있는 사람은 코디네이터(server) 뿐
    if (req.user.userType != "server")
        return res.status(403).json({ error: "접근 권한이 없습니다. 잘못된 접근 권한 요청입니다." });

    const matchingUUID = req.params.uuid;
    const matching = await findMatchByUUID(matchingUUID);
    if (!matching)
        return res.status(404).json({ error: "요청한 uuid에 해당하는 견적서를 찾을 수 없습니다!" });

    req.matchingUUID = matchingUUID;
    next();
}

export const updateMatching = async (req, res) => {
    if (req.query.status)
        return res.status(400).json({ error: "잘못된 요청입니다. query string을 확인해 주세요!" });

    if (!["매칭중", "매칭완료", "진행중", "진행완료"].includes(req.query.status))
        return res.status(400).json({ error: "잘못된 요청입니다. query string을 확인해 주세요!" });

    const UPDATE_MAPPER = {
        "매칭중": updateMatchingStepOne,
        "매칭완료": updateMatchingStepTwo,
        "진행중": updateMatchingStepThree,
        "진행완료": updateMatchingStepFour,
    };
    try {
        const updatedMatching = await UPDATE_MAPPER[req.query.status](req.matchingUUID, req);
        if (!updatedMatching)
            return res.status(404).json({ error: "요청한 uuid에 해당하는 견적서를 찾을 수 없습니다!" });

        // 정상 업데이트 완료
        delete updatedMatching._doc._id;
        return res.status(200).json({ matching: updatedMatching });
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};