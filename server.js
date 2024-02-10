import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import { exec } from "child_process";
import Vendo from "./api/models/VendoModel.js";
import User from "./api/models/UserModel.js";

import 'dotenv/config'
import bcrypt from "bcrypt";
import { match } from "assert";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json())

app.post("/add", (req, res) => {

  const name = req.body.name
  // Execute the Python script
  const email = req.body.email
  const password = req.body.password
  const uname = req.body.uname
  const pass = req.body.pass
  const remotelink = req.body.remote_link

  console.log(`Saving ${name.replace(' ', '-')}, ${email}, ${password}, ${uname}, ${pass}, ${remotelink}`)

  const pythonProcess = exec(`python ./Python/AddnewData.py ${name.replace(' ', '-')} ${email} ${password} ${uname} ${pass} ${remotelink}`, (error, stdout, stderr) => {

    if (error) {
      console.error(`Error executing the Python script: ${error}`);
      return res.status(500).send('Internal Server Error');
    }

    // Send the stdout of the Python script as the response
    res.send(stdout)

  });

  // Handle any errors that occur while running the Python script
  pythonProcess.on('error', (err) => {
    console.error(`Error starting the Python script: ${err}`);
    res.status(500).send('Internal Server Error');
  });

});


app.post("/addVendo", async (req, res) => {

  try {
    const vendo = await Vendo.create(req.body)
    res.status(200).json(vendo)
  } catch (error) { console.log(error); res.status(500).json({ message: error.message }) }

});

app.post("/adduser", async (req, res) => {

  const Username = req.body.Username
  const Email = req.body.Email
  const hashedpass = await bcrypt.hash(req.body.Password, 10) // Salt 10

  try {
    const user = await User.create({Username, Email, Password:hashedpass})
    res.status(200).json(user)
  } 
  catch (error) 
  { console.log(error); res.status(500).json({ message: error.message }) }

});


app.post("/verify", async (req, res) => {

  try {
    // model.find({}) will return all the data
    const email = req.body.email.trim()
    const password = req.body.password.trim()

    // const users = await User.find({Email: email, Password: password})
    // // get the number of items in the collection

    const UserData = await User.find({ Email: email})

    // Check the the password is the same using the bcrypt.complere
    const match = await bcrypt.compare(password, UserData[0].Password)

    if (UserData.length === 1 && match) {
      console.log(`User ${email} logs in! Credentials Verified!`)
      res.status(200).json({verified: true,id: UserData[0]._id})
    } else {
      console.log("User doesnt exist!! or too many entries!")
      res.status(500).json({verified: false, message: "Either User dosnt exist or 2 or more duplicates" })
    }



  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }

});



app.post("/ngcheck", (req, res) => {

  // Execute the Python script
  const email = req.body.email
  const password = req.body.password

  console.log(email, password)

  const pythonProcess = exec(`python ./Python/Testngrokcredential.py ${email} ${password}`, (error, stdout, stderr) => {

    if (error) {
      console.error(`Error executing the Python script: ${error}`);
      return res.status(500).send('Internal Server Error');
    }

    (stdout.trimEnd() === "Error") ?
      console.log(`Wrong Username or Password!`) :
      console.log(`Credentials confirmed!`)

    // Send the stdout of the Python script as the response
    res.send(stdout)

  });

  // Handle any errors that occur while running the Python script
  pythonProcess.on('error', (err) => {
    console.error(`Error starting the Python script: ${err}`);
    res.status(500).send('Internal Server Error');
  });

});

app.post("/delete", async (req, res) => {

  const id = req.body.id

  console.log(id);

  try {
    await Vendo.findByIdAndDelete(id);
    res.status(200).send(`data with id {id} has been deleted.`)
  } catch (error) {
    res.status(500).json({message: error});
  }

});

app.post("/dashcheck", (req, res) => {

  // Execute the Python script
  const uname = req.body.uname
  const pass = req.body.pass
  const remotelink = req.body.remote_link

  console.log(uname, pass, remotelink)

  const pythonProcess = exec(`python ./Python/Testdashcredentials.py ${uname} ${pass} ${remotelink}`, (error, stdout, stderr) => {

    if (error) {
      console.error(`Error executing the Python script: ${error}`);
      return res.status(500).send('Internal Server Error');
    }

    console.log(stdout)

    // Send the stdout of the Python script as the response
    res.send(stdout)

  });

  // Handle any errors that occur while running the Python script
  pythonProcess.on('error', (err) => {
    console.error(`Error starting the Python script: ${err}`);
    res.status(500).send('Internal Server Error');
  });

});


app.post("/updatename", async (req, res) => {

  const id = req.body._id
  const new_name = req.body.new_name

  try {
    
    await Vendo.updateOne({_id: id},{$set: {vendo_name: new_name}})
    res.status(200).json({message: "successfull"})

  } catch (error) {
    res.status(500).json({message: error})
  }


});

app.get("/refresh", (req, res) => {
  // Execute the Python script
  const pythonProcess = exec('python ./Python/Updatedata.py', (error, stdout, stderr) => {

    if (error) {
      console.error(`Error executing the Python script: ${error}`);
      return res.status(500).send('Internal Server Error');
    }

    // Send the stdout of the Python script as the response
    console.log(stdout);
    res.send('Data Updated!');
  });

  // Handle any errors that occur while running the Python script
  pythonProcess.on('error', (err) => {
    console.error(`Error starting the Python script: ${err}`);
    res.status(500).send('Internal Server Error');
  });
});

// Mongodb
app.post("/api", cors(), async (req, res) => {
  
  const fetchtime = Date.now();  // Get the Date in epoch time so that i can subtract it
  const uid = req.body.userid

  try {
    
    // Update the database of last time of request
    await Vendo.updateMany({userid: uid } , {$set: {last_request_time: fetchtime}})

    // Find all vendo data that has the same user id
    const VendoData = await Vendo.find({ userid: uid })
    res.status(200).json(VendoData)

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ massage: error.message })
  }

});


mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Successfully connected to the server!!")
    // Strart the server once connected
    app.listen(PORT, () => console.log(`Server now runnong on ${PORT}!!`));
  })
  .catch((error) => {
    console.log(error)
  })

// app.listen(PORT, () => console.log(`Server now runnong on ${PORT}!!`));


