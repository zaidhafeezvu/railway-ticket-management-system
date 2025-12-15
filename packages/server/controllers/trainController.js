const Train = require('../models/Train');

// @desc    Get all trains
// @route   GET /api/trains
// @access  Public
exports.getTrains = async (req, res) => {
  try {
    const { source, destination } = req.query;
    let query = { active: true };

    if (source) query.source = new RegExp(source, 'i');
    if (destination) query.destination = new RegExp(destination, 'i');

    const trains = await Train.find(query);
    res.json({
      success: true,
      count: trains.length,
      data: trains
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single train
// @route   GET /api/trains/:id
// @access  Public
exports.getTrain = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    
    if (!train) {
      return res.status(404).json({ success: false, message: 'Train not found' });
    }

    res.json({
      success: true,
      data: train
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create train
// @route   POST /api/trains
// @access  Private/Admin
exports.createTrain = async (req, res) => {
  try {
    const train = await Train.create(req.body);
    res.status(201).json({
      success: true,
      data: train
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update train
// @route   PUT /api/trains/:id
// @access  Private/Admin
exports.updateTrain = async (req, res) => {
  try {
    const train = await Train.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!train) {
      return res.status(404).json({ success: false, message: 'Train not found' });
    }

    res.json({
      success: true,
      data: train
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete train
// @route   DELETE /api/trains/:id
// @access  Private/Admin
exports.deleteTrain = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);

    if (!train) {
      return res.status(404).json({ success: false, message: 'Train not found' });
    }

    await train.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
