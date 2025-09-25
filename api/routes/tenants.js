// /api/routes/tenants.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();
const prisma = new PrismaClient();


router.post('/:slug/upgrade', [authMiddleware, adminMiddleware], async (req, res) => {
  const { slug } = req.params;
  const { tenantId } = req.user;

  try {
    // Security check: Make sure the admin is upgrading their own tenant
    const tenantToUpgrade = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenantToUpgrade || tenantToUpgrade.id !== tenantId) {
        return res.status(403).json({ message: 'Forbidden: You can only upgrade your own tenant.' });
    }

    // Update the tenant's plan to "PRO"
    const updatedTenant = await prisma.tenant.update({
        where: { id: tenantId },
        data: { plan: 'PRO' },
    });

    res.json({ message: 'Tenant successfully upgraded to PRO plan.', tenant: updatedTenant });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;