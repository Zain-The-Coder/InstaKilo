import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    fullName: {
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
      minlength: 6,
      select: false, // query mein by default na aaye
    },
    profilePicture: {
      type: String,
      default: '', // Cloudinary/S3 URL
    },
    bio: {
      type: String,
      maxlength: 150,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    },

    // Relationships
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ],

    // Content
    posts: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    ],
    savedPosts: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    ],

    // Account settings
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // Auth-related
    refreshToken: {
      type: String,
      default: '',
    },
    resetOTP: {
      type: String,
      select: false,
    },
    resetOTPExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true } // createdAt, updatedAt auto
);

// Password hash karne ke liye pre-save hook
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Login ke time password compare karne ke liye method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
