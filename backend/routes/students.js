const router = require('express').Router();
const ExcelJS = require('exceljs');
const Student = require('../models/Student');
const { auth } = require('../middleware');
const MONTHS = ['ມັງກອນ','ກຸມພາ','ມີນາ','ເມສາ','ພຶດສະພາ','ມິຖຸນາ','ກໍລະກົດ','ສິງຫາ','ກັນຍາ','ຕຸລາ','ພະຈິກ','ທັນວາ'];
const FIELDS = ['firstName','lastName','birthDay','birthMonth','birthYear','village','district','province'];
const pick = (b) => Object.fromEntries(FIELDS.map(f => [f, b[f]]));

const buildFilter = (q) => {
  const f = {};
  if (q.province) f.province = q.province;
  if (q.district) f.district = q.district;
  if (q.search) { const r = new RegExp(q.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); f.$or = [{ firstName: r }, { lastName: r }, { village: r }]; }
  return f;
};

// ລົງທະບຽນ (ສາທາລະນະ)
router.post('/', async (req, res) => {
  try { const s = await Student.create(pick(req.body)); res.status(201).json(s); }
  catch (e) { res.status(400).json({ message: 'ຂໍ້ມູນບໍ່ຄົບຖ້ວນ ຫຼື ບໍ່ຖືກຕ້ອງ' }); }
});

// ລາຍງານ + ລາຍການ (ຕ້ອງ login)
router.get('/', auth, async (req, res) => {
  const filter = buildFilter(req.query);
  const items = await Student.find(filter).sort({ createdAt: -1 });
  const byProvince = await Student.aggregate([{ $match: filter }, { $group: { _id: '$province', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
  res.json({ total: items.length, byProvince, items });
});

router.get('/villages', async (req, res) => {
  const { province, district } = req.query;
  if (typeof province !== 'string' || typeof district !== 'string' || !province || !district)
    return res.status(400).json({ message: 'ກະລຸນາເລືອກແຂວງ ແລະ ເມືອງກ່ອນ' });

  try {
    const villages = await Student.distinct('village', { province, district });
    res.json({ villages: villages.filter(Boolean).sort((a, b) => a.localeCompare(b)) });
  } catch (e) {
    console.error('Village suggestions error:', e.message);
    res.status(500).json({ message: 'ບໍ່ສາມາດໂຫຼດລາຍຊື່ບ້ານໄດ້' });
  }
});

router.get('/export', auth, async (req, res) => {
  const items = await Student.find(buildFilter(req.query)).sort({ createdAt: -1 });
  const wb = new ExcelJS.Workbook(); const ws = wb.addWorksheet('ລາຍຊື່ນັກສຶກສາ');
  ws.columns = [
    { header: 'ລ/ດ', key: 'no', width: 6 }, { header: 'ຊື່', key: 'firstName', width: 20 },
    { header: 'ນາມສະກຸນ', key: 'lastName', width: 22 }, { header: 'ວັນເດືອນປີເກີດ', key: 'birth', width: 24 },
    { header: 'ບ້ານ', key: 'village', width: 20 }, { header: 'ເມືອງ', key: 'district', width: 20 },
    { header: 'ແຂວງ', key: 'province', width: 20 }, { header: 'ວັນທີລົງທະບຽນ', key: 'createdAt', width: 18 },
  ];
  items.forEach((s, i) => ws.addRow({ no: i + 1, firstName: s.firstName, lastName: s.lastName,
    birth: `${s.birthDay} ${MONTHS[s.birthMonth - 1]} ${s.birthYear}`, village: s.village, district: s.district,
    province: s.province, createdAt: s.createdAt.toISOString().slice(0, 10) }));
  const head = ws.getRow(1); head.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  head.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF14213D' } };
  ws.views = [{ state: 'frozen', ySplit: 1 }];
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
  await wb.xlsx.write(res); res.end();
});

router.put('/:id', auth, async (req, res) => {
  try { const s = await Student.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true });
    s ? res.json(s) : res.status(404).json({ message: 'ບໍ່ພົບຂໍ້ມູນ' }); }
  catch { res.status(400).json({ message: 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ' }); }
});
router.delete('/:id', auth, async (req, res) => { await Student.findByIdAndDelete(req.params.id); res.json({ ok: true }); });
module.exports = router;
