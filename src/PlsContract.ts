import { PlsUser } from "./PlsUser"

export class PlsContract {

  constructor(
    public readonly user1: PlsUser,
    public readonly user2: PlsUser,
    public readonly mediator: PlsUser | null,
    public readonly arbitrator: PlsUser,
    public readonly dao: PlsUser | null,
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
