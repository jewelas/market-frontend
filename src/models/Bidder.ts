import mongoose from 'mongoose';

const BidderSchema = new mongoose.Schema(
  {
    media_id: {
      type: String,
    },
    bidder: {
      type: String,
    },
    price: {
      type: String,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true},
);

export default mongoose.models.Bidder || mongoose.model('Bidder', BidderSchema);
