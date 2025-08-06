const { z } = require("zod");

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const signinSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const createquizzschema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  questions: z.array(
    z.object({
      question: z.string().min(1, "Question is required"),
      options: z.array(z.string().min(1)).min(2, "At least two options required"),
      answer: z.string().min(1, "Answer is required"),
    })
  ).min(1, "At least one question is required"),
});

module.exports = {
  signupSchema,
  signinSchema,
  createquizzschema,
};