import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
const uploadsDir = path.join(process.cwd(), "../data/uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// File upload (simple skeleton)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const consId = req.params.id || "unassigned";
    const dest = path.join(uploadsDir, "consultation", consId);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

app.post("/api/consultations/:id/images", upload.array("images", 10), (req, res) => {
  // TODO: save metadata in DB (ClinicalImage). Minimal response for now:
  const files = (req.files as Express.Multer.File[]).map((f) => ({
    filename: f.filename,
    path: `/uploads/consultation/${req.params.id}/${f.filename}`,
    size: f.size,
  }));
  res.json({ uploaded: files });
});

// Minimal consultations endpoints (skeleton)
app.post("/api/consultations", async (req, res) => {
  // create DRAFT consultation
  const c = await prisma.consultation.create({
    data: {
      patientId: req.body.patientId,
      status: "DRAFT",
      chiefConcern: req.body.chiefConcern || "unspecified",
    },
  });
  res.json(c);
});

app.get("/api/consultations/:id", async (req, res) => {
  const c = await prisma.consultation.findUnique({ where: { id: req.params.id } });
  res.json(c);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
