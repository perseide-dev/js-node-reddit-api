const axios = require('axios');
const Reddit = require('../models/Reddit');

const fetchAndStoreReddits = async () => {
  const { data } = await axios.get('https://www.reddit.com/reddits.json');
  const subreddits = data.data.children.map(child => ({
    name: child.data.display_name,
    title: child.data.title,
    url: child.data.url,
    description: child.data.public_description,
  }));
  await Reddit.bulkCreate(subreddits, { ignoreDuplicates: true });
};

const getPaginatedReddits = async (page = 1, limit = 10, q) => {
  const where = {};
  if (q) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${q}%` } },
      { title: { [Op.iLike]: `%${q}%` } },
      { description: { [Op.iLike]: `%${q}%` } },
    ];
  }
  return Reddit.findAndCountAll({
    where,
    offset: (page - 1) * limit,
    limit,
    order: [['name', 'ASC']],
  });
};

const getRedditDetail = async (name) => {
  return Reddit.findOne({ where: { name } });
};

module.exports = { fetchAndStoreReddits, getPaginatedReddits, getRedditDetail };