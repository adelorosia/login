import mongoose from "mongoose";

import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  gender: {
    type: String,
  },
  profile_photo: {
    type: String,
    default: function () {
      if (this.gender==="true") {
        return "https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png";
      } else {
        return "https://cdn-icons-png.flaticon.com/512/219/219969.png";
      }
    },
  },
  refresh_token: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
