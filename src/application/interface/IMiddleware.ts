import type { IRequest } from "./IRequest";

export interface IResponse {
	statusCode: number;
	body: Record<string, any> | null;
}

export type IData = {
	data: Record<string, any>;
};

export interface IMiddleware {
	handle(request: IRequest): Promise<IResponse | IData>;
}
