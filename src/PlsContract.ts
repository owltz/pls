import { User } from "./User"

export class PlsContract {

  constructor(
    public readonly user1: User,
    public readonly user2: User,
    public readonly mediator: User | null,
    public readonly arbitrator: User,
    public readonly dao: User | null,
    public readonly creationDate: number,
    public readonly expiringDate: number,
    public readonly fileHash: string
  ) { }

  generateFileHash(filePath: string) {
    return 'fake-hash'
  }

  public toJSON(): string {
    return JSON.stringify(this);
  }

  generatePlsContractHash(): string {
    return 'fake-hash'
  }
}
