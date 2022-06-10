import { DispatchedUser } from '../../interface/dispatch.ts';

export class User {
  public static async sync(users: DispatchedUser[]): Promise<void> {
    const decoder = new TextDecoder('utf-8');
    const passwd = decoder.decode(await Deno.readFile('/etc/passwd')).split('\n');
    const update: string[] = [];

    for (const csv of passwd) {
      const entries = csv.split(':');
      if (parseInt(entries[2]!) < 1000 || parseInt(entries[3]!) < 1000) continue;
      for (const user of users) {
        if (entries[0] === user.id) {
          update.push(user.id);
        }
      }
    }

    for (const user of users) {
      if (update.includes(user.id)) {
        // Update the User.
      }
      else {
        // Create the User.
      }
    }
  }
}