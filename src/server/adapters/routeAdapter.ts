import type { Request, Response } from "express";
import type { IController } from "../../application/interface/IController";

export function routeAdapter(controller: IController) {
	return async (request: Request, response: Response) => {
		const {
      body,
      statusCode
    } = await controller.handle({
      body: request.body,
      params: request.params,
      accountId: request.metadata?.accountId,
    });

    response.status(statusCode).json(body);
	};
}
