import type { Application, Request, Response, NextFunction } from 'express';
import { parse } from 'url';
import bodyParser from 'body-parser';
import { RequestHandler } from 'next/dist/server/next';

export default function initializeExpress(server: Application, handle: RequestHandler) {
  server.use(bodyParser.json());

  server.use(async (request: Request, response: Response, next: NextFunction) => {
    const API_PREFIX = '/api';
    if (request.url.startsWith(API_PREFIX)) {
      // remove /api from request and pass it on to the next express handler
      request.url = request.url.substring(API_PREFIX.length) ?? '/';
      return next();
    }

    // Remaining requests to be passed on to the nextjs handler
    const parsedUrl = parse(request.url, true);
    handle(request, response, parsedUrl);
  });
}
