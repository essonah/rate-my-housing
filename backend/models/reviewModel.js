// models/reviewModel.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    dorm: { type: mongoose.Schema.Types.ObjectId, ref: 'Dorm', required: true },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;