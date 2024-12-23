import type { NextFunction, Request, Response } from "express";
import type { IMiddleware } from "../../application/interface/IMiddleware";

export function middlewareAdapter(middleware: IMiddleware) {
	return async (request: Request, response: Response, next: NextFunction) => {
		const result = await middleware.handle({
			headers: request.headers as Record<string, string>,
		});

    if ('statusCode' in result) {
      const { statusCode, body } = result;
      response.status(statusCode).json(body);
      return;
    }

    request.metadata = {
      ...request.metadata,
      ...result.data,
    }
    next();
	};
}
