"use strict";

import {
    findMatchByUUID,
    findPendingMatchByClientId,
    findAllMatchByStatus,
    createMatching,
    updateMatchingCancle,
    updateMatchingStepOne,
    updateMatchingStepTwo,
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
export const updateMatching = async (req, res) => {
    const STATUS_MAPPER = {
        "매칭중": __update매칭대기중To매칭중,
        "매칭완료": __update매칭중To매칭완료,
        "진행중": __update매칭완료To진행중,
    };
    return await STATUS_MAPPER[req.query.status](req, res);
};

const __update매칭대기중To매칭중 = async (req, res) => {
    // 매칭대기중 -> 매칭중, 상태를 바꿀 수 있는 사람은 코디네이터(server) 뿐
    if (req.user.userType != "server")
        return res.status(403).json({ error: "접근 권한이 없습니다. 잘못된 접근 권한 요청입니다." });

    try {
        const matchingUUID = req.params.uuid;
        const matching = await findMatchByUUID(matchingUUID);
        if (!matching)
            return res.status(404).json({ error: "요청한 uuid에 해당하는 견적서를 찾을 수 없습니다!" });

        const updatedMatching = await updateMatchingStepOne(matchingUUID, req.user.id);
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

const __update매칭중To매칭완료 = async (req, res) => {
    // 매칭중 -> 매칭완료, 상태를 바꿀 수 있는 사람은 코디네이터(server) 뿐
    if (req.user.userType != "server")
        return res.status(403).json({ error: "접근 권한이 없습니다. 잘못된 접근 권한 요청입니다." });

    try {
        const matchingUUID = req.params.uuid;
        const matching = await findMatchByUUID(matchingUUID);
        if (!matching)
            return res.status(404).json({ error: "요청한 uuid에 해당하는 견적서를 찾을 수 없습니다!" });

        const updatedMatching = await updateMatchingStepTwo(matchingUUID, req.body);
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

const __update매칭완료To진행중 = async (req, res) => {
    // 진입점은
};

// ===================================================================================== //

// // dump data 겸 모든 user 지우기
// export const deletAllUser = async (req, res) => {
//     try {
//         const result = await deleteUserAll();
//         return res.status(201).json({ msg: `User delete all ${result}개 삭제 성공` });
//     } catch (error) {
//         return res.status(400).json({ msg: "User delete all 실패" });
//     }
// };