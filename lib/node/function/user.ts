import { DispatchedUser } from '../../interface/dispatch.ts';
import { Logging } from '../../util/logging.ts';

export class User {
  public static async sync(
    users: DispatchedUser[],
  ): Promise<void> {
    const decoder = new TextDecoder('utf-8');
    const passwd = decoder.decode(
      await Deno.readFile('/etc/passwd'),
    ).trim().split('\n');
    const group = decoder.decode(
      await Deno.readFile('/etc/group'),
    ).trim().split('\n');

    // Run the update and revoke process.
    for (const r in passwd) {
      const value = passwd[r]!.split(':');
      if (value.length < 7) continue;
      if (
        parseInt(value[2]!) < 1000 || parseInt(value[3]!) < 1000
      ) {
        continue;
      }
      if (
        parseInt(value[2]!) === 65534 ||
        parseInt(value[3]!) === 65534
      ) {
        continue;
      }
      // const username = r[0]!;
      // const uid = r[2]!;
      // const gid = r[3]!;
      // const gecos = r[4]!;
      // const shell = r[6]!;

      // Search for the user in the database.
      const user = users.find((v) => v.id === value[0]);

      // If the user exists on system, but not in dispatch or has been disabled. Disable the user's login.
      if (user === undefined || user.enabled === false) {
        value[6] = '/sbin/nologin';
        passwd[r]! = value.join(':');
        Logging.info(
          `Updated '${
            value[0]
          }' to revoke access to this system.`,
        );
        continue;
      }

      // If the user is on the system, ensure that their access is up to date.
      // Deno.writeFileSync(`${value[5]}/.ssh/authorized_keys`, new TextEncoder().encode([
      //   user.public,
      // ].join('\n')));

      // Update the user's groups.
      for (const r in group) {
        const value = group[r]!.split(':');
        if (value.length < 4) continue;

        const groups = new Set([...value[3]!.split(',')]);
        groups.delete('');
        user.groups.forEach((v) => groups.add(v));
        for (const g of [...groups]) {
          if (!user.groups.includes(g)) {
            groups.delete(g);
            Logging.info(
              `Updated '${value[0]}' to exclude '${user.id}'`,
            );
          }
        }
        value[3] = [...groups].join(',');
        group[r]! = value.join(':');
        Logging.info(
          `Updated '${value[0]}' to include '${user.id}'`,
        );
      }
    }
  }
}
