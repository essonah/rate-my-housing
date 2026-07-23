import mongoose from 'mongoose';

const dormSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    amenities: [String],
    rating: Number,
    location: String,
    imageUrl: String,
    images: [String],
    facts: mongoose.Schema.Types.Mixed

});

const Dorm = mongoose.model('Dorm', dormSchema);
export default Dorm;