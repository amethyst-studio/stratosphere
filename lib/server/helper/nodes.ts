import { Node } from '../../database/node.model.ts';
import { SQLite } from '../../database/sqlite.ts';

export function setNode(node: Node): void {
  try {
    SQLite.nodes.query(
      [
        'INSERT INTO nodes (uuid, secret, machine_groups, hostname, os, verified) VALUES (',
        '  ?,',
        '  ?,',
        '  ?,',
        '  ?,',
        '  ?,',
        '  ?',
        ')',
        'ON CONFLICT (uuid) DO',
        'UPDATE SET',
        '  machine_groups = ?,',
        '  verified = ?;',
      ].join('\n'),
      [
        node.uuid,
        node.secret,
        [...node.machineGroups].join(','),
        node.hostname,
        node.os,
        node.verified,
        [...node.machineGroups].join(','),
        node.verified,
      ],
    );
  } catch (err) {
    throw err;
  }
}

export function getNode(uuid: string): Node | null {
  const result = SQLite.nodes.query(
    'SELECT * FROM nodes WHERE uuid = ?;',
    [uuid],
  );

  if (result.at(0) === undefined) {
    return null;
  }

  return {
    uuid: result.at(0)!.at(0) as string,
    secret: result.at(0)!.at(1) as string,
    machineGroups: new Set(
      (result.at(0)!.at(2) as string).split(','),
    ),
    hostname: result.at(0)!.at(3) as string,
    os: result.at(0)!.at(4) as string,
    verified: result.at(0)!.at(5) as 0 | 1,
  };
}

export function createNodeUUID(): string {
  let uuid = globalThis.crypto.randomUUID();
  let node = undefined;
  while (true) {
    node = SQLite.nodes.query([
      `SELECT uuid FROM nodes WHERE uuid = ?;`,
      [uuid],
    ].join('\n')).at(0)?.at(0) as string | undefined;
    if (node === undefined) {
      break;
    }
    uuid = globalThis.crypto.randomUUID();
  }

  return uuid;
}
