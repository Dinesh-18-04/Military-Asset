const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid password" });
  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role, base: user.base },
    process.env.JWT_SECRET, { expiresIn: '4h' }
  );
  res.json({ token, user: { username: user.username, role: user.role, base: user.base } });
};
