import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ==================== APP config Setting ==================== //

dotenv.config(); // add .env file 
const app = express();

// DB connection
const mongoInfo = JSON.parse(process.env.MONGO_INFO);
mongoose.connect(`mongodb://${mongoInfo.username}:${mongoInfo.password}@${mongoInfo.host}:${mongoInfo.port}/?authSource=${mongoInfo.role}&readPreference=primary`, {
    dbName: mongoInfo.database,
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => console.log("DB Connected!"))
    .catch(err => {
        console.log("DB Connection Error: " + err.message);
    });


app.use(logger("dev"));
app.use(express.json()); // body-parser setting ~ express include body-parser from 4.X version
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({ // app session 
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

// app.use(cors({  // CORS 설정
//     origin: true,
//     credentials: true
// }));

app.use(cors());

app.set("jwt-secret", process.env.JWT_SECRET); // set the secret key variable for jwt


// ==================== API Routing Setting ==================== //

import userRouter from "./src/routes/userRouter.js";
import matchingRouter from "./src/routes/matchingRouter.js";
import matchingDetailRouter from "./src/routes/matchingDetailRouter.js";
import datasRouter from "./src/routes/datasRouter.js";
import naverClovaRouter from "./src/routes/naverCloverSttRouter.js";

// router mapping
userRouter(app, "/api/user");
matchingRouter(app, "/api/matching");
matchingDetailRouter(app, "/api/matching-detail");
datasRouter(app, "/api/datas");
naverClovaRouter(app, "/api/stt");


// ==================== Other Config Setting ==================== //

app.route("/api/ping").get(async (req, res) => {
    return res.status(200).json({ "message": "success" });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) { next(createError(404)); });

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    return res.status(err.status || 500).json({
        message: err.message,
        error: err
    });
});


export default app;

