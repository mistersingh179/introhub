select * from "Account";

WITH Sent AS (
    SELECT
        "toAddress" AS email,
        COUNT(*) AS sent_count
    FROM
        "Message"
    WHERE
        "userId" = 'clt95kpbv0003652vv9z5ehsw' and
        "fromAddress" = 'sandeep@brandweaver.ai'
    GROUP BY
        "toAddress"
    HAVING COUNT(*) > 0
    ORDER BY COUNT(*) DESC
),
Received AS (
    SELECT
        "fromAddress" AS email,
        COUNT(*) AS received_count
    FROM
        "Message"
    WHERE
        "userId" = 'clt95kpbv0003652vv9z5ehsw' and
        "deliveredTo" = 'sandeep@brandweaver.ai'
    GROUP BY
        "fromAddress"
    HAVING COUNT(*) > 0
    ORDER BY COUNT(*) DESC
),
contacts as (select COALESCE(Sent.email, Received.email) AS email,
       COALESCE(sent_count, 0) AS sent_count,
       COALESCE(received_count, 0) AS received_count,
       CASE
           WHEN COALESCE(received_count, 0) = 0 THEN NULL
           ELSE round((CAST(sent_count AS FLOAT) / received_count)::numeric, 2)
           END AS send_receive_ratio
from Sent full outer join Received ON Sent.email = Received.email
where sent_count > 0 and received_count > 0
order by send_receive_ratio DESC)
select * from contacts;

