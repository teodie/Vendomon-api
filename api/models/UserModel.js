import { model, Schema } from "mongoose";

const userSchema = Schema(
  {
    Username: {
      type: String,
    },
    Email: {
      type: String,
    },
    Password: {
      type: String,
    }
  },
  {
    timestamps: true,
    versionKey: false //Remove the __v
  }
);

const User = model('User', userSchema)
export default User;