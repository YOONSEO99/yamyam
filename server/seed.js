const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/user");
const Lesson = require("./models/lesson");

const MONGO_URI = process.env.MONGO_URI;

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);

    await User.deleteMany({});
    await Lesson.deleteMany({});

    const mockInstructor = new User({
      email: "rachel@example.com",
      password: "password123",
      firstName: "Rachel",
      lastName: "Lee",
      birthDate: "1995-01-01",
      nickname: "DevRachel",
      bio: "Full stack developer and passionate IT instructor.",
      isInstructor: true,
      role: "instructor",
    });

    const savedInstructor = await mockInstructor.save();

    const mockLessons = [
      {
        instructorId: savedInstructor._id,
        title: "Beginner's Guide to Angular 19",
        description:
          "Complete your frontend portfolio using the latest Signals and Control Flow.",
        category: "IT·Programming",
        city: "Vancouver",
        streetName: "Robson St",
        streetNumber: "1234",
        postalCode: "V6E 1C1",
        startDate: "2026-05-01",
        startTime: "18:00",
        endTime: "20:00",
        maxCapacity: 10,
        price: 55000,
      },
      {
        instructorId: savedInstructor._id,
        title: "Modern JavaScript for Practical Use",
        description:
          "Clear up confusing concepts like closures, event objects, and Fetch API.",
        category: "IT·Programming",
        city: "Vancouver",
        streetName: "Water St",
        streetNumber: "321",
        postalCode: "V6B 1A4",
        startDate: "2026-05-15",
        startTime: "19:00",
        endTime: "21:00",
        maxCapacity: 5,
        price: 45000,
      },
    ];

    await Lesson.insertMany(mockLessons);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedDB();
