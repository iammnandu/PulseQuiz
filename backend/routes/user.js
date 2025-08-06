const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { signupSchema, signinSchema } = require("../validations/type");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const safeParseResult = signupSchema.safeParse(req.body);
  if (!safeParseResult.success) {
    return res.status(400).json({ errors: safeParseResult.error.errors });
  }
  const { name, email, password } = safeParseResult.data;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  const safeParseResult = signinSchema.safeParse(req.body);
  if( !safeParseResult.success) {
    return res.status(400).json({ errors: safeParseResult.error.errors });
  }
  const { email, password } = safeParseResult.data;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isvalid = await bcrypt.compare(password, user.password);
    if (!isvalid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, "123random", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: { id: true, title: true, description: true },
    });
    res.json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/attempt/:quizId", auth, async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({ 
      where: { id: +req.params.quizId } 
    });
    
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const answers = req.body.answers; // { "0": "option1", "1": "option2" } etc
    const questions = quiz.questions;
    let score = 0;

    questions.forEach((q, i) => {
      if (answers[i] === q.answer) score++;
    });

    await prisma.result.create({
      data: { userId: req.user.id, quizId: quiz.id, score },
    });

    res.json({ message: "Quiz submitted", score });
  } catch (error) {
    console.error("Error attempting quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/results", auth, async (req, res) => {
  try {
    const results = await prisma.result.findMany({
      where: { userId: req.user.id },
      include: { quiz: true },
    });

    res.json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name },
      select: { id: true, name: true, email: true }
    });

    res.status(200).json({ 
      message: "Profile updated successfully",
      user: updatedUser 
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get quiz by ID with questions
router.get("/quiz/:id", async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: +req.params.id },
      select: {
        id: true,
        title: true,
        description: true,
        questions: true
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json({ quiz });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;







