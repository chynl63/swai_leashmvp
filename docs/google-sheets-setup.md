# Google Sheets 백엔드 연동 가이드

이 데모의 백엔드는 **Google Apps Script + Google Sheets**입니다.
(과제 제출용 DB 요건) 프런트엔드는 JSONP로 Apps Script 웹앱을 호출합니다.

스프레드시트: https://docs.google.com/spreadsheets/d/1I00-WMp4kZkbplIEGgPqgNAGzqtVISgYQxhoqsugVkA/edit

---

## 1. 시트(탭) 준비

스프레드시트에 아래 **두 개의 탭**을 만들고, **1행에 헤더**를 정확히 입력하세요.
(Apps Script가 1행을 헤더로 읽고, `id` 열이 반드시 있어야 합니다.)

### 탭 이름: `approval_requests`  — 감시자 승인
| id | guardian_name | status | created_at |
|----|---------------|--------|------------|

### 탭 이름: `events`  — 데모 활동 로그
| id | type | detail | created_at |
|----|------|--------|------------|

> `type` 예시: `session_start`, `session_completed`, `leash_broken`,
> `resist`, `bench`, `fine`

---

## 2. Apps Script 배포

1. 스프레드시트 → **확장 프로그램 → Apps Script**
2. 제공된 `doGet` 코드를 붙여넣고 저장 (`SHEET_URL`이 이 스프레드시트를 가리키는지 확인)
3. 우상단 **배포 → 새 배포 → 유형: 웹 앱**
   - 실행 계정: 본인
   - 액세스 권한: **모든 사용자(익명 포함)**  ← JSONP 호출에 필요
4. 배포 후 나오는 **웹 앱 URL**(`https://script.google.com/macros/s/XXXX/exec`)을 복사

---

## 3. 프런트엔드에 URL 연결

`.env.local` (로컬) 또는 Netlify 환경변수에 등록:

```
NEXT_PUBLIC_SHEET_API_URL=https://script.google.com/macros/s/XXXX/exec
```

서버를 재시작(`npm run dev`)하면 연결됩니다.

---

## 4. 동작 확인

- 데모에서 **하드코어 프로필 → 목줄 채우기 → 차단된 앱 열어보기 → 벌칙 → 감시자 승인**
  진입 시 `approval_requests` 시트에 `pending` 행이 추가됩니다.
- 승인 링크를 **다른 기기/탭**에서 열어 승인하면 시트의 `status`가 `approved`로 바뀌고,
  앱이 폴링으로 이를 감지해 자동 해제됩니다.
- 산책 시작/참기/벌금 등은 `events` 시트에 자동 기록됩니다.

> URL을 넣지 않아도 데모는 동작합니다(같은 브라우저 탭 간 폴백). 단, 다른 기기 승인과
> 시트 기록은 URL이 있어야 동작합니다.

---

## API 요약 (Apps Script 계약)

GET `…/exec?action=<read|insert|update|delete>&table=<탭이름>&...&callback=<fn>`

| action | 추가 파라미터 | 설명 |
|--------|---------------|------|
| read   | `id`(선택)    | id 있으면 단일 행, 없으면 전체 |
| insert | `data`(JSON)  | 같은 `id` 있으면 업서트 |
| update | `id`, `data`  | 해당 행 갱신 |
| delete | `id`          | 해당 행 삭제 |

응답은 `{ success, data }` 형태이며 `callback` 파라미터가 있으면 JSONP로 감쌉니다.
