import Report from "../models/Report.js";
import VerifiedScam from "../models/VerifiedScam.js";

// GET PENDING
export const getPendingReports = async (req, res) => {
  const reports = await Report.find({ status: "pending" });
  res.json(reports);
};

export const approveReport = async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  // move to verified scams
  await VerifiedScam.create({
    description: report.description,
    contact: report.contact,
    domain: report.domain,
    scamScore: report.scamScore,
    textFlags: report.textFlags,
    urlFlags: report.urlFlags,
    otherFlags: report.otherFlags,
  });

  report.status = "approved";
  await report.save();

  res.json({ message: "Report approved" });
};

export const rejectReport = async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  report.status = "rejected";
  await report.save();

  res.json({ message: "Report rejected" });
};