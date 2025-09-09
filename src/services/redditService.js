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

const getPaginatedReddits = async (page = 1, limit = 10) => {
  return Reddit.findAndCountAll({
    offset: (page - 1) * limit,
    limit,
  });
};

const getRedditDetail = async (name) => {
  return Reddit.findOne({ where: { name } });
};

module.exports = { fetchAndStoreReddits, getPaginatedReddits, getRedditDetail };