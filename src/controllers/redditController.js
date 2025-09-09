const redditService = require('../services/redditService');

exports.syncReddits = async (req, res) => {
  await redditService.fetchAndStoreReddits();
  res.json({ message: 'Reddits synced' });
};

exports.listReddits = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await redditService.getPaginatedReddits(Number(page), Number(limit));
  res.json(result);
};

exports.getReddit = async (req, res) => {
  const { name } = req.params;
  const reddit = await redditService.getRedditDetail(name);
  if (!reddit) return res.status(404).json({ error: 'Not found' });
  res.json(reddit);
};