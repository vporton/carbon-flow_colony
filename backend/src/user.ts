import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export function initUserApi(app: express.Application, prisma: PrismaClient) {
  app.post('/register', async (req, res, next) => {
    try {
      const data: {login: string, password: string} = req.body;
      const hash = await bcrypt.hash(data.login, 10);
      const user = await prisma.user.create({data: {
        login: data.login,
        passwordHash: hash,
      }});
      (req.sessionOptions as any).userId = user.id;
      res.send({});
    } catch (e) {
      next(e);
    }
  });

  app.post('/login', async (req, res, next) => {
    try {
      const data: {login: string, password: string} = req.body;
      const user = await prisma.user.findFirstOrThrow({select: {id: true, passwordHash: true}, where: {login: data.login}});
      let hasUser = false;
      if (user !== null) {
        hasUser = await bcrypt.compare(data.login, user.passwordHash);
      }
      (req.session as any).userId = hasUser ? user!.id : undefined;
      console.log(`userId`, (req.sessionOptions as any).userId)
      res.send({});
    } catch (e) {
      next(e);
    }
  });

  app.post('/logout', async (req, res, next) => {
    try {
      req.session = null;
      res.send({});
    } catch (e) {
      next(e);
    }
  });

  app.get('/user-id', async (req, res, next) => {
    try {
      const userId = (req.session as any).userId;
      if (userId !== undefined) {
        const user = await prisma.user.findFirst({select: {login: true}, where: {id: userId}});
        res.send({userId, username: user?.login});
      } else {
        res.send({userId: null, username: null});
      }
    } catch (e) {
      next(e);
    }
  });
}
