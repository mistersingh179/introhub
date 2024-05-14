
select count(*) from "ReverseEmailLookupEndpoint";

select count(*) from "ReverseEmailLookupEndpoint" where "response" ->> 'url' is null;

select count(*) from "ReverseEmailLookupEndpoint" where "response" ->> 'error' is not null ;

