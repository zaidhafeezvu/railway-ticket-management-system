const express = require('express');
const router = express.Router();
const {
  getTrains,
  getTrain,
  createTrain,
  updateTrain,
  deleteTrain
} = require('../controllers/trainController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(getTrains)
  .post(protect, admin, createTrain);

router.route('/:id')
  .get(getTrain)
  .put(protect, admin, updateTrain)
  .delete(protect, admin, deleteTrain);

module.exports = router;
