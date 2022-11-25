const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    username: {
      type: String,
      required: [true, "Name is required."],
    },
    currentLocation: String,

    imageUser: {
      type: String,
      default: 'https://res.cloudinary.com/dwjj0oqwe/image/upload/v1669287272/Inserir_um_subt%C3%ADtulo_drgykr.png',
    },
    aboutUser: {
      type: String,
      default: ' ',
    },
    nextCities: [{
      type: Schema.Types.ObjectId, ref: "City",
    }],
    comments: [{
      type: Schema.Types.ObjectId, ref: "Comment",
    }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
