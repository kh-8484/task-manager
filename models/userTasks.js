const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const UserTaskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  expectedDate: {
    type: String,
    required: true,
  },
  checked: false,
  createdBy: {
    type: ObjectId,
    ref: "User",
  },
});

mongoose.model("UserTasks", UserTaskSchema);
