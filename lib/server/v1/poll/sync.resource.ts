import { BaseResource } from '../../base/base.resource.ts';
import { drash } from '../../../../deps.ts';
import { getNode } from '../../helper/nodes.ts';
/**
 * Resource for dispatch to machines based on configured polling. Default is 5s for all machines. Polling is disabled while a task is running.
 *
 * When the machine polls, it will pull the latest queued tasks for the machine and will ALWAYS syncronize the active users and role/permissions.
 *
 * If a node is offline, the job will expire from polling and report task failure.
 *
 * ! UUID AND MACHINE TOKEN USED FOR AUTHENTICATION !
 *
 * Ex:
 * - Dispatched Job(s)
 * - User Access Control
 * - User Management
 * - Update Management
 */

/**
 * Endpoint used to distribute jobs and updates.
 */
export class PollSyncResource extends BaseResource {
  public override paths = this.getPrefixPath('api_v1', [
    '/poll/sync',
  ]);

  public GET(
    request: drash.Request,
    response: drash.Response,
  ): void {
    // Ensure the request is authenticated.
    if (
      request.headers.get('Machine-UUID') === null ||
      request.headers.get('Machine-Secret') === null
    ) {
      return response.json({
        message:
          'Unable to authenticate with the cluster. Please validate the node authorization credentials.',
      }, 403);
    }

    // Get the node from the database and compare the secret.
    const node = getNode(request.headers.get('Machine-UUID')!);
    if (
      node === null ||
      node.secret !== request.headers.get('Machine-Secret')
    ) {
      return response.json({
        message:
          'Unable to authenticate with the cluster. Please validate the node authorization credentials.',
      }, 403);
    }

    // Build the node state.
    // TODO(xCykrix): Dynamic State of Object.
    return response.json({
      machineGroups: [...node.machineGroups],
      dispatched: [
        {
          uuid: globalThis.crypto.randomUUID(),
          group: ['global'],
          until: Date.now() + 30000,
          value: 'echo "task run"',
        },
      ],
      users: [
        {
          enabled: true,
          id: 'samuel-voeller',
          public:
            'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDh6vc9u8bFQmqzowYpB+wJrQp3Ro/hAjrKWhdMPqb/DSEPkce25z1Of8y27VXyVXOwjBMC33BEbfKNoU73xoJ8QHWeCYlwIuiY53Fq8QiljflCmRX4B9q26ZTpxkzgD7YJYPHk33zHXTqYoMBdvlPZNq2gMGr8CP7vcQJ0k3+LWbpxdhux9SW5bcnvT2ie8wQNpR+W9Q+Nvys3ZE/N8CWceKGGQFqeY4qflSFr8OAp5aBc4N4TCBwARFVKH8bkoci1KJSnydsU+EXENeKghFCLFRd8v4jbihvkNH7qp5cecYRHmOWmO0oDIIHvq5MQqxPXH3uw8if+eJhjQbWFiiOigCWSgsm+LunEp/eAjejWGvwBq9606ztSf+y3Tj7KGOTC68/klwOrlpS1v2ByxX6zBJeK6JDiGAflg7JeJSMWLy969D0DBSPM5pq8n+X/JLdHcLpFi9m3QXisQ/+PYREw/A58agWK0csaAcXk1PGSxkgnXsuBnJhTpHRoD2TpP1SnDk0HW9YNg7kAXH04gxm8QWCmuV2Ya8vf4Q64+fmu0cWOQwwWArPDAp9k5LBURUXXMBs3c+SrXUzP4j4rv6HqTc4kSn6EMGA/FN6FjNQ2DwgkLbkH9nVCfrs3mkxa9kCHOf5sTdNcvd7iVBDHFE0Y6di/SLspJEAoRf7XO55Cgw==',
          group: ['sudo', 'docker'],
        },
      ],
    });
  }
}
