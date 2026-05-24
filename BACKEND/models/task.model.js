const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,//ObjectId = MongoDB 's unique ID type
    ref: 'User',//links id with particular user
    required: true
  },
  deadline: {
    type: Date,
  }

}, { timestamps: true })

const taskModel = mongoose.model('Task', taskSchema)
module.exports = taskModel