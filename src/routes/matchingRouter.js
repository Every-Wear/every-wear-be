"use strict";

// ==================== middlewares ==================== //

import { authCheck } from "../middlewares/auth.js";
import {
    requestNewMatching,
    getAllMatchingByStatus,
    getMatching,
    getMatchingQRcodeImage,
    updateMatching,
    cancleMatching,
} from "../controllers/matchingController.js";

// ==================== Routing ==================== //

const matchingRouter = (app, endpoint) => {
    app.use(`${endpoint}`, authCheck);

    // 매칭 견적서 만들기
    app.route(`${endpoint}`).post(requestNewMatching);

    // 매칭 견적서 정보 얻어오기
    app.route(`${endpoint}s`).get(getAllMatchingByStatus);
    app.route(`${endpoint}/:uuid`).get(getMatching);
    app.route(`${endpoint}/img/:uuid`).get(getMatchingQRcodeImage);

    // 견적서 상태 티키타카, update!
    app.route(`${endpoint}/:uuid`).patch(updateMatching);

    // 견적 취소
    app.route(`${endpoint}/:uuid`).delete(cancleMatching);
};

export default matchingRouter;