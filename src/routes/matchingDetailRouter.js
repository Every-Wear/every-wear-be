"use strict";

// ==================== middlewares ==================== //

import { authCheck } from "../middlewares/auth.js";
import {
    getAllMatchingAndDetailByServerId,
    getAllMatchingAndDetailByUUID,
} from "../controllers/matchingDetailController.js";

// ==================== Routing ==================== //

const matchingRouter = (app, endpoint) => {
    app.use(`${endpoint}`, authCheck);
    app.use(`${endpoint}s`, authCheck);

    // 로그인한 유저 대상의 "진행완료" 견적서와 matchingDetail 다 가져오기
    app.route(`${endpoint}s`).get(getAllMatchingAndDetailByServerId);

    // "진행완료"의 uuid의 견적서와 matchingDetail 다 가져오기
    app.route(`${endpoint}/:uuid`).get(getAllMatchingAndDetailByUUID);
};

export default matchingRouter;