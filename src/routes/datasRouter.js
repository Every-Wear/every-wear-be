"use strict";

// ==================== middlewares ==================== //

import { authCheck } from "../middlewares/auth.js";
import {
    checkTargetMatching,
    recordGeolocation,
    getAllGeolocation,
} from "../controllers/datasController.js";

// ==================== Routing ==================== //

const datasRouter = (app, endpoint) => {
    app.use(`${endpoint}`, authCheck);

    // geolocation 수집 API & Get All
    app.route(`${endpoint}/geo/:uuid`).post(checkTargetMatching, recordGeolocation);
    app.route(`${endpoint}/geo/:uuid`).get(checkTargetMatching, getAllGeolocation);
};

export default datasRouter;