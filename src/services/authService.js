const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (username, password) => {
  const hash = await bcrypt.hash(password, 10);
  return User.create({ username, password: hash });
};

const login = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) return null;
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { user, token };
};

module.exports = { register, login };