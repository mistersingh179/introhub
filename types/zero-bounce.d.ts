interface ValidateEmailResponse {
  address: string;
  status: 'valid' | 'invalid' | 'catch-all' | 'unknown' | 'spamtrap' | 'abuse' | 'do_not_mail';
  sub_status: '' |
    'alternate' |
    'antispam_system' |
    'greylisted' |
    'mail_server_temporary_error' |
    'forcible_disconnect' |
    'mail_server_did_not_respond' |
    'timeout_exceeded' |
    'failed_smtp_connection' |
    'mailbox_quota_exceeded' |
    'exception_occurred' |
    'possible_trap' |
    'role_based' |
    'global_suppression' |
    'mailbox_not_found' |
    'no_dns_entries' |
    'failed_syntax_check' |
    'possible_typo' |
    'unroutable_ip_address' |
    'leading_period_removed' |
    'does_not_accept_mail' |
    'alias_address' |
    'role_based_catch_all' |
    'disposable' |
    'toxic';
  account: string;
  domain: string;
  did_you_mean: string | null;
  domain_age_days: string | null;
  free_email: boolean;
  mx_found: boolean;
  mx_record: string;
  smtp_provider: string | null;
  firstname: string | null;
  lastname: string | null;
  gender: 'male' | 'female' | null;
  country: string | null;
  region: string | null;
  city: string | null;
  zipcode: string | null;
  processed_at: string;
}

interface ValidateEmailError {
  error: string;
}

type ValidateEmailApiResponse = ValidateEmailResponse | ValidateEmailError;
