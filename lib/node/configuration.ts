import { path, xdg } from '../../deps.ts';

/** The Configuration Controllerw */
export class Configuration {
  private static readonly location: string = xdg.default
    .configDirs()[0]!;
  private static readonly path: string = path.resolve(
    this.location,
    './strato-node.json',
  );
  private static initialized = false;

  /** Initialize the Configuration Controller. */
  public static initialize(): void {
    if (!this.initialized) {
      Deno.mkdirSync(this.location, { recursive: true });
      this.initialized = true;
    }
  }

  /** Retrieve the current JSONConfiguration. */
  public static get(): JSONConfiguration {
    const read = new TextDecoder().decode(
      Deno.readFileSync(this.path),
    );
    return JSON.parse(read);
  }

  /** Update the current JSONConfiguration. */
  public static set(value: JSONConfiguration): void {
    Deno.writeFileSync(
      this.path,
      new TextEncoder().encode(JSON.stringify(value, null, 2)),
    );
  }
}

/** The structure of the JSONConfiguration. */
export interface JSONConfiguration {
  hostname: string;
  port: number;
  uuid: string;
  secret: string;
}
