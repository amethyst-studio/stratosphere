import { Configuration } from '../configuration.ts';
import { line } from '../../../deps.ts';
import { Logging } from '../../util/logging.ts';

export class RegisterCommand extends line.Subcommand {
  public override signature = 'register';
  public override description =
    'Register this node with a StratoSphere Server.';

  public override options = {
    '--server [value]':
      'The hostname and port of the StratoSphere Server.',
    '--uuid [value]': 'The uuid of the StratoSphere Server.',
    '--secret [value]':
      'The secret of the StratoSphere Server.',
  };

  public override async handle(): Promise<void> {
    // Initialize the node configuration.
    Configuration.initialize();

    // Fetch the server option.
    const server = this.option('--server');
    if (server === undefined) {
      return Logging.error(
        `The '--server' option is required to initialize this node.`,
      );
    }

    // Fetch the uuid option.
    const uuid = this.option('--uuid');
    if (uuid === undefined) {
      return Logging.error(
        `The '--uuid' option is required to initialize this node.`,
      );
    }

    // Fetch the secret option.
    const secret = this.option('--secret');
    if (secret === undefined) {
      return Logging.error(
        `The '--secret' option is required to initialize this node.`,
      );
    }

    // Make a request to the StratoSphere Server.
    const register = await fetch(
      `http://${server}/api/v1/node/register`,
      {
        headers: {
          'Server-UUID': uuid as string,
          'Server-Secret': secret as string,
          'Machine-Hostname': Deno.hostname(),
          'Machine-OS': Deno.osRelease(),
        },
      },
    );
    const rjson = await register.json();
    if (register.status !== 200) {
      return Logging.error(
        `Failed to register this node with the StratoSphere Server.\nMessage: ${rjson.message}\nErr: ${rjson.err}`,
      );
    }

    // Make the subsequent validation request to the StratoSphere Server.
    const validation = await fetch(
      `http://${server}/api/v1/node/validate`,
      {
        headers: {
          'Machine-UUID': rjson.node.uuid,
          'Machine-Secret': rjson.node.secret,
        },
      },
    );
    const vjson = await validation.json();
    if (validation.status !== 200) {
      return Logging.error(
        `Failed to validate this node with the StratoSphere Server.\nMessage: ${vjson.message}\nErr: ${vjson.err}`,
      );
    }

    Configuration.set(rjson.node);
    return Logging.info(
      `Successfully registered this node with the StratoSphere Server.\nUUID: ${rjson.node.uuid}\nSecret: ${rjson.node.secret}`,
    );
  }
}
