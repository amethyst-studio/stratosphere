import { DispatchedUser } from '../../interface/dispatch.ts';

export class User {
  public static async sync(users: DispatchedUser[]): Promise<void> {
    const decoder = new TextDecoder('utf-8');
    const passwd = decoder.decode(await Deno.readFile('/etc/passwd')).split('\n');
    const update: string[] = [];

    for (const csv of passwd) {
      const entries = csv.split(':');
      if (parseInt(entries[2]!) < 1000 || parseInt(entries[3]!) < 1000) continue;
      if (parseInt(entries[2]!) === 65534 || parseInt(entries[3]!) === 65534) continue;
      if (csv.trim() === '') continue;
      for (const user of users) {
        if (entries[0] === user.id) {
          update.push(user.id);
          continue;
        }
        console.info('"', csv, '"');
        console.info('deactivate:', entries[0], entries);
      }
    }

    for (const user of users) {
      if (update.includes(user.id)) {
        // Update the User.
        console.info('sync:', user)
      }
      else {
        // Create the User.
        console.info('create:', user);
      }
    }
  }
}
