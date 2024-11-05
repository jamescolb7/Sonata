import { Request, Response, NextFunction } from "express";
import { verifyRequestOrigin } from "lucia";

export default function ValidateCors(req: Request, res: Response, next: NextFunction) {
  if (req.method === "GET") {
    return next();
  }
  const originHeader = req.headers.origin ?? null;
  const hostHeader = req.headers.host ?? null;
  if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
    return res.status(403).end();
  }
  return next();
}