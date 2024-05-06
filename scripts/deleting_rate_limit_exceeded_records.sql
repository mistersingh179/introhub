select *
from "ReverseEmailLookupEndpoint"
where response ->> 'error' like '%Rate limit exceeded.%';

delete from "ReverseEmailLookupEndpoint"
where response ->> 'error' like '%Rate limit exceeded.%';

DELETE
FROM "PersonProfile"
    USING "ReverseEmailLookupEndpoint"
WHERE "PersonProfile".email = "ReverseEmailLookupEndpoint".email
  AND response ->> 'error' LIKE '%Rate limit exceeded.%';

select *
FROM "PersonProfile"
         inner join "ReverseEmailLookupEndpoint" on
    "PersonProfile".email = "ReverseEmailLookupEndpoint".email
        AND response ->> 'error' LIKE '%Rate limit exceeded.%';
