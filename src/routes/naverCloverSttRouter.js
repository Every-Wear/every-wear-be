"use strict";

// ==================== middlewares ==================== //
import { authCheck } from "../middlewares/auth.js";
import { upload } from "../middlewares/imageMulter.js";
import {
    naverClovaSttApi,
} from "../controllers/naverCloverController.js";

// ==================== Routing ==================== //

const naverClovaRouter = (app, endpoint) => {
    app.use(`${endpoint}`, authCheck);
    app.route(`${endpoint}`).post(upload.single("voice"), naverClovaSttApi);
};

export default naverClovaRouter;