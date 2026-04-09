const Lesson = require("../models/lesson");
const User = require("../models/user");

function isPublicLessonStatus(status) {
  if (status === "draft") return false;
  return true;
}

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

    const lessons = await Lesson.find(searchQuery).populate(
      "instructorId",
      "nickname bio",
    );
    const publicOnly = lessons.filter((l) => isPublicLessonStatus(l.status));
    res.status(200).json(publicOnly);
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
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyDashboardLessons = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const enrolledIds = user.enrolledLessonIds || [];

    const enrolledLessons =
      enrolledIds.length > 0
        ? await Lesson.find({
            _id: { $in: enrolledIds },
            deletedAt: null,
          })
        : [];

    const enrolledPublic = enrolledLessons.filter((l) =>
      isPublicLessonStatus(l.status),
    );

    const teachingLessons = await Lesson.find({
      instructorId: userId,
      deletedAt: null,
    }).sort({ createdAt: -1 });

    const byId = new Map();
    for (const l of teachingLessons) {
      byId.set(l._id.toString(), l);
    }
    for (const l of enrolledPublic) {
      byId.set(l._id.toString(), l);
    }

    const merged = Array.from(byId.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    res.status(200).json(merged);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.enrollInLesson = async (req, res) => {
  try {
    const { id: lessonId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson || lesson.deletedAt) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    if (!isPublicLessonStatus(lesson.status)) {
      return res
        .status(400)
        .json({ message: "This class is not open for enrollment" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.enrolledLessonIds) {
      user.enrolledLessonIds = [];
    }

    const already = user.enrolledLessonIds.some(
      (lid) => lid.toString() === lessonId,
    );
    if (already) {
      return res.status(200).json({
        message: "Already enrolled",
        enrolledLessonIds: user.enrolledLessonIds.map((x) => x.toString()),
      });
    }

    user.enrolledLessonIds.push(lesson._id);
    user.markModified("enrolledLessonIds");
    await user.save();

    res.status(200).json({
      message: "Enrolled successfully",
      enrolledLessonIds: user.enrolledLessonIds.map((x) => x.toString()),
    });
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
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    if (lesson.instructorId.toString() !== String(userId)) {
      return res
        .status(403)
        .json({ message: "Only the lesson owner can delete this lesson" });
    }
    await Lesson.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFavouriteLessons = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const favoriteIds = user.favoriteLessonIds || [];
    const favoriteLessons = await Lesson.find({
      _id: { $in: favoriteIds },
    }).sort({ createdAt: -1 });

    res.status(200).json(favoriteLessons);
  } catch (error) {
    console.error("error loading favorites: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.toggleFavourite = async (req, res) => {
  try {
    const { id: lessonId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    if (!user.favoriteLessonIds) {
      user.favoriteLessonIds = [];
    }

    const isAlreadyFavourited = user.favoriteLessonIds.includes(lessonId);

    if (isAlreadyFavourited) {
      user.favoriteLessonIds = user.favoriteLessonIds.filter(
        (id) => id !== lessonId,
      );
    } else {
      user.favoriteLessonIds.push(lessonId);
    }

    user.markModified("favoriteLessonIds");
    await user.save();

    res.status(200).json({
      message: isAlreadyFavourited
        ? "Removed from favourites"
        : "Added to favourites",
      isFavourited: !isAlreadyFavourited,
    });
  } catch (error) {
    console.error("toggle error: ", error);
    res.status(500).json({ message: "Server error" });
  }
};
