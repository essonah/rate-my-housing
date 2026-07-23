
// models/reviewModel.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  dorm: { type: mongoose.Schema.Types.ObjectId, ref: 'Dorm', required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: String },
  userEmail: { type: String },
  attributes: {
    cleanliness: Number,
    noise: Number,
    bathroom: Number,
    roomComfort: Number,
    location: Number,
    community: Number,
    wouldLiveAgain: String,
    vibe: String,
    pros: [String],
    cons: [String]
  }
});

reviewSchema.index(
  { dorm: 1, userId: 1 },
  { unique: true, partialFilterExpression: { userId: { $type: 'string' } } }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;