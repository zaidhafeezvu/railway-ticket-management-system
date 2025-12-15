const Ticket = require('../models/Ticket');
const Train = require('../models/Train');

// @desc    Book a ticket
// @route   POST /api/tickets
// @access  Private
exports.bookTicket = async (req, res) => {
  try {
    const {
      trainId,
      passengerName,
      passengerAge,
      passengerGender,
      classType,
      journeyDate,
      source,
      destination
    } = req.body;

    // Check if train exists
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ success: false, message: 'Train not found' });
    }

    // Find the class and check availability
    const trainClass = train.classes.find(c => c.type === classType);
    if (!trainClass) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    if (trainClass.availableSeats <= 0) {
      return res.status(400).json({ success: false, message: 'No seats available' });
    }

    // Generate seat number
    const seatNumber = `${classType.toUpperCase()}-${trainClass.totalSeats - trainClass.availableSeats + 1}`;

    // Create ticket
    const ticket = await Ticket.create({
      user: req.user._id,
      train: trainId,
      passengerName,
      passengerAge,
      passengerGender,
      classType,
      seatNumber,
      bookingDate: Date.now(),
      journeyDate,
      source,
      destination,
      price: trainClass.price
    });

    // Update available seats
    trainClass.availableSeats -= 1;
    await train.save();

    const populatedTicket = await Ticket.findById(ticket._id).populate('train', 'trainNumber trainName');

    res.status(201).json({
      success: true,
      data: populatedTicket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private
exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .populate('train', 'trainNumber trainName source destination departureTime arrivalTime')
      .sort('-createdAt');

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('train', 'trainNumber trainName source destination departureTime arrivalTime');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Make sure user owns ticket or is admin
    if (ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel ticket
// @route   PUT /api/tickets/:id/cancel
// @access  Private
exports.cancelTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Make sure user owns ticket
    if (ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (ticket.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Ticket already cancelled' });
    }

    // Update ticket status
    ticket.status = 'cancelled';
    await ticket.save();

    // Restore seat availability
    const train = await Train.findById(ticket.train);
    const trainClass = train.classes.find(c => c.type === ticket.classType);
    trainClass.availableSeats += 1;
    await train.save();

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all tickets (Admin)
// @route   GET /api/tickets/all
// @access  Private/Admin
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('user', 'name email')
      .populate('train', 'trainNumber trainName source destination')
      .sort('-createdAt');

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
