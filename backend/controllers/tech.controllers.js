const Technology = require('../models/technology.models');

const createTechnology = async (req, res) => {
  const { name, description } = req.body;
  try {
    const technology = new Technology({ name, description });
    await technology.save();
    res.status(201).json(technology);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTechnologies = async (req, res) => {
  try {
    const technologies = await Technology.find();
    res.status(200).json(technologies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTechnologyById = async (req, res) => {
  try {
    const technology = await Technology.findById(req.params.id);
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    res.status(200).json(technology);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTechnology = async (req, res) => {
  try {
    const technology = await Technology.findById(req.params.id);
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    Object.assign(technology, req.body);
    await technology.save();
    res.status(200).json(technology);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTechnology = async (req, res) => {
  try {
    const technology = await Technology.findById(req.params.id);
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    await technology.remove();
    res.status(200).json({ message: 'Technology deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTechnology, getAllTechnologies, getTechnologyById, updateTechnology, deleteTechnology };