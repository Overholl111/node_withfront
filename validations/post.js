import {body} from "express-validator";

export const postCreateValidation = [
    body('title', 'Input title').isLength({min: 3}).isString(),
    body('text', 'Input text').isLength({min: 10}).isString(),
    body('tags', 'Wrong format').isLength({min: 10}).optional().isArray(),
    body('imageUrl', 'Url is not valid').isLength({min: 10}).optional().isString(),
];