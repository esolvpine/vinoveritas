const express = require('express');
const router = express.Router();
const { connect } = require('../db');
const { ObjectId } = require('mongodb');

function toOid(id) {
  try { return new ObjectId(id); } catch { return id; }
}

// GET /api/locations — returns all location slots
router.get('/', async (req, res) => {
  try {
    const db = await connect();
    const locations = await db.collection('Locations').find({}).toArray();
    res.json({ locations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/locations/update — clear a single location and pull it from wine's cellarLocation
router.post('/update', async (req, res) => {
  try {
    const db = await connect();
    const { _id } = req.body;

    // Read current wineid before clearing so we can update ScannedWine
    const current = await db.collection('Locations').findOne({ _id });
    const wineid = current?.wineid;

    await db.collection('Locations').updateOne(
      { _id },
      { $set: { wineid: '', winegroup: '' } }
    );

    if (wineid) {
      await db.collection('ScannedWine').updateOne(
        { _id: toOid(wineid) },
        { $pull: { cellarLocation: _id } }
      );
    }

    res.send('ok');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/locations/updateMany — assign wine to multiple locations and push to cellarLocation
// Payload: { locations: [{_id: "ca1"}, ...], wineid: "xxx" }
router.post('/updateMany', async (req, res) => {
  try {
    const db = await connect();
    const { locations, wineid } = req.body;

    const wine = await db.collection('ScannedWine').findOne({ _id: toOid(wineid) });
    const winegroup = wine ? (wine.type || '') : '';

    await Promise.all(
      locations.map((loc) =>
        db.collection('Locations').updateOne(
          { _id: loc._id },
          { $set: { wineid, winegroup } },
          { upsert: true }
        )
      )
    );

    // Push location IDs into wine's cellarLocation array
    const locIds = locations.map((l) => l._id);
    await db.collection('ScannedWine').updateOne(
      { _id: toOid(wineid) },
      { $addToSet: { cellarLocation: { $each: locIds } } }
    );

    res.send('ok');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
