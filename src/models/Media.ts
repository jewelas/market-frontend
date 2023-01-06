import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema(
  {
    metadata: {
      title: {
        type: String,
        required: [true, 'Media title is required'],
        maxlength: [40, 'Title cannot be more than 40 characters'],
      },
      description: {
        type: String,
        required: [true, 'Media description is required'],
      },
      mime_type: {
        type: String,
        required: [true, 'Media type is required'],
      },
    },
    media_id: {
      type: String,
      required: [true, 'Media media id is required'],
    },
    media_url: {
      type: String,
      required: [true, 'Media URI is required'],
    },
    metadata_url: {
      type: String,
    },
    creator_address: {
      type: String,
    },
    content_hash: {
      type: String,
    },
    metadata_hash: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true},
);

export default mongoose.models.Media || mongoose.model('Media', MediaSchema);
