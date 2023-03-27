import express from 'express';
import { getFeedPosts, getUserPosts, likePost } from '../controllers/posts.js';
import { verifyToken } from '../middlewares/auth.js';

const posts = express.Router();

// READ //
posts.get('/', verifyToken, getFeedPosts);
posts.get('/:userId/posts', verifyToken, getUserPosts);

// UPDATE //
posts.patch('/:id/like', verifyToken, likePost);

export default posts;
