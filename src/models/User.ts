import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, 'Creator address is required'],
    },
    name: {
      type: String,
    },
    username: {
      type: String,
    },
    bio: {
      type: String,
    },
    website: {
      type: String,
    },
    image_url: {
      type: String,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    owned_media: [{type: mongoose.Schema.Types.ObjectId, ref: 'Media'}],
  },
  {timestamps: true},
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
