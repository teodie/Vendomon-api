import express from "express";
const userRouter = express.Router()
import { getAllUsers, createNewUser, updateUser, deleteUser } from "../controller/usersController.js";

 userRouter.route('/')
              .get(getAllUsers)
              .post(createNewUser)
              .patch(updateUser)
              .delete(deleteUser)

export default userRouter