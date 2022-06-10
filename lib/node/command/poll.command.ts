import { Configuration } from '../configuration.ts';
import { DispatchedEvent } from '../../interface/dispatch.ts';
import { line } from '../../../deps.ts';
import { Logging } from '../../util/logging.ts';
import { User } from '../function/user.ts';

export class PollCommand extends line.Subcommand {
  public override signature = 'poll';
  public override description =
    'Poll the StratoSphere Server for tasks.';

  public override options = {};

  public override async handle(): Promise<void> {
    // Initialize the node configuration.
    Configuration.initialize();
    const configuration = Configuration.get();

    async function _(): Promise<unknown> {
      // Poll the server for tasks.
      const poll = await fetch(
        `http://${configuration.hostname}:${configuration.port}/api/v1/poll/sync`,
        {
          headers: {
            'Machine-UUID': configuration.uuid,
            'Machine-Secret': configuration.secret,
          },
        },
      );
      if (poll.status !== 200) {
        Logging.error(
          `Failed to parse the JSON.\nError: ${await poll
            .text()}`,
        );
        return;
      }
      const pjson = await poll.json();

      // Parse the tasks.
      return pjson;
    }

    // Repeat the polling task and process the execution.
    const scope = async () => {
      const json = await _() as DispatchedEvent;

      // Process the Users.
      await User.sync(json.users);

      //
    };
    await scope();
    globalThis.setInterval(scope, 5000);

    // Block the program from exiting.
    await new Promise(() => {});
  }
}
