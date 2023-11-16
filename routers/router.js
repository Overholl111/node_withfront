import { registerValidation, loginValidation, postCreateValidation } from '../validations/index.js';
import checkAuth from '../utils/checkAuth.js';
import { UserController, PostController, FileController } from '../controllers/index.js'
import { Router } from 'express';

const router = new Router();


//User routs
router.post('/auth/register', registerValidation, UserController.register);
router.post('/auth/login', loginValidation, UserController.login);
router.get("/auth/me",checkAuth, UserController.getMe)

//Post routs
router.get('/posts', PostController.getAll);
router.get('/posts/:id', PostController.getOne);
router.get('/tags', PostController.getLastTags);
router.get('/tags/:tag', PostController.getTag)
router.post('/posts',checkAuth, postCreateValidation, PostController.create);
router.put('/posts/:id',checkAuth, PostController.comment);
router.get('/posts/:id/comments', PostController.getComments);
router.delete('/posts/:id/:commId', checkAuth, PostController.removeComment);
router.patch('/posts/:id', PostController.update);
router.delete('/posts/:id', PostController.removePost);

//File routs
router.post('/tmp', FileController.uploadImage, FileController.getImageName);
router.delete('/tmp/', FileController.deleteFile);


export default router;