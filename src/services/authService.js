const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sanitizeUser = (userInstance) => {
  if (!userInstance) return null;
  const plain = userInstance.get({ plain: true });
  delete plain.password;
  return plain;
};

const register = async (username, password) => {
  const hash = await bcrypt.hash(password, 10);
  return User.create({ username, password: hash });
};

const login = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { user: sanitizeUser(user), token }; // <-- no password
};

module.exports = { register, login };