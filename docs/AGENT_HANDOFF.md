# Agent handoff — read this first

Dense context for AI agents working on **Flowin** (Next.js 16, RTL Persian survey app). Goal: avoid re-exploring the codebase every session.

**Also read:** `AGENTS.md` (Next.js breaking changes), `docs/openapi.yaml`, `docs/schema.sql`.

---

## Product in one paragraph

Users log in (mock OTP), fill **8 surveys** (`branding`, `campaign`, `email`, `sms`, `push`, `seo`, `social-competitor`, `social-strategy`). Survey **definitions** live in `app/lib/*Form.ts`. Answers persist to **localStorage**; API routes under `app/api/v1/**` are mostly **501 stubs**. Types/contracts: `app/lib/api/*`.

---

## Architecture map

| Area | Path |
|------|------|
| Form configs | `app/lib/*Form.ts`, registered in `app/lib/surveys.ts` |
| Stepper UI | `app/components/SurveyStepper.tsx` |
| Validation | `app/lib/surveyValidation.ts`, `app/lib/platformUrlValidation.ts` |
| Repeater engine | `app/lib/repeater.ts`, `app/lib/nestedRepeater.ts` |
| Parent-synced repeaters | `app/components/ParentSyncedRepeaterInput.tsx` |
| Repeater cells | `app/components/RepeaterFieldCell.tsx` |
| Time picker (custom) | `app/components/TimePickerInput.tsx` |
| Social platform lists | `app/lib/socialPlatforms.ts` |
| Platform+URL fields | `app/lib/socialPlatformRepeaterFields.ts` |
| Answer normalize | `app/lib/api/normalizeSubmission.ts` |

---

## Session work completed (social forms focus)

### 1. Platform-specific URL validation

- Module: `app/lib/platformUrlValidation.ts` — regex per platform (18 platforms), rejects localhost for social links.
- Repeater field flag: `urlPlatformDependsOnKey: "platform"` on `type: "url"`.
- Shared config: `SOCIAL_PLATFORM_URL_REPEATER_FIELDS` in `socialPlatformRepeaterFields.ts`.
- Used in: `socialCompetitorForm.ts` (steps 2, 4, nested step 3), `socialStrategyForm.ts` (step 14).

**Bug fixed:** Optional repeaters (`isAllowedEmpty: true`) skipped URL errors when all fields were filled but URL invalid. Fix in `isRepeaterRowPartial()` (treat invalid filled cells as partial) + `hasInvalidRepeaterUrls()` early check in `getStepValidationErrors`.

### 2. Nested repeater errors (social-competitor step 3)

- Errors now prefixed with field label: `formatRepeaterFieldError()` in `surveyValidation.ts`.
- Validates parent fields (name, priority) and nested platform/url even when partially filled.

### 3. Custom time picker (social-strategy step 9)

- **Do not use** `<input type="time">` — browser shows AM/PM.
- `TimePickerInput.tsx`: 24h `HH:mm`, chevron steppers, click hour/minute → grid popover (portal to `document.body`).
- Wired in `RepeaterFieldCell` when `field.type === "time"` (check is **first** in that component).

### 4. Social-strategy step 8 — content pattern repeater

Question: publishing pattern per platform (contentType + timePeriod + count).

**Sync from step 1 platforms:**
```ts
repeaterSyncFromParent: {
  parentQuestion: INTENDED_SOCIAL_PLATFORMS_QUESTION,
  platformFieldKey: "platform",
  allowMultipleRowsPerPlatform: true,
  maxRowsPerPlatformFieldKey: "contentType",
}
```

**Content types per platform** — `contentType` select uses `conditionalOptions.dependsOnKey: "platform"`:

| Type | Platforms (constants in `socialStrategyForm.ts`) |
|------|--------------------------------------------------|
| پست | `CONTENT_TYPE_POST_PLATFORMS` (most; not توئیچ) |
| استوری | `CONTENT_TYPE_STORY_PLATFORMS` |
| استتوس | `CONTENT_TYPE_STATUS_PLATFORMS` (واتساپ only) |
| لایو | `CONTENT_TYPE_LIVE_PLATFORMS` (**تلگرام removed**) |

Example: **Telegram** → only پست + استوری (max **2 rows**).

**Row limits:** `getRepeaterMaxRowsPerPlatform()` counts options from `resolveRepeaterSelectOptions()` for `maxRowsPerPlatformFieldKey`. UI disables `+` when at cap; sync trims excess rows. Sibling rows hide already-selected content types via `excludeSelectOptions` on `RepeaterFieldCell`.

**Step 9** uses same `allowMultipleRowsPerPlatform: true` but **no** `maxRowsPerPlatformFieldKey` (unlimited time slots per platform).

---

## Repeater patterns (copy these)

### Parent-synced repeater
Steps select platforms in an earlier checkbox; later repeater rows auto-fill `platform` (read-only).

```ts
repeaterSyncFromParent: {
  parentQuestion: "exact question text of parent step",
  platformFieldKey: "platform",
  allowMultipleRowsPerPlatform?: boolean,
  maxRowsPerPlatformFieldKey?: string, // limits rows to # of select options
}
```

UI: `ParentSyncedRepeaterInput` when `step.repeaterSyncFromParent` is set in `SurveyStepper`.

### Conditional select options
```ts
conditionalOptions: {
  dependsOnKey: "platform",
  extraOptions: [
    { option: "پست", whenDependsOnIncludes: [...] },
    { option: "لایو", whenDependsOnIncludes: [...], insertAfter: ["استوری", "استتوس", "پست"] },
  ],
}
```
`insertAfter` accepts `string | string[]` — first anchor found wins.

### Platform + URL pair
Import `SOCIAL_PLATFORM_URL_REPEATER_FIELDS`; override placeholder/inputDir as needed.

---

## Validation rules worth remembering

- All `answers` values are **strings**; complex types are JSON strings.
- Hidden `showIf` steps must **not** be stored (logic in `normalizeSubmission.ts` / visibility helpers).
- Repeater URL: `isValidPlatformUrl(url, platform, { requireSocialLink: true })`.
- Time: `HH:mm` 24h only; range validation via `timeMustBeBeforeKey` / `timeMustBeAfterKey`.
- Optional repeaters: empty = OK; partial or invalid filled fields = errors.

---

## API / backend (not fully implemented)

- OpenAPI: `docs/openapi.yaml`
- Schema: `docs/schema.sql` (PostgreSQL reference)
- Planned tables: `brands`, `survey_submissions`, `submission_answers`, `ui_events`, `uploaded_files`
- User once requested `docs/BACKEND_API.md` for FastAPI team — **may need recreation** if missing; use openapi + types.ts as source.

---

## Dev notes

- Run `npm run dev` on **localhost:3000** (kill stale Next PID if port conflict).
- Hard refresh after UI component changes (`Ctrl+Shift+R`).
- Vercel deploy may lag local changes.
- Build: `npm run build` — project uses Next 16 + Turbopack.

---

## Do not redo without user ask

- Rewriting entire validation layer
- Moving survey definitions to API/CMS
- Committing git changes (user must ask)
- Replacing mock auth

---

## Quick file lookup by task

| User wants… | Start here |
|-------------|------------|
| Change social strategy questions | `app/lib/socialStrategyForm.ts` |
| Change competitor form | `app/lib/socialCompetitorForm.ts` |
| Platform URL regex | `app/lib/platformUrlValidation.ts` |
| Repeater row sync / limits | `app/lib/repeater.ts`, `ParentSyncedRepeaterInput.tsx` |
| Step validation messages | `app/lib/surveyValidation.ts` |
| New step type UI | `SurveyStepper.tsx` + dedicated input component |
| Backend contract | `app/lib/api/types.ts`, `docs/openapi.yaml` |

---

*Last updated: 2026-07-12 — covers social-strategy steps 8–9, time picker, URL validation, nested repeater errors, per-platform content row limits.*
