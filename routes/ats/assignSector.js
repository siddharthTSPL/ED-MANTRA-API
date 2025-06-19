/** 
const express = require('express');
const router = express.Router();
const Sector = require('../../modals/sector'); // Correct import from models/index.js

router.post('/api/assignSector', async (req, res) => {
  const { empId, sector } = req.body;

  if (!empId || !sector) {
    return res.status(400).json({ error: 'empId and sector are required.' });
  }

  try {
    // Check for existing assignment
    const existingSector = await Sector.findOne({
      where: {
        empId,
        sector,
      },
    });

    if (existingSector) {
      return res.status(409).json({
        error: 'This sector is already assigned to the employee.',
      });
    }

    // Create new sector assignment
    const newSector = await Sector.create({ empId, sector });

    res.status(201).json(newSector);
  } catch (error) {
    console.error('Error creating sector:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
*/