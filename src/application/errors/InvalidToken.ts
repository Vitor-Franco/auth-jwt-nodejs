

export class InvalidToken extends Error {
  name = 'InvalidToken';

  constructor() {
    super('Invalid Token');
  }
}
