const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const User = require('../models/User');

// GET /api/users/:id/skills - Get skills by user
router.get('/:id/skills', async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
