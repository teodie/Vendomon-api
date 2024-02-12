import { logEvents } from "./logger.js";

export const errorHandler = (err, req, res, next) => {
  const errorMessage = `${err.name}: ${err.errorMessage}\t${req.method}\t${req.url}\t${req.headers.origin}`
  logEvents(errorMessage, "errLog.log")
  console.log(err.stack)

  const status = res.statusCode ? res.statusCode : 500 ;

  res.status(status).json({message : err.message})
}