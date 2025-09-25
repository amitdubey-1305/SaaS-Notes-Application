const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find the user and include their tenant information
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true }, // IMPORTANT: This joins the tenant table
    });

    // If no user or tenant is found, fail
    if (!user || !user.tenant) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If credentials are valid, generate a JWT with all required info
    const tokenPayload = {
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      tenantPlan: user.tenant.plan, // This line requires the 'include' above
       email: user.email,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;