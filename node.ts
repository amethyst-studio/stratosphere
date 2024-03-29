import { line } from './deps.ts';
import { PollCommand } from './lib/node/command/poll.command.ts';
import { RegisterCommand } from './lib/node/command/register.command.ts';

// deno install -A -f --name=stratosphere --no-check --reload --unstable https://raw.githubusercontent.com/amethyst-studio/stratosphere/main/node.ts

class MainCommand extends line.MainCommand {
  public override signature = 'stratosphere';

  public override subcommands = [
    RegisterCommand,
    PollCommand,
  ];
}

const cli = new line.CLI({
  name: 'StratoSphere Client',
  description: 'StratoSphere Client for Node Servers',
  version: '1.0.0',
  command: MainCommand,
});
cli.run();
