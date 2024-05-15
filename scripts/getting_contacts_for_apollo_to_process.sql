SELECT C.email,
       PP."linkedInUrl",
       PEE.response
FROM "Contact" C
         LEFT JOIN public."PersonProfile" PP ON C.email = PP.email
         LEFT JOIN "PeopleEnrichmentEndpoint" PEE ON C.email = PEE.email
WHERE PP."linkedInUrl" IS NULL
  AND (
    (PEE.email IS NULL)
        OR
    (PEE.email IS NOT NULL AND PEE.response -> 'person' ->> 'linkedin_url' IS NOT NULL)
    );

select * from "ReverseEmailLookupEndpoint" where email='foobar@foo.com';

select * from "PersonProfile" where email='foobar@foo.com';

select * from "PersonProfile";