"use strict";
import fs from "fs";
import axios from "axios";

const stt = async (language, filePath) => {
    const url = `https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=${language}`;
    const fileStream = fs.createReadStream(filePath);
    const response = await axios.post(url, fileStream, {
        headers: {
            "Content-Type": "application/octet-stream",
            "X-NCP-APIGW-API-KEY-ID": process.env.STT_CLIENT_ID,
            "X-NCP-APIGW-API-KEY": process.env.STT_CLIENT_SECRET,
        },
    });
    console.log(response.status);
    return response.data;
};

export const naverClovaSttApi = async (req, res) => {

    if (!req.file)
        return res.status(400).json({ error: "파일을 확인해 주세요!" });

    try {
        // language => 언어 코드 ( Kor, Jpn, Eng, Chn )
        const naverClovaSttApiResult = await stt("Kor", req.file.path);
        return res.status(200).json({ message: naverClovaSttApiResult });
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};
