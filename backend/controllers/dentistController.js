import Dentist from "../models/Dentist.js";

export async function getDentists(req, res) {
  const search = (req.query.search || "").trim();
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 6)));
  const filter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { qualification: { $regex: search, $options: "i" } },
          { clinicName: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } }
        ]
      }
    : {};

  const total = await Dentist.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);

  const dentists = await Dentist.find(filter)
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * limit)
    .limit(limit);

  res.json({
    dentists,
    currentPage: safePage,
    totalPages
  });
}

export async function createDentist(req, res) {
  const {
    name,
    photo,
    qualification,
    experience,
    clinicName,
    address,
    location
  } = req.body || {};

  if (
    !name ||
    !photo ||
    !qualification ||
    experience === undefined ||
    !clinicName ||
    !address ||
    !location
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const dentist = await Dentist.create({
    name,
    photo,
    qualification,
    experience: Number(experience),
    clinicName,
    address,
    location
  });

  res.status(201).json(dentist);
}

