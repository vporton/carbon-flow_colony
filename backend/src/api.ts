import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { initUserApi } from './user';
import { ethAddressToBuffer } from '../../new/util/eth';

export function initApi(app: express.Application, prisma: PrismaClient) {
  initUserApi(app, prisma);

  app.get('/organization/:id', async (req, res, next) => {
    try {
      let id = +req.params.id;
      let r = await prisma.organization.findFirstOrThrow({
        select: { name: true, colonyNickName: true, colonyAddress: true },
        where: { id },
      });
      res.send({name: r.name, nickName: r.colonyNickName, colonyAddress: r.colonyAddress });
    } catch (e) {
      next(e);
    }
  });

  app.get('/organization-tokens', async (req, res, next) => {
    try {
      let { organizationId }: { organizationId: number } = req.body;
      let r = await prisma.organizationsTokens.findMany({
        select: {token: { select: { id: true } }, comment: true},
        where: { organizationId },
      });
      res.send(r);
    } catch (e) {
      next(e);
    }
  });
}
