export interface Node {
  uuid: string;
  secret: string;
  machineGroups: Set<string>;
  hostname: string;
  os: string;
  verified: 0 | 1;
}
