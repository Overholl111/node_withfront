import multer from 'multer';
import { registerValidation, loginValidation, postCreateValidation } from '../validations/index.js';
import checkAuth from '../utils/checkAuth.js';
import { UserController, PostController } from '../controllers/index.js'
import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path'

let picName;

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, './tmp');
    }, 
    filename: (req, file, cb) => {
        picName = Date.now() + '-' + file.originalname;
        cb(null, picName);
    }, 
});

const upload = multer({ storage });

const router = new Router();


//User routs
router.post('/auth/register', registerValidation, UserController.register);
router.post('/auth/login', loginValidation, UserController.login);
router.get("/auth/me",checkAuth, UserController.getMe)

//Post routs
router.get('/posts', PostController.getAll);
router.get('/posts/:id', PostController.getOne);
router.get('/posts/tags', PostController.getLastTags);
router.post('/posts',checkAuth, postCreateValidation, PostController.create);
router.put('/posts/:id',checkAuth, PostController.comment);
router.get('/posts/:id/comments', PostController.getComments);
router.delete('/post/:id/:commId', checkAuth, PostController.removeComment);

router.patch('/posts/:id', PostController.update);
router.delete('/posts/:id', PostController.removePost);


router.post('/tmp', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url:`/tmp/${picName}`
    });

});
router.put('/tmp/', async (req, res) => {
    const source = (`./tmp/${req.body.url}`)
    const dest = (`./uploads/${req.body.url}`);


    await fs.rename(source, dest);

    res.json(dest);
})


export default router;