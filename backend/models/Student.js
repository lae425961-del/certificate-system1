const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  birthDay:   { type: Number, required: true, min: 1, max: 31 },
  birthMonth: { type: Number, required: true, min: 1, max: 12 },
  birthYear:  { type: Number, required: true, min: 1900 },
  village:  { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  province: { type: String, required: true, trim: true },
}, { timestamps: true });
studentSchema.index({ province: 1, district: 1 });
module.exports = mongoose.model('Student', studentSchema);
