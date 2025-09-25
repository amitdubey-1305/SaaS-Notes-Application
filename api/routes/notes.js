const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

// Apply the authMiddleware to all routes in this file
router.use(authMiddleware);

// GET /api/notes - List all notes for the current user's tenant
router.get('/', async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        tenantId: req.user.tenantId,
      },
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const { userId, tenantId } = req.user;

  try {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (tenant.plan === 'FREE') {
      const noteCount = await prisma.note.count({ where: { tenantId } });
      if (noteCount >= 3) {
        return res.status(403).json({ message: 'Free plan limit of 3 notes reached. Please upgrade.' });
      }
    }

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        tenantId,
        authorId: userId,
      },
    });
    res.status(201).json(newNote);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/notes/:id - Retrieve a specific note
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user;

  try {
    const note = await prisma.note.findFirst({
      where: {
        id: id,
        tenantId: tenantId,
      },
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/notes/:id - Update a specific note
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const { tenantId } = req.user;

    try {
        const updateResult = await prisma.note.updateMany({
            where: { id: id, tenantId: tenantId },
            data: { title, content },
        });

        if (updateResult.count === 0) {
            return res.status(404).json({ message: 'Note not found or you do not have permission to update it' });
        }
        const updatedNote = await prisma.note.findUnique({ where: { id } });
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/notes/:id - Delete a specific note
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { tenantId } = req.user;

    try {
        const deleteResult = await prisma.note.deleteMany({
            where: { id: id, tenantId: tenantId },
        });

        if (deleteResult.count === 0) {
            return res.status(404).json({ message: 'Note not found or you do not have permission to delete it' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;