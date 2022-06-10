export interface DispatchedTask {
  uuid: string;
  groups: string[];
  until: number;
  value: string;
}

export interface DispatchedUser {
  enabled: boolean;
  id: string;
  public: string;
  groups: string[];
}

export interface DispatchedEvent {
  machineGroups: string[];
  dispatched: DispatchedTask[];
  users: DispatchedUser[];
}
