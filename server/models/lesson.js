const mongoose = require("moongoose");

const lessonSchema = new mongoose.Schema(
  {
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    city: { type: String, required: true },
    streetName: { type: String, required: true },
    streetNumber: { type: String, required: true },
    unitNumber: { type: String },
    postalCode: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    maxCapacity: { type: Number, required: true },
    currentBookings: { type: Number, default: 0 },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    studentsCount: { type: Number, default: 0 },
    status: { type: String, default: "active" }, // e.q. 'active', 'closed'
    deletedAt: { type: Date, default: null }, // Soft delete
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Lesson", lessonSchema);
