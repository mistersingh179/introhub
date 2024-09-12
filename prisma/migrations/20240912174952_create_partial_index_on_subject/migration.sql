-- manally created subject

CREATE INDEX message_subject_partial_idx ON "Message" (subject)
    WHERE char_length(subject) <= 200;