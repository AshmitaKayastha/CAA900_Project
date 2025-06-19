const express = require('express');
const router = express.Router();
const catmodel = require('../../models/Category');

// @route   POST /api/category/add
// @desc    Add new category
router.post('/add', (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  const newCategory = new catmodel(req.body);
  newCategory.save()
    .then(doc => res.status(201).json(doc))
    .catch(err => res.status(500).json({ error: err.message }));
});

// @route   GET /api/category/:id
// @desc    Get single category by ID
router.get('/:id', (req, res) => {
  catmodel.findById(req.params.id)
    .then(doc => {
      if (!doc) return res.status(404).json({ msg: 'Category not found' });
      res.json(doc);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// @route   PUT /api/category/:id
// @desc    Update category by ID
router.put('/:id', (req, res) => {
  catmodel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(doc => res.json(doc))
    .catch(err => res.status(500).json({ error: err.message }));
});

// @route   GET /api/category
// @desc    Get all categories
router.get('/', (req, res) => {
  catmodel.find()
    .then(doc => {
      res.setHeader('Content-Range', 'categories 0-5/5');
      res.json(doc);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
