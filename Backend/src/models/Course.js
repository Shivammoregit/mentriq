const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },
    category: { type: String },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },
    price: { type: Number, default: 0 },
    duration: { type: String },
    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Online"
    },
    instructor: {
      type: String,
      default: "MentriQ Team"
    },
    modules: {
      type: [String],
      default: []
    },
    thumbnailUrl: {
      type: String,
      default: "/images/learning4.jpg"
    },
    syllabusUrl: {
      type: String,
      default: ""
    },
    brochureUrl: {
      type: String,
      default: ""
    },
    brochureImageUrl: {
      type: String,
      default: ""
    },
    discount: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

courseSchema.virtual("finalPrice").get(function () {
  return this.price - (this.price * this.discount / 100);
});
module.exports = mongoose.model("Course", courseSchema);
