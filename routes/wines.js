const express = require('express');
const router = express.Router();
const { connect } = require('../db');
const { ObjectId } = require('mongodb');

function toOid(id) {
  try { return new ObjectId(id); } catch { return id; }
}

// GET /api/wines/activities — must be before /:id
router.get('/activities', async (req, res) => {
  try {
    const db = await connect();
    const activities = await db.collection('activities').find({}).sort({ date: -1 }).toArray();
    res.json({ data: activities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/wines
router.get('/', async (req, res) => {
  try {
    const db = await connect();
    const wines = await db.collection('ScannedWine').find({}).toArray();
    res.json({ obj: wines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/wines/:id
router.get('/:id', async (req, res) => {
  try {
    const db = await connect();
    const wine = await db.collection('ScannedWine').findOne({ _id: toOid(req.params.id) });
    res.json({ obj: wine ? [wine] : [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/wines/add
router.post('/add', async (req, res) => {
  try {
    const db = await connect();
    const { _id, ...wine } = req.body;
    wine.qty = wine.qty || 0;
    const result = await db.collection('ScannedWine').insertOne(wine);
    await db.collection('activities').insertOne({
      action: 'added',
      date: new Date().toISOString(),
      name: wine.name,
      qty: wine.qty,
    });
    res.send(result.insertedId.toString());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/wines/update
router.post('/update', async (req, res) => {
  try {
    const db = await connect();
    const { _id, ...fields } = req.body;
    await db.collection('ScannedWine').updateOne({ _id: toOid(_id) }, { $set: fields });
    res.send('ok');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/wines/updateremove — decrements qty and logs activity
router.post('/updateremove', async (req, res) => {
  try {
    const db = await connect();
    const { _id, qty, name } = req.body;
    await db.collection('ScannedWine').updateOne({ _id: toOid(_id) }, { $set: { qty } });
    await db.collection('activities').insertOne({
      action: 'removed',
      date: new Date().toISOString(),
      name,
      qty: 1,
    });
    res.send('ok');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/wines/delete
router.post('/delete', async (req, res) => {
  try {
    const db = await connect();
    const { _id } = req.body;
    await db.collection('ScannedWine').deleteOne({ _id: toOid(_id) });
    res.send('ok');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
