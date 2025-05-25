// models/PDF.js
import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pdfurl: {
        type: String, 
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const PDF = mongoose.model('PDF', pdfSchema);
export default PDF;
