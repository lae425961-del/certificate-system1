const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { auth } = require('../middleware');

router.get('/', auth, async (req, res) => {
  try {
    const admins = await Admin.find({}, { username: 1 }).sort({ username: 1 }).lean();
    res.json({ admins });
  } catch (error) {
    console.error('List admins error:', error.message);
    res.status(500).json({ message: 'ບໍ່ສາມາດໂຫຼດລາຍງານຜູ້ດູແລໄດ້' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const body = req.body || {};
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = body.password;

  if (username.length < 3 || username.length > 32 || /\s/.test(username))
    return res.status(400).json({ message: 'ຊື່ຜູ້ໃຊ້ຕ້ອງມີ 3-32 ຕົວອັກສອນ ແລະ ຫ້າມມີຍະຫວ່າງ' });
  if (password !== undefined && password !== '' &&
      (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72))
    return res.status(400).json({ message: 'ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວ ແລະ ບໍ່ເກີນ 72 bytes' });

  try {
    const update = { username };
    if (typeof password === 'string' && password.length > 0)
      update.password = await bcrypt.hash(password, 10);

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true, select: 'username' },
    );
    if (!admin)
      return res.status(404).json({ message: 'ບໍ່ພົບບັນຊີຜູ້ດູແລ' });
    res.json({ admin: { id: admin._id, username: admin.username } });
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({ message: 'ຊື່ຜູ້ໃຊ້ນີ້ມີແລ້ວ' });
    if (error.name === 'CastError')
      return res.status(400).json({ message: 'ລະຫັດບັນຊີຜູ້ດູແລບໍ່ຖືກຕ້ອງ' });
    console.error('Update admin error:', error.message);
    res.status(500).json({ message: 'ບໍ່ສາມາດແກ້ໄຂບັນຊີຜູ້ດູແລໄດ້' });
  }
});

router.post('/', auth, async (req, res) => {
  const body = req.body || {};
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (username.length < 3 || username.length > 32 || /\s/.test(username))
    return res.status(400).json({ message: 'ຊື່ຜູ້ໃຊ້ຕ້ອງມີ 3-32 ຕົວອັກສອນ ແລະ ຫ້າມມີຍະຫວ່າງ' });
  if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72)
    return res.status(400).json({ message: 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວ ແລະ ບໍ່ເກີນ 72 bytes' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, password: hashedPassword });
    res.status(201).json({ id: admin._id, username: admin.username });
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({ message: 'ຊື່ຜູ້ໃຊ້ນີ້ມີແລ້ວ' });
    console.error('Create admin error:', error.message);
    res.status(500).json({ message: 'ບໍ່ສາມາດບັນທຶກບັນຊີຜູ້ດູແລໄດ້' });
  }
});

module.exports = router;
