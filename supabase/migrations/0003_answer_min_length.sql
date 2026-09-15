-- 작성 부담을 낮추되 500자 상한은 유지한다.
alter table answers
  drop constraint if exists answers_content_check;

alter table answers
  add constraint answers_content_check
  check (char_length(trim(content)) between 1 and 500);