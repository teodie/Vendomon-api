import express from "express";
const vendoRouter = express.Router()
import { getAllVendo, createNewVendo, updateVendoName, deleteVendo, getVendo } from "../controller/vendoController.js"

vendoRouter.route('/')
.get(getAllVendo)
.post(createNewVendo)

vendoRouter.route('/:vendoId')
.get(getVendo)
.patch(updateVendoName)
.delete(deleteVendo)


export default vendoRouter