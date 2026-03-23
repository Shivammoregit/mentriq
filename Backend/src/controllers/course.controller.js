const Course = require("../models/Course");
const Settings = require("../models/Settings");

const getCourses = async (req, res) => {
  try {
    const { category, level, minPrice, maxPrice } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    let courses = await Course.find(filter).sort({ createdAt: -1 });

    // Apply global discount if active
    const settings = await Settings.findOne();
    if (settings && settings.promo && settings.promo.isActive && settings.promo.endDate && new Date(settings.promo.endDate) > new Date()) {
      const discountRatio = (100 - settings.promo.discountPercentage) / 100;
      courses = courses.map(course => {
        const courseObj = course.toObject();
        courseObj.originalPrice = courseObj.price;
        courseObj.price = Math.round(courseObj.price * discountRatio);
        return courseObj;
      });
    }

    return res.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    let courseObj = course.toObject();
    
    // Apply global discount if active
    const settings = await Settings.findOne();
    if (settings && settings.promo && settings.promo.isActive && settings.promo.endDate && new Date(settings.promo.endDate) > new Date()) {
      const discountRatio = (100 - settings.promo.discountPercentage) / 100;
      courseObj.originalPrice = courseObj.price;
      courseObj.price = Math.round(courseObj.price * discountRatio);
    }

    return res.json(courseObj);
  } catch (error) {
    console.error("Get course by ID error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    return res.status(201).json(course);
  } catch (error) {
    console.error("Create course error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "A course with this slug already exists" });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

const seedCourses = async (req, res) => {
  try {
    console.log("🚀 Starting seed process...");

    const deleteResult = await Course.deleteMany({});
    console.log(`🗑 Deleted ${deleteResult.deletedCount} courses`);

    const sampleCourses = [
      {
        title: "Complete React Developer Bootcamp",
        slug: "react-bootcamp",
        description: "Master React, Next.js, Tailwind CSS & build production apps",
        category: "Web Development",
        level: "Intermediate",
        price: 4999,
        duration: "12 weeks",
        mode: "Online"
      },
      {
        title: "Java Full Stack Developer",
        slug: "java-fullstack",
        description: "Java fundamentals to Spring Boot microservices",
        category: "Java",
        level: "Advanced",
        price: 6999,
        duration: "16 weeks",
        mode: "Online"
      },
      {
        title: "Data Structures & Algorithms Mastery",
        slug: "dsa-mastery",
        description: "Crack FAANG interviews with 200+ coding problems",
        category: "Data Structures",
        level: "Intermediate",
        price: 2999,
        duration: "8 weeks",
        mode: "Online"
      },
      {
        title: "MERN Stack Developer Bootcamp",
        slug: "mern-stack",
        description: "MongoDB, Express, React, Node.js - Complete Full Stack Development",
        category: "Full Stack",
        level: "Intermediate",
        price: 5999,
        duration: "14 weeks",
        mode: "Online"
      },
      {
        title: "Python Django Developer",
        slug: "django-python",
        description: "Build scalable web apps with Python Django framework",
        category: "Python",
        level: "Beginner",
        price: 3999,
        duration: "10 weeks",
        mode: "Online"
      },
      {
        title: "DevOps & Cloud Engineering",
        slug: "devops-cloud",
        description: "AWS, Docker, Kubernetes, CI/CD pipelines & Cloud deployment",
        category: "DevOps",
        level: "Advanced",
        price: 7999,
        duration: "12 weeks",
        mode: "Online"
      },
      {
        title: "UI/UX Design Masterclass",
        slug: "ui-ux-design",
        description: "Design beautiful interfaces with Figma and master user experience principles",
        category: "Design",
        level: "Beginner",
        price: 3499,
        duration: "8 weeks",
        mode: "Online"
      },
      {
        title: "Artificial Intelligence & Machine Learning",
        slug: "ai-ml-course",
        description: "From Python basics to Deep Learning and Neural Networks",
        category: "Data Science",
        level: "Advanced",
        price: 8999,
        duration: "16 weeks",
        mode: "Online"
      },
      {
        title: "Cybersecurity Ethical Hacking",
        slug: "cyber-security",
        description: "Learn network security, penetration testing and ethical hacking",
        category: "Cybersecurity",
        level: "Intermediate",
        price: 5499,
        duration: "10 weeks",
        mode: "Online"
      },
      {
        title: "Blockchain & Web3 Development",
        slug: "blockchain-web3",
        description: "Smart contracts, Solidity, Ethereum and dApp development",
        category: "Web3",
        level: "Advanced",
        price: 9999,
        duration: "14 weeks",
        mode: "Online"
      },
      {
        title: "Digital Marketing Specialist",
        slug: "digital-marketing",
        description: "SEO, SEM, Social Media Marketing and Content Strategy",
        category: "Marketing",
        level: "Beginner",
        price: 2499,
        duration: "6 weeks",
        mode: "Online"
      },
      {
        title: "Flutter Mobile App Development",
        slug: "flutter-dev",
        description: "Build native Android and iOS apps with a single codebase",
        category: "Mobile Development",
        level: "Intermediate",
        price: 4499,
        duration: "10 weeks",
        mode: "Online"
      }
    ];

    // Insert courses
    const courses = await Course.insertMany(sampleCourses);
    console.log(`Successfully seeded ${courses.length} courses!`);

    res.status(201).json({
      message: `${courses.length} Sample courses added successfully for MentriQ Technologies!`,
      count: courses.length,
      courses: courses.map(course => ({
        id: course._id,
        title: course.title,
        price: course.price,
        level: course.level
      }))
    });
  } catch (error) {
    console.error("Seed error details:", error);
    res.status(500).json({
      message: "Error seeding courses",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const fields = [
      "title",
      "description",
      "price",
      "discount",
      "level",
      "duration",
      "category",
      "mode",
      "thumbnailUrl",
      "slug"
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    });

    const updatedCourse = await course.save();
    return res.json(updatedCourse);
  } catch (error) {
    console.error("Update course error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// Delete course (Admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.deleteOne();
    return res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  seedCourses,
};
