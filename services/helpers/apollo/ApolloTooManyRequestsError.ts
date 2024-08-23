export class ApolloTooManyRequestsError extends Error {
  rateLimitInfo: ApolloRateLimitInfo

  constructor(message: string, rateLimitInfo: ApolloRateLimitInfo) {
    super(message + "\n" + JSON.stringify(rateLimitInfo, null, 2));
    this.name = "ApolloTooManyRequestsError";
    this.rateLimitInfo = rateLimitInfo;
    Object.setPrototypeOf(this, ApolloTooManyRequestsError.prototype);
  }
}
