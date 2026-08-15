-- ============================================================================
-- Seed: question bank
-- Assigns one question per day starting today (CURRENT_DATE), ordered to
-- alternate light/heavy questions and keep tail-question chains adjacent.
-- Re-running is safe: conflicts on publish_date are ignored.
-- ============================================================================

with bank (ord, text, category) as (
  values
    (0,  '음악을 좋아하세요?',                         '취미'),
    (1,  '음악이란 당신 인생에서 어떤 건가요?',         '취미'),
    (2,  '운동을 좋아하시나요?',                        '취미'),
    (3,  '어떤 운동을 좋아하시나요?',                   '취미'),
    (4,  '사랑이란 뭔가요?',                            '사랑'),
    (5,  '여행 다니는 걸 좋아하나요?',                  '취미'),
    (6,  '좋아하는 나라가 있나요?',                     '취미'),
    (7,  '어떤 여행 스타일을 좋아하나요?',              '취미'),
    (8,  '어떤 사랑을 하고 싶나요?',                    '사랑'),
    (9,  '삶에 있어서 돈은 얼마나 중요한가요?',         '가치관'),
    (10, '꿈이 뭔가요?',                                '꿈'),
    (11, '무엇을 하며 살고 싶은가요?',                  '꿈'),
    (12, '어떻게 살고 싶은가요?',                       '꿈'),
    (13, '인생의 목표가 뭔가요?',                       '꿈'),
    (14, '어떤 사랑을 해왔나요?',                       '사랑'),
    (15, '연애란 뭘까요?',                              '사랑'),
    (16, '결혼을 하고 싶나요?',                         '사랑'),
    (17, '장거리 연애는 어때요?',                       '사랑'),
    (18, '국제 연애는 어때요?',                         '사랑')
)
insert into questions (text, category, publish_date)
select text, category, (current_date + ord)::date
from bank
on conflict (publish_date) do nothing;
