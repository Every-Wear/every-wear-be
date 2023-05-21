"use strict";

// ==================== middlewares ==================== //

import { authCheck } from "../middlewares/auth.js";
import { requestNewMatching, getMatching, getMatchingQRcodeImage } from "../controllers/matchingController.js";

// ==================== Routing ==================== //

const matchingRouter = (app, endpoint) => {
    app.use(`${endpoint}`, authCheck);

    // 매칭 견적서 만들기
    app.route(`${endpoint}`).post(requestNewMatching);

    // 매칭 견적서 정보 얻어오기
    app.route(`${endpoint}/:uuid`).get(getMatching);
    app.route(`${endpoint}/img/:uuid`).get(getMatchingQRcodeImage);
};

export default matchingRouter;