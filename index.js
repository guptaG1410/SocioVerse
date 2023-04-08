import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { register } from './controllers/auth.js';
import { verifyToken } from './middlewares/auth.js';
import { createPost } from './controllers/posts.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/posts.js';
import User from './models/User.js';
import Post from './models/Posts.js';
import { users, posts } from './data/index.js';

// CONFIGURATIONS //

const __fileName = fileURLToPath(import.meta.url); //Need to do only when type is module//
const __dirName = path.dirname(__fileName);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(bodyParser.urlencoded({ limit: '39mb', extended: true }));
app.use(bodyParser.json({ limit: '39mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirName, 'public/assets')));

// FILE STORAGE //
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// ROUTES WITH FILES//
// --------Using this route in index.js because we want to use "upload" in this route.
app.post('/auth/register', upload.single('picture'), register);
app.post('/posts', verifyToken, upload.single('picture'), createPost);

// ROUTES //
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// Serve static assets in production.
app.use(express.static('client/build'));

app.get('*', function (req, res) {
  const index = path.join(__dirName, 'build', 'index.html');
  res.sendFile(index);
});

// MONGODB SETUP //
const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);

      // ADD ONLY ONE TIME WHILE FEEDING MONGODB DATA //
      //   User.insertMany(users);
      //   Post.insertMany(posts);
    })
  )
  .catch((err) => {
    console.log(`${err} didn't connect !!!`);
  });
