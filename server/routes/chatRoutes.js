import express from "express";
const router = express.Router();

import {
  sendMessage,
  getMessages,
  getChats,
  createChat
} from "../controllers/chatController.js";

import {
  authorizeOwnerUser,
  authorizeTenantUser,
} from "../middleware/userAuthorization.js";

// Middleware to allow both owner and tenant
const authorizeUser = (req, res, next) => {
  authorizeOwnerUser(req, res, (err) => {
    if (!err && req.user) return next();
    authorizeTenantUser(req, res, next);
  });
};

/**
 * @description Create or get existing chat between users
 * @route POST /api/chat
 */
router.post("/", authorizeUser, createChat);

/**
 * @description send message route for owner user
 * @route POST /api/chat/owner/send-message
 */
router.post("/owner/send-message", authorizeOwnerUser, sendMessage);

/**
 * @description get all messages route for owner user
 * @route POST /api/chat/owner/get-messages
 */
router.post("/owner/get-messages", authorizeOwnerUser, getMessages);

/**
 * @description send message route for tenant user
 * @route POST /api/chat/tenant/send-message
 */
router.post("/tenant/send-message", authorizeTenantUser, sendMessage);

/**
 * @description get all messages route for tenant user
 * @route POST /api/chat/tenant/get-messages
 */
router.post("/tenant/get-messages", authorizeTenantUser, getMessages);

/**
 * @description get all chats for owner user
 * @route GET /api/chat/owner/get-chats
 */
router.get("/owner/get-chats", authorizeOwnerUser, getChats);

/**
 * @description get all chats for tenant user
 * @route GET /api/chat/tenant/get-chats
 */
router.get("/tenant/get-chats", authorizeTenantUser, getChats);

export default router;
