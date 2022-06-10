import { BaseResource } from '../../base/base.resource.ts';
import { configuration } from '../../../../store/configuration.ts';
import { createNodeUUID, setNode } from '../../helper/nodes.ts';
import { cryptoRandomString, drash } from '../../../../deps.ts';
import { Logging } from '../../../util/logging.ts';

/**
 * Endpoint used to register the node to the server.
 */
export class NodeRegisterResource extends BaseResource {
  public override paths = this.getPrefixPath('api_v1', [
    '/node/register',
  ]);

  public GET(
    request: drash.Request,
    response: drash.Response,
  ): void {
    // Ensure the request is authenticated.
    if (
      (request.headers.get('Server-UUID') !==
          configuration.cluster.id ||
        request.headers.get('Server-Secret') !==
          configuration.cluster.secret)
    ) {
      return response.json({
        message:
          'Unable to authenticate with the cluster. Please check the configuration authorization credentials.',
      }, 403);
    }

    // Get the hostname passed for initialization.
    const hostname = request.headers.get('Machine-Hostname');
    if (hostname === null) {
      return response.json({
        message:
          'The hostname was not specified. The request should include \'Machine-Hostname\' as a header.',
      });
    }

    // Get the operating system passed for initialization.
    const os = request.headers.get('Machine-OS');
    if (os === null) {
      return response.json({
        message:
          'The operating system was not specified. The request should include \'Machine-OS\' as a header.',
      });
    }

    // Create the default node configuration with generated values.
    const node = {
      ...configuration.node,
      uuid: createNodeUUID(),
      secret: cryptoRandomString.cryptoRandomString({
        length: 128,
      }),
    };

    // Insert the node into the database. Verification is false by default.
    try {
      setNode({
        uuid: node.uuid,
        secret: node.secret,
        machineGroups:
          request.headers.get('Machine-Groups') !== null
            ? new Set(
              request.headers.get('Machine-Groups')!.split(','),
            )
            : new Set(['global']),
        hostname,
        os,
        verified: 0,
      });
    } catch (err) {
      Logging.error(
        'Failed to register a node with this cluster.',
        err,
      );
      return response.json({
        message:
          'Failed to register the node with this cluster.',
        err: err.message,
      }, 400);
    }

    // Respond with the node configuration needed to connect to the cluster.
    return response.json({
      message: 'Successfully registered with the cluster.',
      node,
    }, 200);
  }
}
