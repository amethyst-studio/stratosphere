import { BaseResource } from '../../base/base.resource.ts';
import { drash } from '../../../../deps.ts';
// import { getNode } from '../../helper/nodes.ts';

/**
 * Endpoint used to distribute jobs and updates.
 */
export class PollDispatchResource extends BaseResource {
  public override paths = this.getPrefixPath('api_v1', [
    '/poll/dispatch',
  ]);

  public POST(
    request: drash.Request,
    response: drash.Response,
  ): void {
    return response.json({ state: 1 }, 200);
  }
}
