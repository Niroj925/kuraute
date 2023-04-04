import {Router } from 'express';
import ChatController from '../controller/chatController.js';
import { validateToken } from '../middleware/validateToken.js';

const chatRouter=Router();

const chatController=new ChatController();

chatRouter.get('/',validateToken, chatController.fetchChats);
chatRouter.post('/',validateToken, chatController.accessChats);
chatRouter.post('/group',validateToken, chatController.createGroupChat);
chatRouter.put('/rename',validateToken, chatController.renameGroup);
chatRouter.put('/groupremove',validateToken, chatController.removeFromGroup);
chatRouter.put('/groupadd',validateToken, chatController.addToGroup);

export default chatRouter;