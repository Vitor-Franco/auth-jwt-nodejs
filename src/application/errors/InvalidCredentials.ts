

export class InvalidCredentials extends Error {
  name = 'InvalidCredentials';

  constructor() {
    super('Invalid credentials');
  }
}
