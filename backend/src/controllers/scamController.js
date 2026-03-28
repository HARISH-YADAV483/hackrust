import Report from "../models/Report.js";

// 🔍 Search scams
export const searchScams = async (req, res) => {
  try {
    const { query } = req.query;

    const scams = await Report.find({
      $and: [
        { status: "approved" }, // only verified scams
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { platform: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        },
      ],
    });

    res.json(scams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};