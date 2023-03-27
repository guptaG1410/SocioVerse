import express from 'express';
import {
  getUser,
  getUserFriend,
  addRemoveFriend,
} from '../controllers/user.js';
import { verifyToken } from '../middlewares/auth.js';

const user = express.Router();

// READ //
user.get('/:id', verifyToken, getUser);
user.get('/:id/friends', verifyToken, getUserFriend);

// UPDATE //
user.patch('/:id/:friendId', verifyToken, addRemoveFriend);

export default user;