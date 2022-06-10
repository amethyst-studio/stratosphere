import { BaseResource } from '../../base/base.resource.ts';
import { drash } from '../../../../deps.ts';
import { getNode, setNode } from '../../helper/nodes.ts';

/**
 * Endpoint used to validate the node is able to connect with the server.
 */
export class NodeValidateResource extends BaseResource {
  public override paths = this.getPrefixPath('api_v1', [
    '/node/validate',
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

    // If the node is not verified, report as verified.
    if (node.verified !== 1) {
      node.verified = 1;
      setNode(node);
    }

    // Respond with acknowledging the node has been validated.
    return response.json({
      message: 'Successfully connected to the cluster.',
    }, 200);
  }
}
