import { sqlite3 } from '../../deps.ts';

export class SQLite {
  /** The database which will store information on each node connected to the cluster. */
  public static readonly nodes = new sqlite3.DB(
    './store/local/nodes.db',
  );

  /** The database which will store information on each user associated with the cluster and their sync information. */
  public static readonly users = new sqlite3.DB(
    './store/local/users.db',
  );

  /** The database which will store information on active tasks dispatched on the cluster's nodes. */
  public static readonly dispatching = new sqlite3.DB(
    './store/local/dispatching.db',
  );

  /** The database which will store information on future and repeating tasks for dispatch on the cluster's nodes. */
  public static readonly tasks = new sqlite3.DB(
    './store/local/tasks.db',
  );

  /** The database which will store information on the result for each of the cluster's nodes. */
  public static readonly logs = new sqlite3.DB(
    './store/local/logs.db',
  );

  public static initialize(): void {
    // Initialize the nodes.nodes table.
    this.nodes.query([
      'CREATE TABLE IF NOT EXISTS nodes (',
      '  uuid TEXT NOT NULL UNIQUE,',
      '  secret TEXT NOT NULL UNIQUE,',
      '  machine_groups TEXT NOT NULL,',
      '  hostname TEXT NOT NULL UNIQUE,',
      '  os TEXT NOT NULL,',
      '  verified BOOLEAN DEFAULT FALSE,',
      '  PRIMARY KEY (uuid, secret)',
      ');',
    ].join('\n'));
    // Initialize the nodes.machine_groups table.
    this.nodes.query([
      'CREATE TABLE IF NOT EXISTS machine_groups (',
      '  uuid TEXT NOT NULL UNIQUE,',
      '  name TEXT NOT NULL UNIQUE,',
      '  description TEXT NOT NULL',
      ');',
    ].join('\n'));
  }
}
