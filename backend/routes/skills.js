const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const Comment = require('../models/Comment');
const User = require('../models/User');
// Middleware to check auth (mock for now, need middleware)
// For simplicity, assuming req.body.userId or header token. 
// Ideally, use a middleware like 'auth' to decode token and set req.user
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// GET /api/skills - All skills (with search & filter)
router.get('/', async (req, res) => {
  try {
    const { category, level, search, sort } = req.query;
    let query = {};
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let skills = Skill.find(query).populate('user', 'username email');
    
    if (sort === 'rating') {
      // Placeholder for rating logic if implemented
    } else if (sort === 'date') {
        skills = skills.sort({ createdAt: -1 });
    } else {
        skills = skills.sort({ createdAt: -1 });
    }

    const result = await skills.exec();
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/skills - Create skill
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, level } = req.body;
    const newSkill = new Skill({
      title,
      description,
      category,
      level,
      user: req.user.id
    });
    const skill = await newSkill.save();
    res.json(skill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/skills/stats - Stats
router.get('/stats', async (req, res) => {
    try {
        const totalSkills = await Skill.countDocuments();
        const skillsByCategory = await Skill.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        res.json({ totalSkills, skillsByCategory });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET /api/skills/:id
router.get('/:id', async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id).populate('user', 'username');
        if (!skill) return res.status(404).json({ msg: 'Skill not found' });
        res.json(skill);
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Skill not found' });
        res.status(500).send('Server error');
    }
});

// PUT /api/skills/:id
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, category, level } = req.body;
        let skill = await Skill.findById(req.params.id);
        if (!skill) return res.status(404).json({ msg: 'Skill not found' });
        if (skill.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        skill = await Skill.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(skill);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// DELETE /api/skills/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) return res.status(404).json({ msg: 'Skill not found' });
        if (skill.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await skill.deleteOne();
        res.json({ msg: 'Skill removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Comments
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const newComment = new Comment({
            content: req.body.content,
            skill: req.params.id,
            user: req.user.id
        });
        await newComment.save();
        res.json(newComment);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ skill: req.params.id }).populate('user', 'username').sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
