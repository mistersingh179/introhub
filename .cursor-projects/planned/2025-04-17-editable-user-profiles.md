# Project: Editable User Profiles
- **Created**: 2025-04-17
- **Status**: Planned
- **Last Updated**: 2025-04-17

## Context & Requirements
Current user profiles in IntroHub rely entirely on LinkedIn data pulled through Apollo, which causes approximately 20% of users to be blocked from full participation due to missing or outdated company data. This leads to frustration, support issues, and potential churn, especially among paying users.

This project will implement editable user profile fields, allowing users to correct or provide missing information to unblock their experience, particularly for the Genius Connect functionality.

## Development Plan

### Phase 1: MVP (April 26, 2025)
- [✅] Update Prisma schema to track user-edited vs. third-party sourced fields
- [✅] Create profile editing form components and validation
- [✅] Implement server actions for profile updates
- [✅] Add UI indicators for user-edited vs. third-party sourced data
- [✅] Update Profile page to include edit capabilities

#### Technical Implementation Details

1. **Schema Changes:**
   ```prisma
   // Add new fields to PersonProfile model
   model PersonProfile {
     id                String                      @id @default(cuid())
     email             String                      @unique
     personExperiences PersonExperience[]
     linkedInUrl       String?
     fullName          String?
     city              String?
     country           String?
     state             String?
     lastUpdatedAt     DateTime?
     seniority         String?
     isLikelyToEngage  Boolean?
     headline          String?
     workFunctions     PersonProfileWorkFunction[]
     departments       PersonProfileDepartment[]
     llmDescription    String?
     
     // New fields for user-edited data
     userEditedFullName     String?
     userEditedLinkedInUrl  String?
     userEditedHeadline     String?
     isUserEdited           Boolean           @default(false)
     lastUserEditAt         DateTime?
     userEditedCity         String?
     userEditedCountry      String?
     userEditedState        String?
     userEditedSeniority    String?
   }
   
   // Add new fields to PersonExperience model
   model PersonExperience {
     id                 String        @id @default(cuid())
     personProfileId    String
     personProfile      PersonProfile @relation(fields: [personProfileId], references: [id], onDelete: Cascade, onUpdate: Cascade)
     companyName        String?
     companyLinkedInUrl String
     jobTitle           String?
     jobDescription     String?
     
     // New fields for user-edited data
     userEditedCompanyName        String?
     userEditedCompanyLinkedInUrl String?
     userEditedJobTitle           String?
     isUserEdited                 Boolean  @default(false)
     lastUserEditAt               DateTime?
     userEditedJobDescription     String?
   }
   ```

2. **Server Actions:**
   Create new server actions for profile edits under `app/actions/profile/`:
   - `updateUserProfileAction.ts` - For updating user's personal data
   - `updateUserExperienceAction.ts` - For updating user's experience data

3. **UI Components:**
   - Create editable profile form in `app/dashboard/profile/EditableProfileForm.tsx`
   - Update existing profile page to include edit capability

4. **Service Updates:**
   - Modify `getProfiles.ts` to prioritize user-edited data when available

### Phase 2: Workflow Integration (May 10, 2025)
- [✅] Update user onboarding flow to include profile validation
- [✅] Add profile completion progress indicator
- [✅] Implement contextual tooltips for field completion
- [ ] Create notification system for incomplete profiles

#### Technical Implementation Details

1. **Onboarding Flow Updates:**
   - Add profile completion step to `app/onboarding/` flow
   - Create progress indicator component

2. **Validation:**
   - Implement field validation to ensure correct formatting of LinkedIn URLs
   - Add tooltips showing examples of expected data

3. **Notification System:**
   - Create notification component for incomplete profiles
   - Implement backend logic to check profile completeness

### Phase 3: Data Safety & Moderation (May 24, 2025)
- [ ] Add email notifications for user profile edits
- [ ] Create system for introducers to see self-written bios before intros
- [ ] Implement "Report profile" functionality
- [ ] Add admin interface for profile moderation

#### Technical Implementation Details

1. **Email Notifications:**
   - Create email templates for profile updates
   - Implement notification triggers in server actions

2. **Intro Flow Updates:**
   - Modify introduction request flow to show profile data source
   - Add opt-in approval step for introducers

3. **Reporting:**
   - Create "Report profile" UI component
   - Implement reporting backend logic

4. **Admin Interface:**
   - Add admin panel section for reviewing reported/edited profiles
   - Create approval workflow

## Notes & References

1. Current profile page: `app/dashboard/profile/page.tsx`
2. Profile data services: `services/getProfiles.ts` and `services/getEmailAndCompanyUrlProfiles.ts`
3. User schema: `prisma/schema.prisma` - `PersonProfile` and `PersonExperience` models

**Key Considerations:**
- All user-edited fields should be clearly marked in the UI to differentiate from LinkedIn/Apollo data
- We should prioritize user-edited data over third-party data when both exist
- User edits should be tracked for audit purposes
- Consider a mechanism to reconcile user edits with new Apollo data pulls in the future 