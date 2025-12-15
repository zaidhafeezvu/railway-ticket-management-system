const express = require('express');
const router = express.Router();
const {
  bookTicket,
  getUserTickets,
  getTicket,
  cancelTicket,
  getAllTickets
} = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, getUserTickets)
  .post(protect, bookTicket);

router.get('/all', protect, admin, getAllTickets);

router.route('/:id')
  .get(protect, getTicket);

router.put('/:id/cancel', protect, cancelTicket);

module.exports = router;
