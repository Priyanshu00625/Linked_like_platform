import { Router } from "express";
import {
  activeCheck,
  createPost,
  getAllPost,
  deletePost,
  commentPost,
  get_comments_by_post,
  delete_comment_of_user,
  increment_likes,
} from "../controllers/post.controller.js";
import multer from "multer";
const router = new Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
router.route("/get_post").get(activeCheck);
router.route("/post").post(upload.single("media"), createPost);
router.route("/posts").get(getAllPost);
router.route("/delete_post").post(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comments").delete(delete_comment_of_user);
router.route("/increment_likes").post(increment_likes);

export default router;
