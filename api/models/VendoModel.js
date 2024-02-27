import mongoose from "mongoose";

const vendoSchema = mongoose.Schema(
  {
    userid: {
      type: String,
      required: [true, "Name is required!!"]
    },
    remote_link: {
      type: String,
    },
    vendo_name: {
      type: String,
      // required: [true, "Name is required!!"]
    },
    dashboard_name: {
      type: String,
      // required: true,
    },
    dashboard_password: {
      type: String,
      // required: [true, "Password is needed"]
    },
    ngrok_email: {
      type: String,
    },
    ngrok_password: {
      type: String
    },
    daily_sales: {
      type: String,
      default: "0.00"
    },
    device_temp: {
      type: String,
      default: "?"
    },
    online_users: {
      type: String,
      default: "0"
    },
    status: {
      type: String,
      default: "ok"
    },
    last_request_time: {
      type: String,
      default: "0"
    }

  },
  {
    timestamps: true,
    versionKey: false //Remove the __v
  }

)

const Vendo  =  mongoose.model('Vendo', vendoSchema)
export default Vendo