

export class AccountAlreadyExists extends Error {
  name = 'AccountAlreadyExists';

  constructor() {
    super('Account already exists');
  }
}
