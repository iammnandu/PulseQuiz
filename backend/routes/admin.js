const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const {
  signupSchema,
  signinSchema,
  createquizzschema,
} = require("../validations/type");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();
const express = require("express");
const { Role } = require("@prisma/client/edge");
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
        role: Role.ADMIN,
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
  if (!safeParseResult.success) {
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

router.post("/createquiz", auth, async (req, res) => {
  console.log(req.body);
  const safeParseResult = createquizzschema.safeParse(req.body);
  console.log(safeParseResult);
  if (!safeParseResult.success) {
    return res.status(400).json({ errors: safeParseResult.error.errors });
  }
  const { title, description, questions } = safeParseResult.data;


  try {
    await prisma.quiz.create({
      data: {
        title,
        description,
        questions,
        creatorId: req.user.id,
      },
    });

    res.status(201).json({ message: "Quiz created successfully" });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/updatequiz/:id", auth, async (req, res) => {
  try {
    const quizid = parseInt(req.params.id);
    const safeParseResult = createquizzschema.safeParse(req.body);
    if (!safeParseResult.success) {
      return res.status(400).json({ errors: safeParseResult.error.errors });
    }
    
    const updated = await prisma.quiz.update({
      where: { id: quizid },
      data: safeParseResult.data,
    });
    
    res.status(200).json({ message: "Quiz updated successfully", updated });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add delete quiz endpoint
router.delete("/deletequiz/:id", auth, async (req, res) => {
  try {
    const quizid = parseInt(req.params.id);
    
    await prisma.quiz.delete({
      where: { id: quizid },
    });
    
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all quizzes for admin
router.get("/quizzes", auth, async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        creator: {
          select: { name: true, email: true }
        }
      }
    });
    
    res.status(200).json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;
