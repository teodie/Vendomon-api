import express from "express";
const vendoRouter = express.Router()
import { getAllVendo, createNewVendo } from "../controller/vendoController.js"

vendoRouter.route('/')
.get(getAllVendo)
.post(createNewVendo)
.patch()
.delete()

export default vendoRouter