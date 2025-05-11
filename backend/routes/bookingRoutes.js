const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User"); // Import User model
const Event = require("../models/Event"); // Import Event model

// POST route to handle event booking
router.post("/", async (req, res) => {
  console.log("Request received from frontend:");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  try {
    const { eventId, userId, ticketType } = req.body;

    // Fetch user with populated bookedEvents (for debugging/logging)
    const user1 = await User.findById(userId).populate("profile.bookedEvents");
    console.log("USER BOOKED EVENTS:", user1.profile.bookedEvents);

    // Find the event by eventId
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a booking in the database
    const booking = await Booking.create({
      eventId,
      userId,
      ticketType,
      paymentStatus: "Pending", // Keep as is or update based on new flow
      bookingStatus: "Pending",
    });

    // Add event to user's bookedEvents array
    user.profile.bookedEvents.push(eventId);

    // Save the updated user document
    await user.save();

    // Return success response without Stripe
    res.status(201).json({
      message: "Booking created successfully",
      bookingId: booking._id,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
