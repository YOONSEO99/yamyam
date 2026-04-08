const Lesson = require("../models/lesson");

exports.getAllLessons = async (req, res) => {
  try {
    const { keyword, category } = req.query;
    let searchQuery = {};

    if (category && category !== "all") {
      searchQuery.category = category;
    }
    if (keyword) {
      searchQuery.title = { $regex: keyword, $options: "i" };
    }

    const lessons = await Lesson.find(searchQuery);
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id).populate(
      "instructorId",
      "nickname bio",
    );
    if (!lesson) {
      return res.status(404).json({ message: "Lesson Not Found" });
    }
    console.log(
      `[GET] Lesson fetched with Instructor: ${lesson.instructorId?.nickname}`,
    );
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyLessons = async (req, res) => {
  try {
    const { instructorId } = req.query;
    let query = {};
    if (instructorId) {
      query = { instructorId: instructorId };
    }
    const lessons = await Lesson.find(query).sort({ createdAt: -1 });
    console.log(
      `[GET] Lessons fetched. Filter by instructor: ${instructorId || "None"}`,
    );
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
