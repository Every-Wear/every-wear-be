"use strict";

/**
 * @desc    - user body값 유효성 검사 조지기
 * @target  - UsersDTO
 */
import { check, validationResult } from "express-validator";


export const validateUserCreate = [
    check("name")
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage("User name can not be empty!")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Minimum 3 characters required in User name!")
        .bail(),
    check("userId")
        .trim()
        .not()
        .isEmpty()
        .withMessage("User ID can not be empty!")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Minimum 3 characters required in User id!")
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
        next();
    },
];
