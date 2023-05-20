
import { Router } from "express";
import { validateToken } from "../middleware/validateToken.js";
import MessageController from "../controller/messageController.js";

const messageRoute=Router();

const messageController=new MessageController();

messageRoute.post('/',validateToken,messageController.sendMessage);
messageRoute.get('/:chatId',validateToken,messageController.getMessage);
export default messageRoute;