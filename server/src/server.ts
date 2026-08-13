import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "change_this_demo_secret";

// Serve uploaded files statically
const uploadsDir = path.join(process.cwd(), "../data/uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// --- Helpers / Middleware ---
function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && (authHeader as string).split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    (req as any).user = { id: payload.userId, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function requireRole(role: string) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (user.role !== role && user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

// --- Health ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// --- Auth ---
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email and password required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  // create token
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  const uid = (req as any).user.id;
  const user = await prisma.user.findUnique({ where: { id: uid }, include: { patientProfile: true, doctorProfile: true } });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, patientProfile: user.patientProfile, doctorProfile: user.doctorProfile });
});

// --- File upload (save files + metadata) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const consId = req.params.id || "unassigned";
    const dest = path.join(uploadsDir, "consultation", consId);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});
const upload = multer({ storage });

app.post("/api/consultations/:id/images", authenticateToken, upload.array("images", 10), async (req, res) => {
  const consId = req.params.id;
  const consultation = await prisma.consultation.findUnique({ where: { id: consId } });
  if (!consultation) return res.status(404).json({ error: "Consultation not found" });

  const files = (req.files as Express.Multer.File[]).map((f) => ({
    filename: f.filename,
    path: `/uploads/consultation/${consId}/${f.filename}`,
    size: f.size,
  }));

  // find patientProfile for the authenticated user
  const userId = (req as any).user.id;
  const patientProfile = await prisma.patientProfile.findUnique({ where: { userId } });

  const created = [] as any[];
  for (const f of files) {
    const img = await prisma.clinicalImage.create({
      data: {
        consultationId: consId,
        patientId: patientProfile ? patientProfile.id : undefined,
        filePath: f.path,
        imageType: "OTHER",
      },
    });
    created.push(img);
  }

  res.json({ uploaded: created });
});

// --- Consultations ---
app.post("/api/consultations", authenticateToken, requireRole("PATIENT"), async (req, res) => {
  // create DRAFT consultation linked to patient's profile
  const userId = (req as any).user.id;
  const patientProfile = await prisma.patientProfile.findUnique({ where: { userId } });
  if (!patientProfile) return res.status(400).json({ error: "Patient profile not found" });

  const c = await prisma.consultation.create({
    data: {
      patientId: patientProfile.id,
      status: "DRAFT",
      chiefConcern: req.body.chiefConcern || "unspecified",
      description: req.body.description || undefined,
    },
  });
  res.json(c);
});

app.post("/api/consultations/:id/submit", authenticateToken, requireRole("PATIENT"), async (req, res) => {
  const consId = req.params.id;
  const userId = (req as any).user.id;
  const patientProfile = await prisma.patientProfile.findUnique({ where: { userId } });
  if (!patientProfile) return res.status(400).json({ error: "Patient profile not found" });

  const consultation = await prisma.consultation.findUnique({ where: { id: consId } });
  if (!consultation) return res.status(404).json({ error: "Consultation not found" });
  if (consultation.patientId !== patientProfile.id) return res.status(403).json({ error: "Cannot submit another patient's consultation" });

  const updated = await prisma.consultation.update({ where: { id: consId }, data: { status: "SUBMITTED", startedAt: new Date() } });
  res.json(updated);
});

// List consultations: doctors see SUBMITTED/ASSIGNED, patients see their own
app.get("/api/consultations", authenticateToken, async (req, res) => {
  const user = (req as any).user;
  if (user.role === "DOCTOR") {
    const list = await prisma.consultation.findMany({ where: { status: { in: ["SUBMITTED", "ASSIGNED"] } }, orderBy: { createdAt: "desc" } });
    return res.json(list);
  }
  if (user.role === "PATIENT") {
    const patientProfile = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
    if (!patientProfile) return res.status(400).json({ error: "Patient profile not found" });
    const list = await prisma.consultation.findMany({ where: { patientId: patientProfile.id }, orderBy: { createdAt: "desc" } });
    return res.json(list);
  }
  // admin: all
  const list = await prisma.consultation.findMany({ orderBy: { createdAt: "desc" } });
  res.json(list);
});

app.get("/api/consultations/:id", authenticateToken, async (req, res) => {
  const consId = req.params.id;
  const c = await prisma.consultation.findUnique({ where: { id: consId }, include: { images: true, history: true, assessment: true, consent: true } });
  if (!c) return res.status(404).json({ error: "Consultation not found" });
  // basic ACL: patient-owner, assigned doctor, admin
  const user = (req as any).user;
  if (user.role === "PATIENT") {
    const patientProfile = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
    if (!patientProfile || c.patientId !== patientProfile.id) return res.status(403).json({ error: "Forbidden" });
  }
  res.json(c);
});

// Doctor claim / assign a consultation
app.post("/api/consultations/:id/assign", authenticateToken, requireRole("DOCTOR"), async (req, res) => {
  const consId = req.params.id;
  const userId = (req as any).user.id;
  // find doctor's profile
  const doctorProfile = await prisma.doctorProfile.findUnique({ where: { userId } });
  if (!doctorProfile) return res.status(400).json({ error: "Doctor profile not found" });

  const updated = await prisma.consultation.update({ where: { id: consId }, data: { doctorId: doctorProfile.id, status: "ASSIGNED" } });
  res.json(updated);
});

// Complete consultation by doctor
app.post("/api/consultations/:id/complete", authenticateToken, requireRole("DOCTOR"), async (req, res) => {
  const consId = req.params.id;
  const updated = await prisma.consultation.update({ where: { id: consId }, data: { status: "COMPLETED", completedAt: new Date() } });
  res.json(updated);
});

// --- Simple evidence endpoint ---
app.get("/api/evidence", authenticateToken, async (req, res) => {
  const items = await prisma.evidenceReference.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
