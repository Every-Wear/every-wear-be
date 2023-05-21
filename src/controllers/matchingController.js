"use strict";

import {
    generateQRCode,
    findUserByUUID,
    createMatching
} from "../service/matchingService.js";

export const requestNewMatching = async (req, res) => {
    try {
        req.body.publishUserId = req.user.id;
        const newMatching = await createMatching(req.body);
        const qrCode = await generateQRCode(newMatching.uuid);
        const data = {
            msg: `${req.user.id}님 매칭 요청에 성공했습니다.`,
            newMatching,
            qrCode
        };
        return res.status(201).json({ data });
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};

export const getMatching = async (req, res) => {
    const matchingUUID = req.params.uuid;
    const matching = await findUserByUUID(matchingUUID);
    const qrCode = await generateQRCode(matching.uuid);
    delete matching._doc._id;
    return res.status(200).json({ matching, qrCode });
};

export const getMatchingQRcodeImage = async (req, res) => {
    const matchingUUID = req.params.uuid;
    const matching = await findUserByUUID(matchingUUID);
    const qrCode = await generateQRCode(matching.uuid);

    const data = qrCode.replace(/.*,/, "")
    const img = Buffer.from(data, "base64")
    res.writeHead(200, { "Content-Type": "image/png" })
    return res.status(200).end(img)
};


// ===================================================================================== //

// dump data 겸 모든 user 지우기
export const deletAllUser = async (req, res) => {
    try {
        const result = await deleteUserAll();
        return res.status(201).json({msg: `User delete all ${result}개 삭제 성공`});
    } catch (error) {
        return res.status(400).json({msg: "User delete all 실패"});   
    }
};