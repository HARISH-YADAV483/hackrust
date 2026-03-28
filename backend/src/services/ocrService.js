import Tesseract from "tesseract.js";
import path from "path";
import fs from "fs";

export const extractTextFromImage = async (filePath) => {
  try {
    // ✅ ensure file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }

    // ✅ resolve absolute path (important for Mac/Windows)
    const absolutePath = path.resolve(filePath);

    const result = await Tesseract.recognize(absolutePath, "eng", {
      logger: (m) => {
        // optional: show progress
        // console.log(m);
      },
    });

    const text = result.data.text;

    return text;
  } catch (error) {
    console.error("❌ OCR Error:", error.message);
    return "";
  }
};