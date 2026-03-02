const express = require('express');
const router = express.Router();
const { connect } = require('../db');

async function distinct(field) {
  const db = await connect();
  const values = await db.collection('ScannedWine').distinct(field);
  return values.filter(Boolean);
}

// GET /api/grapes — distinct grape from ScannedWine
router.get('/grapes', async (req, res) => {
  try {
    res.json({ obj: (await distinct('grape')).sort() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/country — distinct country from ScannedWine
router.get('/country', async (req, res) => {
  try {
    res.json({ obj: (await distinct('country')).sort() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/winetype — distinct group from ScannedWine
router.get('/winetype', async (req, res) => {
  try {
    res.json({ obj: (await distinct('group')).sort() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/millesime — distinct millesime from ScannedWine, descending
router.get('/millesime', async (req, res) => {
  try {
    const values = await distinct('millesime');
    res.json({ obj: values.sort((a, b) => b - a) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
