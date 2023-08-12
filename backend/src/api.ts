import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { initUserApi } from './user';
import { ethAddressToBuffer } from '../../new/util/eth';

export function initApi(app: express.Application, prisma: PrismaClient) {
  initUserApi(app, prisma);

  app.get('/organization', async (req, res, next) => {
    try {
      const prefix: string = req.body.prefix ?? "";
      const maxValues: number =  req.body.max ?? 50; // limit against DoS attacks.
      const organizations = await prisma.organization.findMany(
        {select: {id: true, name: true}, where: {name: {startsWith: prefix}}, take: maxValues});
      res.send(organizations);
    } catch (e) {
      next(e);
    }
  });
  
  app.post('/join-organizations', async (req, res, next) => {
    try {
      const userId = (req.session as any).userId;
      const orgId: number = req.body.organizationId;
      await prisma.organizationsUsers.create({data: {userId: userId, organizationId: orgId}});
      res.send({});
    } catch (e) {
      next(e);
    }
  });

  app.post('/create-organization', async (req, res, next) => {
    try {
      const data: {
        name: string,
        colonyNickName: string,
        colonyAddress: Buffer,
        tokenAddress: Buffer,
        tokenAuthorityAddress: Buffer,
      } = {
        name: req.body.name,
        colonyNickName: req.body.colonyNickName,
        colonyAddress: ethAddressToBuffer(req.body.colonyAddress),
        tokenAddress: ethAddressToBuffer(req.body.tokenAddress),
        tokenAuthorityAddress: ethAddressToBuffer(req.body.tokenAuthorityAddress),
      };
      const { id } = await prisma.organization.create({data});

      const userId = (req.session as any).userId;
      await prisma.organizationsUsers.create({data: {userId: userId, organizationId: id}});

      res.send({});
    } catch (e) {
      next(e);
    }
  });

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

  app.get('/tokens-with-childs/:organization', async (req, res, next) => {
    try {
      let organizationId = parseInt(req.params.organization);
      let r = await prisma.token.findMany({
        select: {
          childs: {
            select: {
              child: {
                select: {
                  id: true,
                  organizations: {select: {comment: true}, where: {organizationId}},
                },
              },
            },
          },
          organizations: {select: {comment: true}, where: {organizationId}},
        },
      });
      res.send(r);
    } catch (e) {
      next(e);
    }
  });

}
