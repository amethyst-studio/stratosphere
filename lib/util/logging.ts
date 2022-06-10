export class Logging {
  public static info(message: string): void {
    console.info(
      `[${new Date().toISOString()}] (INFO) ${message}`,
    );
  }

  public static warn(message: string): void {
    console.warn(
      `[${new Date().toISOString()}] (WARN) ${message}`,
    );
  }

  public static error(message: string, err?: Error): void {
    console.error(
      `[${new Date().toISOString()}] (ERROR) ${message}${
        (err !== undefined) ? '\n' : ''
      }`,
      err !== undefined ? err : '',
    );
  }
}
