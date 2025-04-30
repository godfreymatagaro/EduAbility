const Technology = require('../models/technology.models');
const redisClient = require('../redis');
const path = require('path');

const getTechnologies = async (req, res) => {
  const { category } = req.query;
  const cacheKey = `technologies:category:${category || 'all'}`;

  try {
    // Check Redis cache
    const cachedTechs = await redisClient.get(cacheKey);
    if (cachedTechs) {
      return res.status(200).json(JSON.parse(cachedTechs));
    }

    // Fetch from MongoDB
    const query = category ? { category } : {};
    const technologies = await Technology.find(query).sort({ rating: -1 });

    // Cache the result
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(technologies));
    res.status(200).json(technologies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTechnology = async (req, res) => {
  const {
    name,
    keyFeatures,
    systemRequirements,
    category,
    description,
    cost,
    evaluation,
    version,
    platform,
    developer,
    inputs,
    featureComparison,
    coreVitals,
  } = req.body;

  try {
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const technology = new Technology({
      name,
      keyFeatures,
      systemRequirements,
      category,
      description,
      cost,
      evaluation,
      version,
      platform,
      developer,
      inputs,
      image,
      featureComparison: JSON.parse(featureComparison),
      coreVitals: JSON.parse(coreVitals),
    });

    await technology.save();

    // Invalidate cache
    await redisClient.del(`technologies:category:${category}`);
    await redisClient.del('technologies:category:all');

    res.status(201).json(technology);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTechnology = async (req, res) => {
  const { techId } = req.params;

  try {
    const tech = await Technology.findOne({ techId });
    if (!tech) {
      return res.status(404).json({ message: 'Technology not found' });
    }

    await Technology.deleteOne({ techId });
    await Review.deleteMany({ technologyId: techId });

    // Invalidate cache
    await redisClient.del(`technologies:category:${tech.category}`);
    await redisClient.del('technologies:category:all');
    await redisClient.del(`reviews:tech:${techId}`);
    await redisClient.del(`tech:summary:${techId}`);

    res.status(200).json({ message: 'Technology deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTechnologies, createTechnology, deleteTechnology };