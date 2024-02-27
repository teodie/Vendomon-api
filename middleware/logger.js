import { format } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import { access } from 'fs';
import path from "path";
import { promises as fsPromise } from "fs";

// Thise block of code is just for getting the current dirname
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


const logsFolderExist = (filePath) => {
  access(filePath, async (err) => {
    // create the directory if access throws a error
    try {
      err &&(await fsPromise.mkdir(filePath), console.log("logs folder created!")  )
    } catch (error) {
      console.log(error)
    } 
  })
} 

export const logEvents = async (message, logFileName) => {
  const uuid = uuidv4()
  const dateTime = `${format(new Date(), 'MM-dd-yyyy\tHH:mm:ss')}`
  const logItem = `${dateTime}\t${uuid}\t${message}\n`

  try {
    const logsPath = path.join(__dirname, '..', 'logs')
    logsFolderExist(logsPath)
    await fsPromise.appendFile(path.join(logsPath, logFileName), logItem)

  } catch (error) {
    console.log(error)
  }
}

export const logger = (req, res, next) => {
  const request_path = req.path;
  // This block of code is executed when the server is ready to send the response
  // Added just to capture the statuscode 
  res.on('finish', () => {

    const message = `${req.method}\t${request_path}\t${res.statusCode}\t${req.headers['user-agent']}\t${req.headers.origin}`
    logEvents(message, 'reqLog.log')

  });

  console.log(`${req.method} ${request_path}`)

  next()
}

