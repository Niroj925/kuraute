import {Router } from 'express';
import AuthController from '../controller/control.js';

const router=Router();

const authController=new AuthController();


router.post('/register',authController.register);
router.post('/login',authController.authUser);


export default router;