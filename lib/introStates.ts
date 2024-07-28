export type IntroStatesKey = keyof typeof IntroStates;

export enum IntroStates {
  draft = "draft",
  "pending approval" = "pending approval",
  "permission email sent" = "permission email sent",
  "permission email send failure" = "permission email send failure",
  "permission email opened" = "permission email opened",
  approved = "approved",
  rejected = "rejected",
  cancelled = "cancelled",
  "introducing email sent" = "introducing email sent",
  "introducing email send failure" = "introducing email send failure",
}

export enum IntroStatesWithMeaning {
  draft = "The introduction is in draft state, allowing changes before submission for approval.",

  "pending approval" = "The introduction is awaiting approval from the prospect.",

  "permission email sent" = "An email requesting the prospect's permission for an introduction has been sent.",

  "permission email send failure" = "Failed to send the email requesting the prospect's permission for an introduction.",

  "permission email opened" = "The email requesting the prospect's permission for an introduction has been opened.",

  approved = "The prospect has approved the introduction. An email introducing both parties will be sent shortly.",

  rejected = "The prospect has rejected the introduction. An email introducing both parties will not be sent.",

  cancelled = "This introduction has been cancelled",

  "introducing email sent" = "An email introducing the prospect to the user has been sent.",

  "introducing email send failure" = "Failed to send the email introducing the prospect to the user.",
}
