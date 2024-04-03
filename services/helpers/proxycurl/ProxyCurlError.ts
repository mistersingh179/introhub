export class ProxyCurlError extends Error {
  data: Record<string, any>;
  constructor(message: string, data: Record<string, any>) {
    super(message);
    this.name = "ProxyCurlError";
    this.data = data;
    Object.setPrototypeOf(this, ProxyCurlError.prototype);
  }
}