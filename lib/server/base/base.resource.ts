import { drash } from '../../../deps.ts';

export class BaseResource extends drash.Resource {
  private readonly prefix: { [key: string]: string } = {
    api_v1: '/api/v1',
  };

  protected getPrefixPath(
    prefix: string,
    paths: string[],
  ): string[] {
    console.info(
      `${paths.map((path) => `${this.prefix[prefix]}${path}`)}`,
    );
    return paths.map((path) => `${this.prefix[prefix]}${path}`);
  }
}
