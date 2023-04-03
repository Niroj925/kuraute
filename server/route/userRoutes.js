import {Router } from 'express';
import AuthController from '../controller/control.js';
import { validateToken } from '../middleware/validateToken.js';

const router=Router();

const authController=new AuthController();


router.post('/register',authController.register);
router.post('/login',authController.authUser);
router.get('/',validateToken, authController.getAllUsers);


export default router;