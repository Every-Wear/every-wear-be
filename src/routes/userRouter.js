"use strict";

// ==================== middlewares ==================== //

import { validateUserCreate } from "../middlewares/validators/userValidator.js";
import { authCheck } from "../middlewares/auth.js";
import { signUp, signIn, genRefreshToken, getUser, deletAllUser } from "../controllers/userController.js";

// ==================== Routing ==================== //

const userRouter = (app, endpoint) => {
    // 회원가입 벨리데이션
    // app.use(`${endpoint}`, validateUserCreate);
    app.route(`${endpoint}`).post(validateUserCreate, signUp);
    app.route(`${endpoint}/login`).post(signIn);
    
    // access token을 refresh token 기반으로 재발급
    app.route(`${endpoint}/refresh`).post(genRefreshToken);
    
    // 자기 정보 얻어오기
    app.use(`${endpoint}/:id`, authCheck);
    app.route(`${endpoint}/:id`).get(getUser);
    
    // all 삭제하기
    app.route(`${endpoint}/dump`).delete(deletAllUser); 
};

export default userRouter;