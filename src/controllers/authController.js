const authService = require('../services/authService');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await authService.register(username, password);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.login(username, password);
  if (!result) return res.status(401).json({ error: 'Invalid credentials' });
  res.json(result);
};