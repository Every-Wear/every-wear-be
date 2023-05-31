"use strict";

// ==================== middlewares ==================== //

import { authCheck } from "../middlewares/auth.js";
import {
    requestNewMatching,
    getMatchingClientCookie,
    getAllMatchingByStatus,
    getMatching,
    getMatchingQRcodeImage,
    checkTargetMatchingStatus,
    updateMatching,
    cancleMatching,
} from "../controllers/matchingController.js";

// ==================== Routing ==================== //

const matchingRouter = (app, endpoint) => {
    app.use(`${endpoint}`, authCheck);

    // 매칭 견적서 만들기
    app.route(`${endpoint}`).post(requestNewMatching);

    // 나의 매칭 견적서만 가져오기
    app.route(`${endpoint}/my`).get(getMatchingClientCookie);

    // 매칭 견적서 정보 얻어오기
    app.route(`${endpoint}s`).get(getAllMatchingByStatus);
    app.route(`${endpoint}/:uuid`).get(getMatching);
    app.route(`${endpoint}/img/:uuid`).get(getMatchingQRcodeImage);

    // 견적서 상태 티키타카, update!
    app.route(`${endpoint}/:uuid`).patch(checkTargetMatchingStatus, updateMatching);

    // 견적 취소
    app.route(`${endpoint}/:uuid`).delete(cancleMatching);
};

export default matchingRouter;