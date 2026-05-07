const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "registered_at", updatedAt: false },
    versionKey: false,
  }
);

registrationSchema.index({ user_id: 1, event_id: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
