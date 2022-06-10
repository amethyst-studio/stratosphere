import { configuration } from './store/configuration.ts';
import { drash } from './deps.ts';
import { Logging } from './lib/util/logging.ts';
import { NodeRegisterResource } from './lib/server/v1/node/register.resource.ts';
import { NodeValidateResource } from './lib/server/v1/node/validate.resource.ts';
import { PollDispatchResource } from './lib/server/v1/poll/dispatch.resource.ts';
import { PollSyncResource } from './lib/server/v1/poll/sync.resource.ts';
import { SQLite } from './lib/database/sqlite.ts';

/**
 * Initialize the StratoSphere Service.
 */
// deno-lint-ignore require-await
export async function main(): Promise<void> {
  SQLite.initialize();

  const server = new drash.Server({
    hostname: configuration.cluster.hostname,
    port: configuration.cluster.port,
    protocol: 'http',
    resources: [],
  });
  server.addResource(NodeRegisterResource);
  server.addResource(NodeValidateResource);
  server.addResource(PollDispatchResource);
  server.addResource(PollSyncResource);

  server.run();
}

// Launch the Server.
main()
  .then(() => {
    Logging.info('StratoSphere Server is started and online.');
  })
  .catch((err) => {
    Logging.error(
      'StratoSphere Server has failed to start.',
      err,
    );
  });
