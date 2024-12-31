import { RefreshTokenController } from "../application/controllers/RefreshTokenController";
import { makeRefreshTokenUseCase } from "./makeRefreshTokenUseCase";


export function makeRefreshTokenController() {
  return new RefreshTokenController(makeRefreshTokenUseCase());
}
