"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import BrandVisualIdentityInput from "./BrandVisualIdentityInput";
import FileUploadInput from "./FileUploadInput";
import ShamsiDateInput from "./ShamsiDateInput";
import NamedShamsiDatesInput from "./NamedShamsiDatesInput";
import NumericInput, { isNumericStepValueValid } from "./NumericInput";
import FieldErrorMessage from "./FieldErrorMessage";
import {
  getStepValidationErrors,
  hasStepValidationErrors,
  isStepAnswerValid,
  ROOT_FIELD_KEY,
  type StepValidationErrors,
} from "../lib/surveyValidation";
import type { ShowIfCondition, SurveyConfig, SurveyStep } from "../lib/surveys";
import {
  isBrandVisualIdentityEmpty,
  parseBrandVisualIdentityValue,
  serializeBrandVisualIdentityValue,
} from "../lib/brandVisualIdentity";
import {
  EMPTY_PERSONA_FIELDS,
  isPersonaFieldsEmpty,
  parsePersonaFieldsValue,
  serializePersonaFieldsValue,
} from "../lib/personaFields";
import PersonaFieldsInput from "./PersonaFieldsInput";
import GeoLocationInput from "./GeoLocationInput";
import {
  EMPTY_GEO_LOCATION,
  hasIncompleteGeoLocationEntries,
  isGeoLocationEmpty,
  parseGeoLocationValue,
  serializeGeoLocationValue,
} from "../lib/geoLocation";
import {
  EMPTY_FILE_UPLOAD,
  isFileUploadEmpty,
  parseFileUploadValue,
  serializeFileUploadValue,
} from "../lib/fileUpload";
import {
  createEmptyRepeaterValue,
  getRepeaterFields,
  getPlainCheckboxSelections,
  hasIncompleteRepeaterRows,
  isRepeaterCellValid,
  isRepeaterEmpty,
  isRepeaterRowComplete,
  isSyncedRepeaterEmpty,
  parseRepeaterValue,
  serializeRepeaterValue,
} from "../lib/repeater";
import {
  countCompleteNestedRows,
  createEmptyNestedRepeaterValue,
  getNestedRepeaterConfig,
  hasIncompleteNestedRepeaterRows,
  hasInvalidNestedRepeaterCells,
  isNestedRepeaterEmpty,
  parseNestedRepeaterValue,
  serializeNestedRepeaterValue,
} from "../lib/nestedRepeater";
import {
  createEmptyPercentageAllocation,
  isPercentageAllocationEmpty,
  parsePercentageAllocationValue,
  serializePercentageAllocationValue,
} from "../lib/percentageAllocation";
import PercentageAllocationInput from "./PercentageAllocationInput";
import RepeaterInput from "./RepeaterInput";
import ParentSyncedRepeaterInput from "./ParentSyncedRepeaterInput";
import JourneyFunnelInput from "./JourneyFunnelInput";
import NestedRepeaterInput from "./NestedRepeaterInput";
import {
  EMPTY_CHECKBOX_WITH_OTHER,
  getCheckboxSelections,
  isCheckboxStepEmpty,
  parseCheckboxStepValue,
  serializeCheckboxStepValue,
  stepHasOtherOption,
  type CheckboxWithOtherValue,
} from "../lib/checkboxWithOther";
import {
  EMPTY_NAMED_SHAMSI_DATES,
  hasIncompleteNamedShamsiDates,
  isNamedShamsiDatesEmpty,
  parseNamedShamsiDatesValue,
  serializeNamedShamsiDatesValue,
} from "../lib/namedShamsiDates";
import {
  EMPTY_CHECKBOX_WITH_SUB_OPTIONS,
  getCheckboxSelectionsFromValue,
  getCheckboxSubOptionConfigs,
  hasInvalidCheckboxSubSelections,
  parseCheckboxStepValueWithSubs,
  serializeCheckboxStepValueWithSubs,
  stepHasCheckboxSubOptions,
  type CheckboxWithSubOptionsValue,
} from "../lib/checkboxWithSubOptions";
import { buildSubmissionPayload } from "../lib/api/normalizeSubmission";
import {
  completeSubmission,
  ensureBrand,
  fetchDraftSubmission,
  saveDraftSubmission,
  submitCompletedToN8n,
} from "../lib/api/submitSurvey";
import { useAuthStore } from "../lib/authStore";

function getCheckboxSelectionsForStep(
  step: SurveyStep,
  value: string | string[] | undefined,
): string[] {
  if (stepHasCheckboxSubOptions(step)) {
    return getCheckboxSelectionsFromValue(step, value);
  }
  return getCheckboxSelections(step, value);
}

type FormValues = Record<string, string | string[]>;

function fieldName(stepId: number) {
  return `step_${stepId}`;
}

function getParentValue(
  condition: ShowIfCondition,
  steps: SurveyStep[],
  values: FormValues,
): string | string[] {
  const parent = steps.find((step) => step.question === condition.parentQuestion);
  if (!parent) return "";
  return values[fieldName(parent.id)] ?? "";
}

function isStepVisible(
  step: SurveyStep,
  steps: SurveyStep[],
  values: FormValues,
): boolean {
  if (!step.showIf) return true;
  const parentValue = getParentValue(step.showIf, steps, values);
  if (step.showIf.whenParentAnswered) {
    if (typeof parentValue === "string") return parentValue.trim().length > 0;
    if (Array.isArray(parentValue)) return parentValue.length > 0;
    return false;
  }
  if (step.showIf.equals !== undefined) {
    return parentValue === step.showIf.equals;
  }
  if (step.showIf.includes !== undefined) {
    const parent = steps.find((item) => item.question === step.showIf!.parentQuestion);
    if (!parent) return false;
    return getCheckboxSelectionsForStep(parent, parentValue).includes(step.showIf.includes);
  }
  return true;
}

function getDirectChildSteps(
  parent: SurveyStep,
  steps: SurveyStep[],
  values: FormValues,
): SurveyStep[] {
  return steps.filter(
    (step) =>
      step.showIf?.parentQuestion === parent.question &&
      isStepVisible(step, steps, values),
  );
}

function isInlineChildStep(
  step: SurveyStep,
  steps: SurveyStep[],
  values: FormValues,
): boolean {
  if (!step.showIf?.parentQuestion) return false;
  const parent = steps.find((item) => item.question === step.showIf!.parentQuestion);
  if (!parent || !isStepVisible(parent, steps, values)) return false;
  return isStepVisible(step, steps, values);
}

function getParentStepForInlineChild(
  step: SurveyStep,
  steps: SurveyStep[],
): SurveyStep | undefined {
  if (!step.showIf?.parentQuestion) return undefined;
  return steps.find((item) => item.question === step.showIf!.parentQuestion);
}

function getNavigableSteps(steps: SurveyStep[], values: FormValues): SurveyStep[] {
  return steps.filter(
    (step) => isStepVisible(step, steps, values) && !isInlineChildStep(step, steps, values),
  );
}

function getAllVisibleSteps(steps: SurveyStep[], values: FormValues): SurveyStep[] {
  return steps.filter((step) => isStepVisible(step, steps, values));
}

function mergeDraftAnswers(
  defaults: FormValues,
  answers: Record<string, string>,
  steps: SurveyStep[],
): FormValues {
  const merged = { ...defaults };
  for (const [key, value] of Object.entries(answers)) {
    if (key.startsWith("step_") || key in merged) {
      merged[key] = value;
      continue;
    }
    const step = steps.find((item) => item.backendKey === key);
    if (step) {
      merged[fieldName(step.id)] = value;
    }
  }
  return merged;
}

function buildDefaultValues(steps: SurveyStep[]): FormValues {
  const values: FormValues = {};
  for (const step of steps) {
    if (step.type === "checkbox") {
      if (stepHasOtherOption(step)) {
        values[fieldName(step.id)] = serializeCheckboxStepValue(step, EMPTY_CHECKBOX_WITH_OTHER);
      } else if (stepHasCheckboxSubOptions(step)) {
        values[fieldName(step.id)] = serializeCheckboxStepValueWithSubs(
          step,
          EMPTY_CHECKBOX_WITH_SUB_OPTIONS,
        );
      } else {
        values[fieldName(step.id)] = [];
      }
    } else if (step.type === "namedShamsiDates") {
      values[fieldName(step.id)] = serializeNamedShamsiDatesValue(EMPTY_NAMED_SHAMSI_DATES);
    } else if (step.type === "brandVisualIdentity") {
      values[fieldName(step.id)] = serializeBrandVisualIdentityValue({
        logo: null,
        colors: [],
        font: null,
      });
    } else if (step.type === "personaFields") {
      values[fieldName(step.id)] = serializePersonaFieldsValue(EMPTY_PERSONA_FIELDS);
    } else if (step.type === "geoLocation") {
      values[fieldName(step.id)] = serializeGeoLocationValue(EMPTY_GEO_LOCATION);
    } else if (step.type === "percentageAllocation") {
      values[fieldName(step.id)] = serializePercentageAllocationValue(
        createEmptyPercentageAllocation(step.options ?? []),
      );
    } else if (step.type === "fileUpload") {
      values[fieldName(step.id)] = serializeFileUploadValue(EMPTY_FILE_UPLOAD);
    } else if (step.type === "repeater") {
      values[fieldName(step.id)] = serializeRepeaterValue(
        createEmptyRepeaterValue(
          getRepeaterFields(step),
          Math.max(step.repeaterMinRows ?? 1, 1),
        ),
      );
    } else if (step.type === "nestedRepeater") {
      const config = getNestedRepeaterConfig(step);
      values[fieldName(step.id)] = config
        ? serializeNestedRepeaterValue(createEmptyNestedRepeaterValue(config))
        : "";
    } else {
      values[fieldName(step.id)] = "";
    }
  }
  return values;
}

function getAnswerByQuestion(
  steps: SurveyStep[],
  values: FormValues,
  question: string,
): string {
  const parent = steps.find((item) => item.question === question);
  if (!parent) return "";
  const value = values[fieldName(parent.id)];
  return typeof value === "string" ? value : "";
}

function getOptionsFromParentForStep(
  step: SurveyStep,
  steps: SurveyStep[],
  values: FormValues,
): string[] {
  if (step.optionsFromParent) {
    const parentAnswer = getAnswerByQuestion(
      steps,
      values,
      step.optionsFromParent.parentQuestion,
    );
    return step.optionsFromParent.optionMap[parentAnswer] ?? [];
  }
  return step.options ?? [];
}

function getCheckboxOptionsForStep(
  step: SurveyStep,
  steps: SurveyStep[],
  values: FormValues,
): string[] {
  return getOptionsFromParentForStep(step, steps, values);
}

function getPercentageAllocationOptionsForStep(
  step: SurveyStep,
  steps: SurveyStep[],
  values: FormValues,
): string[] {
  if (step.percentageAllocationSyncFromParent) {
    const parent = steps.find(
      (item) => item.question === step.percentageAllocationSyncFromParent!.parentQuestion,
    );
    const parentSelections = parent
      ? getPlainCheckboxSelections(values[fieldName(parent.id)])
      : [];
    return parentSelections.flatMap((item) => [item, ""]);
  }
  return step.options ?? [];
}

function isStepEmpty(
  step: SurveyStep,
  value: string | string[] | undefined,
  steps: SurveyStep[] = [],
  values: FormValues = {},
): boolean {
  if (step.type === "checkbox") {
    if (step.optionsFromParent) {
      const options = getCheckboxOptionsForStep(step, steps, values);
      if (!getAnswerByQuestion(steps, values, step.optionsFromParent.parentQuestion)) {
        return true;
      }
      if (options.length === 0) return false;
      const selected = getCheckboxSelectionsForStep(step, value);
      return selected.length === 0;
    }
    if (stepHasCheckboxSubOptions(step)) {
      const parsed = parseCheckboxStepValueWithSubs(step, value);
      if (Array.isArray(parsed)) return true;
      if (parsed.selected.length === 0) return true;
      if (hasInvalidCheckboxSubSelections(step, parsed)) return true;
      return false;
    }
    return isCheckboxStepEmpty(step, value);
  }
  if (step.type === "brandVisualIdentity") {
    return isBrandVisualIdentityEmpty(parseBrandVisualIdentityValue(value));
  }
  if (step.type === "personaFields") {
    return isPersonaFieldsEmpty(parsePersonaFieldsValue(value));
  }
  if (step.type === "geoLocation") {
    const parsed = parseGeoLocationValue(value);
    if (hasIncompleteGeoLocationEntries(parsed)) return true;
    return isGeoLocationEmpty(parsed);
  }
  if (step.type === "percentageAllocation") {
    const options = getPercentageAllocationOptionsForStep(step, steps, values);
    return isPercentageAllocationEmpty(
      parsePercentageAllocationValue(value, options),
      options,
    );
  }
  if (step.type === "fileUpload") {
    return isFileUploadEmpty(parseFileUploadValue(value));
  }
  if (step.type === "repeater") {
    const fields = getRepeaterFields(step);
    const parsed = parseRepeaterValue(value, fields);
    if (step.repeaterSyncFromParent && steps.length && values) {
      const parent = steps.find(
        (item) => item.question === step.repeaterSyncFromParent!.parentQuestion,
      );
      const parentPlatforms = parent
        ? getPlainCheckboxSelections(values[fieldName(parent.id)])
        : [];
      return isSyncedRepeaterEmpty(parsed, fields, parentPlatforms, step.repeaterSyncFromParent!, {
        allowEmpty: step.isAllowedEmpty,
      });
    }
    if (hasIncompleteRepeaterRows(parsed, fields)) return true;
    if (isRepeaterEmpty(parsed, fields)) return true;
    const completeRows = parsed.rows.filter((row) => isRepeaterRowComplete(row, fields));
    const minRows = Math.max(step.repeaterMinRows ?? 1, 1);
    if (completeRows.length < minRows) return true;
    return completeRows.some((row) =>
      fields.some((field) => !isRepeaterCellValid(field, row[field.key] ?? "", row)),
    );
  }
  if (step.type === "nestedRepeater") {
    const config = getNestedRepeaterConfig(step);
    if (!config) return true;
    const parsed = parseNestedRepeaterValue(value, config);
    if (hasIncompleteNestedRepeaterRows(parsed, config)) return true;
    if (isNestedRepeaterEmpty(parsed, config)) return true;
    if (hasInvalidNestedRepeaterCells(parsed, config)) return true;
    const completeCount = countCompleteNestedRows(parsed, config);
    if (config.minRows !== undefined && completeCount < config.minRows) return true;
    return false;
  }
  if (step.type === "namedShamsiDates") {
    const parsed = parseNamedShamsiDatesValue(value);
    if (hasIncompleteNamedShamsiDates(parsed)) return true;
    return isNamedShamsiDatesEmpty(parsed);
  }
  if (step.type === "number") {
    return !isNumericStepValueValid(
      value,
      step.numberMin,
      step.numberMax,
      step.numberFormat ?? "default",
    );
  }
  if (step.type === "radio" || step.type === "select") {
    if (step.optionsFromParent) {
      const parentAnswer = getAnswerByQuestion(
        steps,
        values,
        step.optionsFromParent.parentQuestion,
      );
      if (!parentAnswer) return true;
      const options = step.optionsFromParent.optionMap[parentAnswer] ?? [];
      if (!options.length) return false;
      return (
        !value ||
        typeof value !== "string" ||
        !value.trim() ||
        !options.includes(value)
      );
    }
  }
  return !value || (typeof value === "string" && !value.trim());
}

function StepField({
  step,
  steps,
  control,
  validationErrors,
  onRadioValueChange,
}: {
  step: SurveyStep;
  steps: SurveyStep[];
  control: ReturnType<typeof useForm<FormValues>>["control"];
  validationErrors?: StepValidationErrors;
  onRadioValueChange?: (step: SurveyStep, value: string) => void;
}) {
  const watchedValues = useWatch({ control }) as FormValues;
  const name = fieldName(step.id);
  const fieldErrors = validationErrors?.fields ?? {};
  const rootError = fieldErrors[ROOT_FIELD_KEY];
  const hasFieldError = (key: string) => Boolean(fieldErrors[key]);
  const errorClass = rootError
    ? "border-destructive ring-destructive/20 aria-invalid:border-destructive"
    : "";

  if (step.type === "text") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Input
              {...field}
              value={typeof field.value === "string" ? field.value : ""}
              placeholder={step.placeholder || ""}
              aria-invalid={Boolean(rootError)}
              className={cn("h-11 text-base text-foreground bg-white", errorClass)}
            />
            <FieldErrorMessage message={rootError} />
          </>
        )}
      />
    );
  }

  if (step.type === "url") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Input
              {...field}
              type="url"
              inputMode="url"
              value={typeof field.value === "string" ? field.value : ""}
              placeholder={step.placeholder || "https://example.com"}
              aria-invalid={Boolean(rootError)}
              dir="ltr"
              className={cn("h-11 bg-white text-base text-foreground text-left", errorClass)}
            />
            <FieldErrorMessage message={rootError} />
          </>
        )}
      />
    );
  }

  if (step.type === "number") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <NumericInput
              value={typeof field.value === "string" ? field.value : ""}
              onChange={field.onChange}
              suffix={step.numberSuffix}
              placeholder={step.placeholder}
              min={step.numberMin}
              max={step.numberMax}
              allowDecimal={step.numberAllowDecimal}
              format={step.numberFormat ?? "default"}
              hasError={Boolean(rootError)}
            />
            <FieldErrorMessage message={rootError} />
          </>
        )}
      />
    );
  }

  if (step.type === "textarea") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Textarea
              {...field}
              value={typeof field.value === "string" ? field.value : ""}
              placeholder={step.placeholder || ""}
              rows={5}
              aria-invalid={Boolean(rootError)}
              className={cn("min-h-[120px] text-base text-foreground bg-white", errorClass)}
            />
            <FieldErrorMessage message={rootError} />
          </>
        )}
      />
    );
  }

  if (step.type === "shamsiDate") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <ShamsiDateInput
              value={typeof field.value === "string" ? field.value : ""}
              onChange={field.onChange}
              mode={step.shamsiPickerMode ?? "date"}
              placeholder={step.placeholder}
              hasError={Boolean(rootError)}
              
            />
            <FieldErrorMessage message={rootError} />
          </>
        )}
      />
    );
  }

  if (step.type === "namedShamsiDates") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <NamedShamsiDatesInput
            value={parseNamedShamsiDatesValue(field.value)}
            onChange={(next) => field.onChange(serializeNamedShamsiDatesValue(next))}
            hasError={Boolean(validationErrors && hasStepValidationErrors(validationErrors))}
            fieldErrors={fieldErrors}
            namePlaceholder={step.placeholder}
          />
        )}
      />
    );
  }

  if (step.type === "select") {
    const selectOptions = getOptionsFromParentForStep(step, steps, watchedValues ?? {});
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <select
              {...field}
              value={
                typeof field.value === "string" && selectOptions.includes(field.value)
                  ? field.value
                  : ""
              }
              onChange={(event) => field.onChange(event.target.value)}
              aria-invalid={Boolean(rootError)}
              className={cn(
                "h-11 w-full rounded-lg border border-input bg-transparent px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                errorClass,
              )}
            >
              <option value="">انتخاب کنید</option>
              {selectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <FieldErrorMessage message={rootError} />
          </>
        )}
      />
    );
  }

  if (step.type === "radio") {
    const radioOptions = getOptionsFromParentForStep(step, steps, watchedValues ?? {});
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const currentValue = typeof field.value === "string" ? field.value : "";
          const selectedValue = radioOptions.includes(currentValue) ? currentValue : "";
          return (
            <>
              <RadioGroup
                value={selectedValue}
                onValueChange={(value) => {
                  field.onChange(value);
                  onRadioValueChange?.(step, value);
                }}
                className={cn("gap-3", rootError && "rounded-lg border border-destructive p-2")}
              >
                {radioOptions.map((option) => (
                  <Label
                    key={option}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent p-2 hover:bg-muted/50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5"
                  >
                    <RadioGroupItem value={option} className="mt-0.5" />
                    <span className="radio-label text-sm leading-6 text-foreground">{option}</span>
                  </Label>
                ))}
              </RadioGroup>
              <FieldErrorMessage message={rootError} />
            </>
          );
        }}
      />
    );
  }

  if (step.type === "brandVisualIdentity") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <BrandVisualIdentityInput
            value={parseBrandVisualIdentityValue(field.value)}
            onChange={(next) => field.onChange(serializeBrandVisualIdentityValue(next))}
            hasError={Boolean(validationErrors && hasStepValidationErrors(validationErrors))}
            fieldErrors={fieldErrors}
          />
        )}
      />
    );
  }

  if (step.type === "personaFields") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <PersonaFieldsInput
            value={parsePersonaFieldsValue(field.value)}
            onChange={(next) => field.onChange(serializePersonaFieldsValue(next))}
            fieldErrors={fieldErrors}
          />
        )}
      />
    );
  }

  if (step.type === "geoLocation") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <GeoLocationInput
            value={parseGeoLocationValue(field.value)}
            onChange={(next) => field.onChange(serializeGeoLocationValue(next))}
            hasError={Boolean(validationErrors && hasStepValidationErrors(validationErrors))}
            fieldErrors={fieldErrors}
            single={step.geoLocationSingle}
          />
        )}
      />
    );
  }

  if (step.type === "percentageAllocation") {
    const allocationOptions = getPercentageAllocationOptionsForStep(
      step,
      steps,
      watchedValues ?? {},
    );
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <PercentageAllocationInput
            options={allocationOptions}
            value={parsePercentageAllocationValue(field.value, allocationOptions)}
            onChange={(next) =>
              field.onChange(serializePercentageAllocationValue(next))
            }
            hasError={Boolean(validationErrors && hasStepValidationErrors(validationErrors))}
          />
        )}
      />
    );
  }

  if (step.type === "fileUpload") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <FileUploadInput
              value={parseFileUploadValue(field.value)}
              onChange={(next) => field.onChange(serializeFileUploadValue(next))}
              hasError={hasFieldError("description") || hasFieldError("files")}
              descriptionError={fieldErrors.description}
              filesError={fieldErrors.files}
              accept={step.fileAccept}
              uploadHint={step.uploadHint}
              descriptionPlaceholder={step.placeholder}
              maxFiles={step.maxFiles}
            />
          </>
        )}
      />
    );
  }

  if (step.type === "repeater") {
    const fields = getRepeaterFields(step);
    const repeaterHasError = Boolean(validationErrors && hasStepValidationErrors(validationErrors));
    if (step.repeaterVariant === "journeyFunnel") {
      return (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <JourneyFunnelInput
              value={parseRepeaterValue(field.value, fields)}
              onChange={(next) => field.onChange(serializeRepeaterValue(next))}
              fields={fields}
              minRows={Math.max(step.repeaterMinRows ?? 3, 1)}
              hasError={repeaterHasError}
              fieldErrors={fieldErrors}
            />
          )}
        />
      );
    }
    const syncConfig = step.repeaterSyncFromParent;
    if (syncConfig) {
      const parent = steps.find((item) => item.question === syncConfig.parentQuestion);
      const parentPlatforms = parent
        ? getPlainCheckboxSelections(watchedValues?.[fieldName(parent.id)])
        : [];
      return (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <ParentSyncedRepeaterInput
              value={parseRepeaterValue(field.value, fields)}
              onChange={(next) => field.onChange(serializeRepeaterValue(next))}
              fields={fields}
              syncConfig={syncConfig}
              parentPlatforms={parentPlatforms}
              hasError={repeaterHasError}
              fieldErrors={fieldErrors}
            />
          )}
        />
      );
    }
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RepeaterInput
            value={parseRepeaterValue(field.value, fields)}
            onChange={(next) => field.onChange(serializeRepeaterValue(next))}
            fields={fields}
            hasError={repeaterHasError}
            fieldErrors={fieldErrors}
          />
        )}
      />
    );
  }

  if (step.type === "nestedRepeater") {
    const config = getNestedRepeaterConfig(step);
    if (!config) return null;
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <NestedRepeaterInput
            value={parseNestedRepeaterValue(field.value, config)}
            onChange={(next) => field.onChange(serializeNestedRepeaterValue(next))}
            config={config}
            hasError={Boolean(validationErrors && hasStepValidationErrors(validationErrors))}
            fieldErrors={fieldErrors}
          />
        )}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        if (stepHasCheckboxSubOptions(step)) {
          const parsed = parseCheckboxStepValueWithSubs(step, field.value);
          const value =
            Array.isArray(parsed) ? EMPTY_CHECKBOX_WITH_SUB_OPTIONS : parsed;
          const selected = value.selected;
          const subConfigs = getCheckboxSubOptionConfigs(step);
          const subConfigByParent = Object.fromEntries(
            subConfigs.map((config) => [config.parentOption, config]),
          );

          function updateValue(next: CheckboxWithSubOptionsValue) {
            field.onChange(serializeCheckboxStepValueWithSubs(step, next));
          }

          function updateSelected(nextSelected: string[]) {
            const nextSubSelections = { ...value.subSelections };
            const nextSubOther = { ...value.subOther };
            for (const config of subConfigs) {
              if (!nextSelected.includes(config.parentOption)) {
                delete nextSubSelections[config.parentOption];
                delete nextSubOther[config.parentOption];
              }
            }
            updateValue({
              selected: nextSelected,
              subSelections: nextSubSelections,
              subOther: nextSubOther,
            });
          }

          function updateSubSelected(parentOption: string, nextSubSelected: string[]) {
            const subConfig = subConfigByParent[parentOption];
            const nextSubOther = { ...value.subOther };
            if (subConfig?.otherOption && !nextSubSelected.includes(subConfig.otherOption)) {
              nextSubOther[parentOption] = "";
            }
            updateValue({
              selected,
              subSelections: {
                ...value.subSelections,
                [parentOption]: nextSubSelected,
              },
              subOther: nextSubOther,
            });
          }

          function updateSubOther(parentOption: string, text: string) {
            updateValue({
              selected,
              subSelections: value.subSelections,
              subOther: { ...value.subOther, [parentOption]: text },
            });
          }

          const checkboxListError = validationErrors?.stepMessage;
          const selectedListError = fieldErrors.selected;

          return (
            <div className="flex flex-col gap-3">
              <div
                className={cn(
                  "checkbox-list max-h-80 overflow-y-auto rounded-lg border border-input p-2",
                  (checkboxListError || selectedListError) && "border-destructive",
                )}
              >
                {step.options?.map((option) => {
                  const checked = selected.includes(option);
                  const subConfig = subConfigByParent[option];
                  const subSelected = subConfig
                    ? (value.subSelections[subConfig.parentOption] ?? [])
                    : [];
                  const showSubOptions = Boolean(subConfig && checked);
                  const subError = subConfig
                    ? fieldErrors[`sub.${subConfig.parentOption}`]
                    : undefined;
                  const subOtherError = subConfig
                    ? fieldErrors[`subOther.${subConfig.parentOption}`]
                    : undefined;

                  return (
                    <div key={option}>
                      <Label
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted/50",
                          checked && "bg-primary/10",
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(isChecked) => {
                            const next = isChecked
                              ? [...selected, option]
                              : selected.filter((item) => item !== option);
                            updateSelected(next);
                          }}
                          className="mt-0.5"
                        />
                        <span className="checkbox-label text-sm leading-6 text-foreground">
                          {option}
                        </span>
                      </Label>

                      {showSubOptions && subConfig ? (
                        <div
                          className={cn(
                            "mr-7 mt-1 mb-2 rounded-lg border border-input bg-muted/20 p-3",
                            subError && "border-destructive",
                          )}
                        >
                          <p className="mb-2 text-xs font-semibold text-foreground">
                            {subConfig.label ?? subConfig.parentOption}
                          </p>
                          <div className="flex flex-col gap-1">
                            {subConfig.options.map((subOption) => {
                              const subChecked = subSelected.includes(subOption);
                              const showSubOtherInput =
                                subConfig.otherOption &&
                                subOption === subConfig.otherOption &&
                                subChecked;
                              return (
                                <div key={subOption}>
                                  <Label
                                    className={cn(
                                      "flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted/50",
                                      subChecked && "bg-primary/10",
                                    )}
                                  >
                                    <Checkbox
                                      checked={subChecked}
                                      onCheckedChange={(isChecked) => {
                                        const next = isChecked
                                          ? [...subSelected, subOption]
                                          : subSelected.filter((item) => item !== subOption);
                                        updateSubSelected(subConfig.parentOption, next);
                                      }}
                                      className="mt-0.5"
                                    />
                                    <span className="checkbox-label text-sm leading-6 text-foreground">
                                      {subOption}
                                    </span>
                                  </Label>
                                  {showSubOtherInput ? (
                                    <>
                                      <Input
                                        value={value.subOther[subConfig.parentOption] ?? ""}
                                        onChange={(event) =>
                                          updateSubOther(subConfig.parentOption, event.target.value)
                                        }
                                        placeholder={
                                          subConfig.otherPlaceholder || "توضیح دهید"
                                        }
                                        aria-invalid={Boolean(subOtherError)}
                                        className={cn(
                                          "mr-7 mt-1 mb-2 h-11 bg-white text-base text-foreground",
                                          subOtherError && "border-destructive",
                                        )}
                                      />
                                      <FieldErrorMessage
                                        message={subOtherError}
                                        className="mr-7"
                                      />
                                    </>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                          <FieldErrorMessage message={subError} />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        const parsed = parseCheckboxStepValue(step, field.value);
        const selected = Array.isArray(parsed) ? parsed : parsed.selected;
        const otherText = Array.isArray(parsed) ? "" : parsed.other;
        const showOtherInput = stepHasOtherOption(step) && selected.includes(step.otherOption);
        const otherError = fieldErrors.other;
        const checkboxListError = validationErrors?.stepMessage;
        const parentAnswer = step.optionsFromParent
          ? getAnswerByQuestion(steps, watchedValues ?? {}, step.optionsFromParent.parentQuestion)
          : "";
        const checkboxOptions = step.optionsFromParent
          ? step.optionsFromParent.optionMap[parentAnswer] ?? []
          : step.options ?? [];
        const visibleSelected = step.optionsFromParent
          ? selected.filter((item) => checkboxOptions.includes(item))
          : selected;
        const maxSelections = step.checkboxMaxSelections;
        const exclusiveOption = step.checkboxExclusiveOption;
        const exclusiveSelected =
          Boolean(exclusiveOption) && visibleSelected.includes(exclusiveOption!);
        const nonExclusiveSelected = exclusiveOption
          ? visibleSelected.some((item) => item !== exclusiveOption)
          : false;
        const atSelectionLimit =
          maxSelections !== undefined && visibleSelected.length >= maxSelections;

        function updateCheckbox(nextSelected: string[], nextOther = otherText) {
          if (stepHasOtherOption(step)) {
            const value: CheckboxWithOtherValue = {
              selected: nextSelected,
              other: nextSelected.includes(step.otherOption) ? nextOther : "",
            };
            field.onChange(serializeCheckboxStepValue(step, value));
            return;
          }
          field.onChange(nextSelected);
        }

        if (step.optionsFromParent && !parentAnswer) {
          return (
            <p className="rounded-lg border border-dashed border-input px-3 py-4 text-sm text-muted-foreground">
              ابتدا نوع کمپین را در مرحله قبل انتخاب کنید.
            </p>
          );
        }

        if (step.optionsFromParent && checkboxOptions.length === 0) {
          return (
            <p className="rounded-lg border border-dashed border-input px-3 py-4 text-sm text-muted-foreground">
              برای این نوع کمپین هنوز KPI تعریف نشده است.
            </p>
          );
        }

        return (
          <div className="flex flex-col gap-3">
            {maxSelections !== undefined ? (
              <p className="text-xs text-muted-foreground">
                حداکثر {maxSelections} گزینه ({visibleSelected.length} / {maxSelections})
              </p>
            ) : null}
            <div
              className={cn(
                "checkbox-list max-h-80 overflow-y-auto rounded-lg border border-input p-2",
                checkboxListError && "border-destructive",
              )}
            >
              {checkboxOptions.map((option) => {
                const checked = visibleSelected.includes(option);
                const isOtherOption = stepHasOtherOption(step) && option === step.otherOption;
                const isExclusiveOption =
                  Boolean(exclusiveOption) && option === exclusiveOption;
                const disabledByExclusive =
                  Boolean(exclusiveOption) &&
                  !checked &&
                  ((isExclusiveOption && nonExclusiveSelected) ||
                    (!isExclusiveOption && exclusiveSelected));
                const isDisabled =
                  disabledByExclusive || (!checked && atSelectionLimit);

                return (
                  <div key={option}>
                    <Label
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted/50",
                        checked && "bg-primary/10",
                        isDisabled && "cursor-not-allowed opacity-50",
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={isDisabled}
                        onCheckedChange={(isChecked) => {
                          if (isChecked && (atSelectionLimit || disabledByExclusive)) return;
                          let next: string[];
                          if (isChecked) {
                            if (isExclusiveOption) {
                              next = [option];
                            } else if (exclusiveOption) {
                              next = [
                                ...visibleSelected.filter((item) => item !== exclusiveOption),
                                option,
                              ];
                            } else {
                              next = [...visibleSelected, option];
                            }
                          } else {
                            next = visibleSelected.filter((item) => item !== option);
                          }
                          updateCheckbox(next, isOtherOption && !isChecked ? "" : otherText);
                        }}
                        className="mt-0.5"
                      />
                      <span className="checkbox-label text-sm leading-6 text-foreground">{option}</span>
                    </Label>

                    {isOtherOption && showOtherInput ? (
                      <div className="mr-7 mt-1 mb-2">
                        <Input
                          value={otherText}
                          onChange={(event) => updateCheckbox(visibleSelected, event.target.value)}
                          placeholder={step.otherPlaceholder || "توضیحات خود را بنویسید"}
                          aria-invalid={Boolean(otherError)}
                          className={cn(
                            "h-11 bg-white text-base text-foreground",
                            otherError && "border-destructive",
                          )}
                          autoFocus
                        />
                        <FieldErrorMessage message={otherError} />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}

export default function SurveyStepper({
  survey,
  requireHandoffToken = false,
}: {
  survey: SurveyConfig;
  /** When true (WP-embedded form pages), require `?token=` and submit via n8n. */
  requireHandoffToken?: boolean;
}) {
  const searchParams = useSearchParams();
  const handoffToken = searchParams.get("token");
  const orderId = searchParams.get("order_id");
  const orderSku = searchParams.get("order_sku");
  const isHandoffMode = Boolean(handoffToken);

  const token = useAuthStore((state) => state.token);
  const [currentStepId, setCurrentStepId] = useState(survey.steps[0]?.id ?? 1);
  const [isFinished, setIsFinished] = useState(false);
  const [stepValidation, setStepValidation] = useState<{
    stepId: number;
    errors: StepValidationErrors;
  } | null>(null);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [draftSubmissionId, setDraftSubmissionId] = useState<string | null>(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [handoffGateError, setHandoffGateError] = useState<string | null>(null);
  const [optionDialog, setOptionDialog] = useState<{
    stepId: number;
    option: string;
    message: string;
    confirmLabel: string;
  } | null>(null);
  const acknowledgedOptionDialogRef = useRef<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: buildDefaultValues(survey.steps),
    mode: "onChange",
  });

  function optionDialogKey(stepId: number, option: string) {
    return `${stepId}:${option}`;
  }

  function handleRadioValueChange(step: SurveyStep, value: string) {
    const dialog = step.optionDialog;
    if (!dialog) return;

    if (value === dialog.option) {
      const key = optionDialogKey(step.id, dialog.option);
      if (acknowledgedOptionDialogRef.current === key) return;
      setOptionDialog({
        stepId: step.id,
        option: dialog.option,
        message: dialog.message,
        confirmLabel: dialog.confirmLabel ?? "تأیید",
      });
      return;
    }

    if (acknowledgedOptionDialogRef.current?.startsWith(`${step.id}:`)) {
      acknowledgedOptionDialogRef.current = null;
    }
  }

  function openOptionDialogIfNeeded(step: SurveyStep, values: FormValues): boolean {
    const dialog = step.optionDialog;
    if (!dialog) return false;
    const value = values[fieldName(step.id)];
    if (value !== dialog.option) return false;
    const key = optionDialogKey(step.id, dialog.option);
    if (acknowledgedOptionDialogRef.current === key) return false;
    setOptionDialog({
      stepId: step.id,
      option: dialog.option,
      message: dialog.message,
      confirmLabel: dialog.confirmLabel ?? "تأیید",
    });
    return true;
  }

  async function confirmOptionDialog() {
    if (!optionDialog || !currentStep) {
      setOptionDialog(null);
      return;
    }

    acknowledgedOptionDialogRef.current = optionDialogKey(
      optionDialog.stepId,
      optionDialog.option,
    );
    setOptionDialog(null);

    const values = form.getValues();
    if (!validateCurrentStep(values)) return;

    const navigable = getNavigableSteps(survey.steps, values);
    const index = navigable.findIndex((step) => step.id === currentStep.id);
    if (index < 0 || index >= navigable.length - 1) return;

    const saved = await persistDraft(values);
    if (!saved) return;
    setCurrentStepId(navigable[index + 1].id);
    setStepValidation(null);
  }

  const watchedValues = useWatch({ control: form.control }) as FormValues;

  const visibleSteps = useMemo(
    () => getNavigableSteps(survey.steps, watchedValues ?? {}),
    [survey.steps, watchedValues],
  );

  const currentIndex = visibleSteps.findIndex((step) => step.id === currentStepId);
  const currentStep = visibleSteps[currentIndex >= 0 ? currentIndex : 0];

  const inlineChildSteps = useMemo(() => {
    if (!currentStep) return [];
    return getDirectChildSteps(currentStep, survey.steps, watchedValues ?? {});
  }, [currentStep, survey.steps, watchedValues]);

  const lastStepId = survey.steps[survey.steps.length - 1]?.id ?? 1;
  const progressValue = isFinished
    ? 100
    : Math.min(100, Math.round((currentStep.id / lastStepId) * 100));

  const activeStepValidation = useMemo(() => {
    if (!stepValidation) return null;
    const errorStep = survey.steps.find((step) => step.id === stepValidation.stepId);
    if (!errorStep) return null;
    if (isStepAnswerValid(errorStep, watchedValues ?? {}, survey.steps)) {
      return null;
    }
    return stepValidation;
  }, [stepValidation, watchedValues, survey.steps]);

  function getValidationErrorsForStep(stepId: number): StepValidationErrors | undefined {
    if (activeStepValidation?.stepId !== stepId) return undefined;
    return activeStepValidation.errors;
  }

  useEffect(() => {
    form.reset(buildDefaultValues(survey.steps));
    setCurrentStepId(survey.steps[0]?.id ?? 1);
    setIsFinished(false);
    setStepValidation(null);
    setBrandId(null);
    setDraftSubmissionId(null);
    setSaveError(null);
    setHandoffGateError(null);
    setOptionDialog(null);
    acknowledgedOptionDialogRef.current = null;
  }, [survey.id, survey.steps, form]);

  useEffect(() => {
    if (requireHandoffToken && !handoffToken) {
      setHandoffGateError(
        "لطفاً به صفحه‌ی سفارش‌ها برگردید و دوباره روی دکمه کلیک کنید",
      );
      setIsLoadingDraft(false);
      return;
    }
    setHandoffGateError(null);
  }, [requireHandoffToken, handoffToken]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapDraft() {
      if (requireHandoffToken && !handoffToken) {
        setIsLoadingDraft(false);
        return;
      }

      // WP handoff: drafts stay in localStorage only (no brand submissions API).
      if (isHandoffMode) {
        setIsLoadingDraft(true);
        try {
          const raw = localStorage.getItem(`survey-${survey.id}-answers`);
          if (raw) {
            const parsed = JSON.parse(raw) as { answers?: Record<string, string> };
            if (parsed.answers) {
              form.reset(
                mergeDraftAnswers(
                  buildDefaultValues(survey.steps),
                  parsed.answers,
                  survey.steps,
                ),
              );
            }
          }
        } catch {
          // ignore corrupt local drafts
        } finally {
          if (!cancelled) setIsLoadingDraft(false);
        }
        return;
      }

      if (!token) {
        setIsLoadingDraft(false);
        return;
      }

      setIsLoadingDraft(true);
      setSaveError(null);

      try {
        const brand = await ensureBrand(token);
        if (cancelled) return;
        setBrandId(brand.id);

        const draft = await fetchDraftSubmission(token, brand.id, survey.id);
        if (cancelled) return;

        if (draft) {
          setDraftSubmissionId(draft.id);
          const merged = mergeDraftAnswers(
            buildDefaultValues(survey.steps),
            draft.answers,
            survey.steps,
          );
          form.reset(merged);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "بارگذاری پاسخ‌ها ناموفق بود.";
          setSaveError(message);
        }
      } finally {
        if (!cancelled) setIsLoadingDraft(false);
      }
    }

    void bootstrapDraft();
    return () => {
      cancelled = true;
    };
  }, [survey.id, survey.steps, token, form, isHandoffMode, requireHandoffToken, handoffToken]);

  useEffect(() => {
    if (!visibleSteps.length) return;
    if (!visibleSteps.some((step) => step.id === currentStepId)) {
      setCurrentStepId(visibleSteps[0].id);
    }
  }, [visibleSteps, currentStepId]);

  function validateCurrentStep(values: FormValues): boolean {
    if (!currentStep) return false;
    const stepsToValidate = [currentStep, ...inlineChildSteps];
    for (const step of stepsToValidate) {
      const errors = getStepValidationErrors(
        step,
        values[fieldName(step.id)],
        values,
        survey.steps,
      );
      if (hasStepValidationErrors(errors)) {
        setStepValidation({ stepId: step.id, errors });
        return false;
      }
    }
    setStepValidation(null);
    return true;
  }

  function validateAllVisibleSteps(values: FormValues): boolean {
    const allVisibleSteps = getAllVisibleSteps(survey.steps, values);
    const invalidStep = allVisibleSteps.find(
      (step) =>
        hasStepValidationErrors(
          getStepValidationErrors(step, values[fieldName(step.id)], values, survey.steps),
        ),
    );
    if (!invalidStep) {
      setStepValidation(null);
      return true;
    }
    setCurrentStepId(
      getNavigableSteps(survey.steps, values).find((step) => step.id === invalidStep.id)?.id ??
        getParentStepForInlineChild(invalidStep, survey.steps)?.id ??
        invalidStep.id,
    );
    setStepValidation({
      stepId: invalidStep.id,
      errors: getStepValidationErrors(
        invalidStep,
        values[fieldName(invalidStep.id)],
        values,
        survey.steps,
      ),
    });
    return false;
  }

  function backupToLocalStorage(values: FormValues, status: "draft" | "completed") {
    const payload = buildSubmissionPayload(survey, values, status);
    localStorage.setItem(`survey-${survey.id}-answers`, JSON.stringify(payload, null, 2));
  }

  async function persistDraft(values: FormValues): Promise<boolean> {
    backupToLocalStorage(values, "draft");

    // Handoff/WP mode: only localStorage between steps; n8n gets the full
    // payload once on survey completion (see completeSurvey).
    if (isHandoffMode) return true;

    if (!token || !brandId) return true;

    setIsSaving(true);
    setSaveError(null);
    try {
      const payload = buildSubmissionPayload(survey, values, "draft");
      const saved = await saveDraftSubmission(token, brandId, payload);
      setDraftSubmissionId(saved.id);
      return true;
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "ذخیره پیش‌نویس ناموفق بود.",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function completeSurvey(values: FormValues) {
    if (!validateAllVisibleSteps(values)) return;

    if (requireHandoffToken && !handoffToken) {
      setSaveError(
        "لطفاً به صفحه‌ی سفارش‌ها برگردید و دوباره روی دکمه کلیک کنید",
      );
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      const payload = buildSubmissionPayload(survey, values, "completed");
      backupToLocalStorage(values, "completed");

      if (isHandoffMode && handoffToken) {
        if (!payload.completedAt) {
          throw new Error("completedAt is required");
        }
        await submitCompletedToN8n({
          token: handoffToken,
          orderId,
          orderSku,
          payload: {
            surveyId: payload.surveyId,
            status: "completed",
            answers: payload.answers,
            completedAt: payload.completedAt,
            normalizedAnswers: payload.normalizedAnswers,
          },
        });
        // Full-page redirect happens inside submitCompletedToN8n on 202.
        return;
      }

      if (token && brandId) {
        const saved = await completeSubmission(
          token,
          brandId,
          draftSubmissionId,
          payload,
        );
        setDraftSubmissionId(saved.id);
      }

      console.log("Saved survey answers:", JSON.stringify(payload, null, 2));
      setIsFinished(true);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "ذخیره پاسخ‌ها ناموفق بود.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function goNext() {
    if (!currentStep) return;
    const values = form.getValues();
    if (!validateCurrentStep(values)) return;
    if (openOptionDialogIfNeeded(currentStep, values)) return;

    const index = visibleSteps.findIndex((step) => step.id === currentStep.id);

    if (index < visibleSteps.length - 1) {
      const saved = await persistDraft(values);
      if (!saved) return;
      setCurrentStepId(visibleSteps[index + 1].id);
      setStepValidation(null);
      return;
    }

    await completeSurvey(values);
  }

  function goPrev() {
    if (!currentStep) return;
    setStepValidation(null);
    const index = visibleSteps.findIndex((step) => step.id === currentStep.id);
    if (index > 0) {
      setCurrentStepId(visibleSteps[index - 1].id);
    }
  }

  function handleEnterKey(event: React.KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      const target = event.target as HTMLElement;
      if (target.tagName === "TEXTAREA") return;
      event.preventDefault();
      goNext();
    }
  }

  if (!currentStep) {
    return null;
  }

  if (handoffGateError) {
    return (
      <section className="survey-wrap">
        <h2 className="survey-section-title">{survey.label}</h2>
        <div className="survey-step-panel">
          <FieldErrorMessage message={handoffGateError} />
        </div>
      </section>
    );
  }

  return (
    <section className="survey-wrap" onKeyDown={handleEnterKey}>
      <h2 className="survey-section-title">{survey.label}</h2>

      <Progress value={progressValue} className="mb-8">
        <div className="flex w-full items-center justify-between gap-3">
          <ProgressLabel>سوال {currentStep.id}</ProgressLabel>
          <ProgressValue />
        </div>
      </Progress>

      <div className="survey-step-panel">
        {isLoadingDraft ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="size-7 animate-spin" aria-hidden="true" />
            <p className="text-sm">در حال بارگذاری پاسخ‌های ذخیره‌شده...</p>
          </div>
        ) : (
          <>
        <Label className="question mb-3 block text-base font-semibold">
          {currentStep.question}
          {!currentStep.isAllowedEmpty && (
            <span className="text-destructive"> *</span>
          )}
        </Label>
        <StepField
          step={currentStep}
          steps={survey.steps}
          control={form.control}
          validationErrors={getValidationErrorsForStep(currentStep.id)}
          onRadioValueChange={handleRadioValueChange}
        />
        {getValidationErrorsForStep(currentStep.id)?.stepMessage ? (
          <FieldErrorMessage
            message={getValidationErrorsForStep(currentStep.id)?.stepMessage}
          />
        ) : null}
        {inlineChildSteps.map((childStep) => (
          <div key={childStep.id} className="mt-6 border-t border-border pt-6">
            <Label className="question mb-3 block text-base font-semibold">
              {childStep.question}
              {!childStep.isAllowedEmpty && (
                <span className="text-destructive"> *</span>
              )}
            </Label>
            <StepField
              step={childStep}
              steps={survey.steps}
              control={form.control}
              validationErrors={getValidationErrorsForStep(childStep.id)}
              onRadioValueChange={handleRadioValueChange}
            />
            {getValidationErrorsForStep(childStep.id)?.stepMessage ? (
              <FieldErrorMessage
                message={getValidationErrorsForStep(childStep.id)?.stepMessage}
              />
            ) : null}
          </div>
        ))}
          </>
        )}
      </div>

      <AlertDialog
        open={optionDialog !== null}
        onOpenChange={(open) => {
          if (!open) return;
        }}
      >
        <AlertDialogContent
          className="max-w-[min(100%-2rem,32rem)] gap-5 p-5 sm:max-w-lg"
          dir="rtl"
        >
          <AlertDialogHeader className="place-items-stretch text-right sm:place-items-stretch sm:text-right">
            <AlertDialogTitle className="sr-only">پیام</AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line text-right text-sm leading-7 text-foreground">
              {optionDialog?.message ?? ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-start">
            <AlertDialogAction
              type="button"
              className="h-10 min-w-28 rounded-xl font-semibold"
              onClick={() => {
                void confirmOptionDialog();
              }}
            >
              {optionDialog?.confirmLabel ?? "تأیید"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {saveError ? (
        <FieldErrorMessage message={saveError} className="mt-4" />
      ) : null}

      <div className="survey-actions">
        {!isFinished && currentIndex > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={isSaving || isLoadingDraft}
            className="btn-prev h-10 min-w-28 rounded-xl font-semibold"
          >
            قبلی
          </Button>
        )}
        {!isFinished ? (
          <Button
            type="button"
            onClick={() => void goNext()}
            disabled={isSaving || isLoadingDraft}
            className="btn-next h-10 min-w-28 rounded-xl font-semibold"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                در حال ذخیره...
              </>
            ) : currentIndex === visibleSteps.length - 1 ? (
              "پایان"
            ) : (
              "بعدی"
            )}
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsFinished(false);
                setCurrentStepId(visibleSteps[0]?.id ?? 1);
              }}
              disabled={isSaving}
              className="btn-prev h-10 min-w-28 rounded-xl font-semibold"
            >
              ویرایش پاسخ‌ها
            </Button>
            <Button
              type="button"
              onClick={() => void completeSurvey(form.getValues())}
              disabled={isSaving}
              className="btn-next h-10 min-w-28 rounded-xl font-semibold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                "ذخیره تغییرات"
              )}
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
