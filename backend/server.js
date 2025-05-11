// server.js (or app.js)
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const sponsorRoutes = require("./routes/sponsorRoutes"); // Add this
//const passport = require("./passport"); // Passport configuration
const session = require("express-session");
//const authRoutes = require("./routes/authRoutes"); // Add Google auth routes
const profileRoutes = require("./routes/profileRoutes"); // Add this import
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const path = require("path");
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"));
const updateUser = async () => {
  try {
    const users = await User.find({});

    users.forEach(async (user) => {
      // Check if the user does not have the bookedEvents field, then add it
      if (!user.profile.bookedEvents) {
        user.profile.bookedEvents = [];
        await user.save();
      }
    });

    console.log("Users updated with bookedEvents field.");
  } catch (error) {
    console.error("Error updating users:", error);
  }
};

updateUser();
// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/sponsors", sponsorRoutes); // Add sponsor routes

app.use("/api/events", eventRoutes);
//app.use("/api/auth", authRoutes); // Use Google auth routes
// Use '/api/bookings' as the base route for booking-related endpoints
app.use("/api/bookings", bookingRoutes);

app.use("/api/profile", profileRoutes);
app.use(
  session({
    secret: "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",
    resave: false,
    saveUninitialized: true,
  })
);

//app.use(passport.initialize());
//app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
