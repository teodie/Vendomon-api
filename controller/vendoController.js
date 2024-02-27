import Vendo from "../api/models/VendoModel.js"
import expressAsyncHandler from "express-async-handler";
import Cryptr from "cryptr";
import 'dotenv/config'
const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);

// @desc Get all Vendo
// @method GET /vendo
// @access
export const getAllVendo = expressAsyncHandler(async (req, res) => {
// Get all the vendo from the database
const vendos = await Vendo.find({}).select('-ngrok_password -dashboard_password').lean().exec()
// Check if there is data found
if(!vendos?.length){
  return res.status(400).json({message: "No vendo found"})
}
// respond with the vendo data
res.status(200).json(vendos)
}
) 


// @desc Create new Vendo
// @method CREATE /vendo
// @access
export const createNewVendo = expressAsyncHandler(async (req, res) => {
  const {userid,
      remote_link,
      vendo_name,
      dashboard_name,
      dashboard_password,
      ngrok_email,
      ngrok_password } = req.body
  
  if(!userid || !vendo_name || !remote_link || !dashboard_name || !ngrok_email || !dashboard_password || !ngrok_password) {
    return res.send(400).json({message: "All fields are required"})
  }


  // Check for duplicate
  const duplicate = await Vendo.findOne({ ngrok_email }).lean().exec()

  // If the findOne cant find it will return null
  if(duplicate){
    return res.status(409).json({message: "Ngrok has been Taken"})
  } 

  // TODO
  // Encrypt the password before saving
  const encryptedDashPass = cryptr.encrypt(dashboard_password);   
  const encryptedNgrokPass = cryptr.encrypt(ngrok_password);
  
  console.log(`Encrypted passwords ${encryptedDashPass} and ${encryptedNgrokPass}`);

  
  // Create an object for new entry
  const vendoObject = {userid, remote_link, vendo_name, dashboard_name, ngrok_email, dashboard_password : encryptedDashPass, ngrok_password : encryptedNgrokPass}

  // Push the data to the database
  const vendo = await Vendo.create(vendoObject);
  // Check if the vendo is created
  if(vendo){
    res.status(201).json({message: `New ${vendo.vendo_name} has been created`})
  } else {
    res.status(400).json({message: 'Invalid vendo data'})
  }
  
}
) 


// @desc Update Vendo
// @method PATCH /vendo
// @access
export const updateVendo = expressAsyncHandler(async (req, res) => {

}
) 


// @desc delete Vendo
// @method DELETE /vendo
// @access
export const deleteVendo = expressAsyncHandler(async (req, res) => {

}
) 





