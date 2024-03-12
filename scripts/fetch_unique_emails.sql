-- with distinct on
-- if 2 users have the same email, then picks the first one which it encounters
-- we user order by to get the one we want picked first
-- here by ordering in desc on received count we are making the one with highest receivedCount get picked first

select distinct on (email) email, "receivedCount", "userId"
from "Contact"
order by email ASC, "receivedCount" DESC;

-- with row_number window function
with has_row_num as (select row_number() over (partition by email order by "receivedCount" DESC) as row_num,
                            *
                     from "Contact")
select email, "userId", "receivedCount"
from has_row_num
where row_num = 1;

-- with group by
-- but will give email twice if they have same receivedCount
select *
from "Contact"
where (email, "receivedCount") in (select email, max("receivedCount") from "Contact" group by "Contact".email);

-- check
select count(*)
from "Contact";
select count(*)
from (
select distinct on (email) email, "receivedCount", "userId"
from "Contact"
order by email ASC, "receivedCount" DESC) as foo;
