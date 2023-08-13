import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { initUserApi } from './user';
import { ethAddressToBuffer } from '../../new/util/eth';

export function initApi(app: express.Application, prisma: PrismaClient) {
  initUserApi(app, prisma);

  app.get('/organization-tokens', async (req, res, next) => {
    try {
      let { organizationId }: { organizationId: number } = req.body;
      let r = 
      res.send(r);
    } catch (e) {
      next(e);
    }
  });
}
