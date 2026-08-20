import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationCode?: string;
verificationCodeExpires?: Date;
  resetPasswordToken?: string;
resetPasswordTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

  verificationCode: {
  type: String,
},

verificationCodeExpires: {
  type: Date,
},

resetPasswordToken: {
  type: String,
},

resetPasswordTokenExpires: {
  type: Date,
},
 
  },
  {
    timestamps: true,
  }
);

const User =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;