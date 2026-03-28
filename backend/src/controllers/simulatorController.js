import Question from "../models/Question.js";
import User from "../models/User.js";

export const getQuestions = async (req, res) => {
  const { level } = req.params;
  const user = req.user;

  if (level === "medium" && user.simulator.easyCompleted < 100) {
    return res.status(403).json({ message: "Complete easy level first" });
  }

  if (level === "hard" && user.simulator.mediumCompleted < 50) {
    return res.status(403).json({ message: "Complete medium level first" });
  }

  const questions = await Question.find({ level });

  res.json(questions);
};

export const submitAnswer = async (req, res) => {
  const { questionId, selectedAnswer } = req.body;

  const question = await Question.findById(questionId);
  const user = await User.findById(req.user._id);

  let isCorrect = question.correctAnswer === selectedAnswer;

  let points = 0;

  if (isCorrect) {
    if (question.level === "easy") points = 1;
    if (question.level === "medium") points = 2;
    if (question.level === "hard") points = 3;

    user.simulator.score += points;
  }

  // update progress
  user.simulator[`${question.level}Completed`] += 1;

  await user.save();

  res.json({
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    redFlags: question.redFlags,
    points,
  });
};