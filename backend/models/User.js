const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  // EMBEDDED DOCUMENT: profile
  profile: {
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=default'
    },
    bio: {
      type: String,
      default: '',
      maxlength: 300
    }
  },
  // EMBEDDED DOCUMENT: preferences
  preferences: {
    favoriteGenres: {
      type: [String],
      default: []
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
