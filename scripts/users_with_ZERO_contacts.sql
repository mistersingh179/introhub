select "User".email, count(C.id) as count
from "User"
         left join public."Contact" C on "User".id = C."userId"
where "User".email not in
      ('sandeep@introhub.net', 'rod@introhub.net', 'mistersingh179@gmail.com', 'jrftbzcarcalendar@gmail.com',
       'rod@brandweaver-email.com')
group by "User".email
having count(C.id) > 0;

-- users with ZERO (0) contacts!!
with foo as (select "User".email, count(C.id) as count
             from "User"
                      left join public."Contact" C on "User".id = C."userId"
             group by "User".email
             having count(C.id) = 0)
select "User".id, "User".email, A.scope, "User"."createdAt", foo.count
from "User"
         inner join "foo" on "User".email = foo.email
         inner join public."Account" A on "User".id = A."userId"
order by "User"."createdAt" DESC;


select count(*)
from "Contact";

select count(*)
from "Contact"
         inner join public."PersonProfile" PP on "Contact".email = PP.email
where PP."linkedInUrl" is not null;

