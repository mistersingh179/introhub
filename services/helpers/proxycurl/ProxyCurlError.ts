export class ProxyCurlError extends Error {
  data: Record<string, any>;
  constructor(message: string, data: Record<string, any>) {
    super(message + "\n" + JSON.stringify(data, null, 2));
    this.name = "ProxyCurlError";
    this.data = data;
    Object.setPrototypeOf(this, ProxyCurlError.prototype);
  }
}
