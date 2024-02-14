import User from "../api/models/UserModel.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";


// @desc Get all users
// @route GET /users
// @access Private
export const getAllUsers = expressAsyncHandler(
  async (req, res) => {
    const users = await User.find({}).lean()
    console.log(!users?.length)
    if(!users?.length){
      return res.status(400).json({message: "No Users found!"});
    } 

    res.status(200).json(users) 
  }
 )

// @desc Create new users
// @route POST /users
// @access Private
export const createNewUser = expressAsyncHandler(
  async (req, res) => {
    const { Username, Password, Email } = req.body

    const duplicate = await User.findOne( {Username} ).lean().exec()

    if(duplicate){
      return res.status(409).json({message: "Duplicate username"})
    }
    // Hash Password
    const hashedpass = await bcrypt.hash(Password, 10) // Salt 10
    // Create and store new user
    const user = await User.create({Username, Email, Password:hashedpass})
    
    if(user){ // Created
      res.status(201).json({ message : `New user ${user.Username} created` })
    } else {
      res.status(400).json({message: 'invalid user data'})
    }
    
  }
 )

// @desc Update user
// @route PATCH /users
// @access Private
export const updateUser = expressAsyncHandler(
  async (req, res) => {
    const { id , Username, Email, Password } = req.body

    if(!id || !Username || !Password || !Email){
      return res.status(400).json({message: 'All fields are required'})
    }

    const user = await User.findById(id).exec()

    // Check User 
    if(!user){
      return res.status(400).json({message: 'User not found'})
    }

    // Check for Duplicate
    const duplicate = await User.find({ Username }).lean().exec()
    // Allow updates for the original user
    if(!duplicate && duplicate._id.toString() !== id){
      return res.send(409).json({message: 'Duplicate username'})
    }
    // set the username and email
    user.Username = Username
    user.Email = Email
    // set the password
    if(Password){
      user.Password = await bcrypt.hash(Password, 10) // salt rounds
    }

    // Save the set values
    const updateuser = await user.save()

    res.json({message: `${updateuser.Username} updated`})

  }
 )

// @desc Delete user
// @route DELETE /users
// @access Private
export const deleteUser = expressAsyncHandler(
  async (req, res) => {
        // Don't Have any reason to delete user since this will be used in the app
  }
 )

