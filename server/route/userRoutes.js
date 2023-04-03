import {Router } from 'express';
import AuthController from '../controller/control.js';

const router=Router();

const authController=new AuthController();


router.post('/register',authController.register);
router.post('/login',authController.authUser);
router.get('/',authController.getAllUsers);


export default router;