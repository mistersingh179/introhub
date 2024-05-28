-- users with ZERO (0) contacts!!
with foo as (select "User".email, count(C.id) as count
             from "User"
                      left join public."Contact" C on "User".id = C."userId"
             group by "User".email
             having count(C.id) = 0)
select "User".id, "User".email, "User"."createdAt", foo.count, A.scope
from "User"
         inner join "foo" on "User".email = foo.email
         inner join public."Account" A on "User".id = A."userId"
order by "User"."createdAt" DESC;

select count(*)
from "Contact"
         inner join public."PersonProfile" PP on "Contact".email = PP.email
where PP."linkedInUrl" is not null;

select count(*)
from "Contact";

select *
from "User"
         inner join public."Account" A on "User".id = A."userId";

select "User".email, count(C.id)
from "User"
         left join public."Message" C on "User".id = C."userId"
group by "User".email

