require('dotenv').config();
const mongoose = require('mongoose');
const Train = require('../models/Train');
const connectDB = require('../config/db');

// Sample train data
const trains = [
  {
    trainNumber: '12301',
    trainName: 'Rajdhani Express',
    source: 'New Delhi',
    destination: 'Mumbai',
    departureTime: '16:55',
    arrivalTime: '08:35',
    classes: [
      { type: 'sleeper', availableSeats: 72, totalSeats: 72, price: 850 },
      { type: '3ac', availableSeats: 64, totalSeats: 64, price: 1450 },
      { type: '2ac', availableSeats: 48, totalSeats: 48, price: 2050 },
      { type: '1ac', availableSeats: 24, totalSeats: 24, price: 3500 },
    ],
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    active: true,
  },
  {
    trainNumber: '12302',
    trainName: 'Shatabdi Express',
    source: 'Chennai',
    destination: 'Bangalore',
    departureTime: '06:00',
    arrivalTime: '11:30',
    classes: [
      { type: '3ac', availableSeats: 48, totalSeats: 48, price: 950 },
      { type: '2ac', availableSeats: 32, totalSeats: 32, price: 1350 },
      { type: '1ac', availableSeats: 16, totalSeats: 16, price: 2200 },
    ],
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    active: true,
  },
  {
    trainNumber: '12303',
    trainName: 'Duronto Express',
    source: 'Kolkata',
    destination: 'New Delhi',
    departureTime: '22:20',
    arrivalTime: '10:30',
    classes: [
      { type: 'sleeper', availableSeats: 80, totalSeats: 80, price: 720 },
      { type: '3ac', availableSeats: 56, totalSeats: 56, price: 1250 },
      { type: '2ac', availableSeats: 40, totalSeats: 40, price: 1800 },
    ],
    days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
    active: true,
  },
  {
    trainNumber: '12304',
    trainName: 'Garib Rath',
    source: 'Jaipur',
    destination: 'Mumbai',
    departureTime: '18:30',
    arrivalTime: '08:00',
    classes: [
      { type: 'sleeper', availableSeats: 90, totalSeats: 90, price: 650 },
      { type: '3ac', availableSeats: 72, totalSeats: 72, price: 980 },
    ],
    days: ['Tuesday', 'Thursday', 'Saturday'],
    active: true,
  },
  {
    trainNumber: '12305',
    trainName: 'Vande Bharat Express',
    source: 'New Delhi',
    destination: 'Varanasi',
    departureTime: '06:00',
    arrivalTime: '14:00',
    classes: [
      { type: '2ac', availableSeats: 56, totalSeats: 56, price: 1650 },
      { type: '1ac', availableSeats: 32, totalSeats: 32, price: 2950 },
    ],
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    active: true,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing trains
    await Train.deleteMany({});
    console.log('Cleared existing trains');

    // Insert sample trains
    const createdTrains = await Train.insertMany(trains);
    console.log(`✅ Successfully seeded ${createdTrains.length} trains`);

    console.log('\nSample trains:');
    createdTrains.forEach((train) => {
      console.log(`- ${train.trainName} (${train.trainNumber}): ${train.source} → ${train.destination}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
