// Define the interface for the request payload
interface PeopleEnrichmentRequest {
  id?: string;
  first_name?: string;
  last_name?: string;
  organization_name?: string;
  email?: string;
  hashed_email?: string;
  domain?: string;
  reveal_personal_emails?: boolean;
  linkedin_url?: string;
  reveal_phone_number?: boolean;
  webhook_url?: string;
}

// Define interfaces for the response structure
interface PeopleEnrichmentResponse {
  person: {
    id: string;
    first_name: string;
    last_name: string;
    name: string;
    linkedin_url: string;
    title: string;
    email_status: string | null;
    photo_url: string;
    twitter_url: string | null;
    github_url: string | null;
    facebook_url: string | null;
    extrapolated_email_confidence: number | null;
    headline: string;
    email: string;
    organization_id: string;
    employment_history: EmploymentHistory[];
    state: string;
    city: string;
    country: string;
    organization: OrganizationDetails;
    phone_numbers: PhoneNumber[];
    intent_strength: number | null;
    show_intent: boolean;
    revealed_for_current_team: boolean;
    hashed_email: string;
    personal_emails: string[];
    departments: string[];
    subdepartments: string[];
    functions: string[];
    seniority: string;
  };
}

interface EmploymentHistory {
  _id: string;
  current: boolean;
  start_date: string;
  end_date: string | null;
  title: string;
  organization_name: string;
  organization_id: string | null;
}

interface OrganizationDetails {
  id: string;
  name: string;
  website_url: string;
  blog_url: string | null;
  angellist_url: string | null;
  linkedin_url: string;
  twitter_url: string;
  facebook_url: string;
  primary_phone: PhoneDetails;
  languages: string[];
  alexa_ranking: number;
  phone: string;
  linkedin_uid: string;
  founded_year: number;
  publicly_traded_symbol: string | null;
  publicly_traded_exchange: string | null;
  logo_url: string;
  crunchbase_url: string | null;
  primary_domain: string;
  sanitized_phone: string;
  industry: string;
  keywords: string[];
  estimated_num_employees: number;
  industries: string[];
  secondary_industries: string[];
  snippets_loaded: boolean;
  industry_tag_id: string;
  industry_tag_hash: Record<string, string>;
  retail_location_count: number;
  raw_address: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  owned_by_organization_id: string | null;
  suborganizations: any[];
  num_suborganizations: number;
  seo_description: string;
  short_description: string;
  annual_revenue: number;
  total_funding: number;
  latest_funding_round_date: string;
  latest_funding_stage: string;
  funding_events: FundingEvent[];
}

interface PhoneDetails {
  number: string;
  source: string;
  country_code_added_from_hq: boolean;
}

interface PhoneNumber {
  raw_number: string;
  sanitized_number: string;
  type: string;
  position: number;
  status: string | null;
  dnc_status: string | null;
  dnc_other_info: string | null;
}

interface FundingEvent {
  id: string;
  date: string;
  news_url: string | null;
  type: string;
  investors: string;
  amount: string;
  currency: string;
}

interface ApolloRateLimitInfo {
  "x-24-hour-requests-left": number;
  "x-24-hour-usage": number;
  "x-hourly-requests-left": number;
  "x-hourly-usage": number;
  "x-minute-requests-left": number;
  "x-minute-usage": number;
  "x-rate-limit-24-hour": number;
  "x-rate-limit-hourly": number;
  "x-rate-limit-minute": number;
}

