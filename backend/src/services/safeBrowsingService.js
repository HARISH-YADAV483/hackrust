import Tesseract from "tesseract.js";

export const extractTextFromImage = async (filePath) => {
  const { data } = await Tesseract.recognize(filePath, "eng");
  return data.text;
};