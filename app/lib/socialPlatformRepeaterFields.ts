import type { RepeaterFieldConfig } from "./repeater";
import { SOCIAL_PLATFORM_OPTIONS } from "./socialPlatforms";

/** Platform select + platform-scoped URL field (used in competitor and strategy forms). */
export const SOCIAL_PLATFORM_URL_REPEATER_FIELDS = [
  {
    key: "platform",
    type: "select",
    placeholder: "پلتفرم",
    options: [...SOCIAL_PLATFORM_OPTIONS],
  },
  {
    key: "url",
    type: "url",
    placeholder: "لینک صفحه",
    urlPlatformDependsOnKey: "platform",
  },
] satisfies RepeaterFieldConfig[];
