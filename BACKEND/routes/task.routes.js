const express = require('express')

const router = express.Router()

const Task = require('../models/task.model.js')

const authMiddleware = require('../middleware/auth')


/*
================ CREATE TASK =================

Protected Route:
Only logged-in users can create tasks

Flow:
1. Frontend sends task data
2. Middleware verifies token
3. req.user.id received from decoded token
4. Create task linked to that user
5. Save task in MongoDB
*/

router.post('/', authMiddleware, async (req, res) => {

  try {

    // Extract task data from frontend
    const {
      title,
      description,
      priority,
      status,
      deadline
    } = req.body

    // User id comes from auth middleware
    const userId = req.user.id

    // Create new task document
    const task = await new Task({

      title,
      description,
      priority,
      userId,
      status,
      deadline
    })

    // Save task in DB
    await task.save()

    res.status(201).json({
      message: "Task created successfully"
    })

  }

  catch (err) {

    res.status(500).send({
      message: "Server Error."
    })
  }
})



/*
================ GET ALL TASKS =================

Flow:
1. GET request arrives
2. Middleware verifies token
3. req.user.id extracted
4. Find tasks belonging to that user
5. Send tasks back to frontend

GET request usually does not need body data
*/

router.get('/', authMiddleware, async (req, res) => {

  try {

    // Fetch tasks only for logged-in user
    const tasks = await Task.find({
      userId: req.user.id
    })

    res.status(200).json({

      message: "Tasks fetched successfully",

      tasks
    })

  }

  catch (err) {

    res.status(500).send({
      message: "Can not fetch details."
    })
  }

})



/*
================ DELETE TASK =================

Flow:
1. Middleware verifies token
2. Find task using:
   - task id
   - logged-in user's id
3. Delete matching task
4. Send response
*/

router.delete('/:id', authMiddleware, async (req, res) => {

  try {

    const task = await Task.findOneAndDelete({

      // Task id from URL params
      _id: req.params.id,

      // Ensure user owns the task
      userId: req.user.id
    })

    // Task not found
    if (!task) {

      return res.status(401).json({
        message: "Task not found."
      })
    }

    res.status(200).json({
      message: "Task deleted successfully"
    })
  }

  catch (err) {

    res.status(500).send({
      message: "Can not delete."
    })
  }

})



/*
================ UPDATE TASK =================

Flow:
1. Middleware verifies token
2. Find task using task id + user id
3. Update task fields
4. Return updated task
*/

router.patch('/:id', authMiddleware, async (req, res) => {

  try {

    const task = await Task.findOneAndUpdate(

      {
        _id: req.params.id,

        // Ensure task belongs to logged-in user
        userId: req.user.id
      },

      // Updated data from frontend
      req.body,

      // Return updated document
      { new: true }
    )

    if (!task) {

      return res.status(404).json({
        message: 'Task not found'
      })
    }

    res.status(200).json({

      message: 'Task updated successfully',

      task
    })

  }

  catch (err) {

    res.status(500).json({
      message: 'Cannot update task'
    })
  }
})

module.exports = router



/*
Why middleware is used here?

Task routes are protected routes.

Only authenticated users should:
- create tasks
- view tasks
- update tasks
- delete tasks

So token verification is required before CRUD operations.
*/


/*
req.user.id Flow:

Frontend Request
      ↓
Auth Middleware
      ↓
Token verified
      ↓
Decoded user data stored in req.user
      ↓
req.user.id available in route handler
      ↓
Task linked with correct user
*/


/*
Security Advantage:

Task.find({ userId: req.user.id })

This ensures:
- users can only access their own tasks
- one user cannot see another user's data
*/