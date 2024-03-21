export type IntroStatesKey = keyof typeof IntroStates;

export enum IntroStates {
  draft = "draft",
  "pending approval" = "pending approval",
  approved = "approved",
  "pending credits" = "pending credits",
  "email sent" = "email sent",
  rejected = "rejected",
  cancelled = "cancelled",
  expired = "expired",
}
export enum IntroStatesWithMeaning {
  draft = "The introduction has been started but has not yet been submitted for approval. It's in a draft state, allowing the requester to make changes before submission.",

  "pending approval" = "The introduction has been submitted for approval by the requester and is awaiting approval or rejection from the facilitator.",

  approved = "The introduction has been approved by the facilitator and is awaiting email sending by the system. The email will be sent shortly.",

  "pending credits" = "The introduction has been approved by the facilitator, but the introducer needs to acquire sufficient credits before sending the email.",

  "email sent" = "The email associated with the introduction has been successfully sent.",

  rejected = "The introduction has been rejected by the facilitator.",

  cancelled = "The introduction has been cancelled.",

  expired = "The introduction has been expired.",
}
