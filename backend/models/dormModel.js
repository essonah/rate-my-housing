import mongoose from 'mongoose';

const dormSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    amenities: [String],
    location: String,
    imageUrl: String
    
});

const Dorm = mongoose.model('Dorm', dormSchema);
export default Dorm;