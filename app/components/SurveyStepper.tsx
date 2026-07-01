"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import {
  INVALID_WEBSITE_URL_MESSAGE,
  isWebsiteUrlStepValueValid,
} from "../lib/urlValidation";
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
  hasIncompleteRepeaterRows,
  isRepeaterCellValid,
  isRepeaterEmpty,
  isRepeaterRowComplete,
  parseRepeaterValue,
  serializeRepeaterValue,
} from "../lib/repeater";
import {
  countCompleteNestedRows,
  createEmptyNestedRepeaterValue,
  getNestedRepeaterConfig,
  hasIncompleteNestedRepeaterRows,
  hasInvalidNestedRepeaterCells,
  hasInvalidNestedRepeaterUrls,
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
import type { ShowIfCondition, SurveyConfig, SurveyStep } from "../lib/surveys";

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
        createEmptyPercentageAllocation(step.options),
      );
    } else if (step.type === "fileUpload") {
      values[fieldName(step.id)] = serializeFileUploadValue(EMPTY_FILE_UPLOAD);
    } else if (step.type === "repeater") {
      values[fieldName(step.id)] = serializeRepeaterValue(
        createEmptyRepeaterValue(getRepeaterFields(step)),
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

function getCheckboxOptionsForStep(
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
    return isPercentageAllocationEmpty(
      parsePercentageAllocationValue(value, step.options),
      step.options,
    );
  }
  if (step.type === "fileUpload") {
    return isFileUploadEmpty(parseFileUploadValue(value));
  }
  if (step.type === "repeater") {
    const fields = getRepeaterFields(step);
    const parsed = parseRepeaterValue(value, fields);
    if (hasIncompleteRepeaterRows(parsed, fields)) return true;
    if (isRepeaterEmpty(parsed, fields)) return true;
    const completeRows = parsed.rows.filter((row) => isRepeaterRowComplete(row, fields));
    if (!completeRows.length) return true;
    return completeRows.some((row) =>
      fields.some((field) => !isRepeaterCellValid(field, row[field.key] ?? "")),
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
  return !value || (typeof value === "string" && !value.trim());
}

function getStepValidationError(
  step: SurveyStep,
  value: string | string[] | undefined,
  values?: FormValues,
  steps?: SurveyStep[],
): string | null {
  if (
    step.type === "checkbox" &&
    step.optionsFromParent &&
    values &&
    steps
  ) {
    const parentAnswer = getAnswerByQuestion(
      steps,
      values,
      step.optionsFromParent.parentQuestion,
    );
    const options = step.optionsFromParent.optionMap[parentAnswer] ?? [];
    if (!options.length) return null;
    if (!parentAnswer) return EMPTY_ANSWER_MESSAGE;
  }

  if (step.isAllowedEmpty && isStepEmpty(step, value, steps ?? [], values ?? {})) return null;

  if (step.type === "repeater") {
    const fields = getRepeaterFields(step);
    const parsed = parseRepeaterValue(value, fields);
    const completeRows = parsed.rows.filter((row) => isRepeaterRowComplete(row, fields));
    const hasInvalidUrl = completeRows.some((row) =>
      fields.some(
        (field) =>
          field.type === "url" &&
          Boolean(row[field.key]?.trim()) &&
          !isRepeaterCellValid(field, row[field.key]),
      ),
    );
    if (hasInvalidUrl) return INVALID_WEBSITE_URL_MESSAGE;
  }

  if (step.type === "nestedRepeater") {
    const config = getNestedRepeaterConfig(step);
    if (config) {
      const parsed = parseNestedRepeaterValue(value, config);
      if (hasInvalidNestedRepeaterUrls(parsed, config)) {
        return INVALID_WEBSITE_URL_MESSAGE;
      }
      const completeCount = countCompleteNestedRows(parsed, config);
      if (
        config.minRows !== undefined &&
        completeCount < config.minRows &&
        !hasIncompleteNestedRepeaterRows(parsed, config)
      ) {
        return NESTED_REPEATER_MIN_ROWS_MESSAGE;
      }
      if (config.maxRows !== undefined && completeCount > config.maxRows) {
        return NESTED_REPEATER_MAX_ROWS_MESSAGE;
      }
    }
  }

  if (isStepEmpty(step, value, steps ?? [], values ?? {})) return EMPTY_ANSWER_MESSAGE;
  if (step.type === "url" && !isWebsiteUrlStepValueValid(value)) {
    return INVALID_WEBSITE_URL_MESSAGE;
  }
  return null;
}

function isStepAnswerValid(
  step: SurveyStep,
  values: FormValues,
  steps: SurveyStep[],
): boolean {
  return getStepValidationError(step, values[fieldName(step.id)], values, steps) === null;
}

const EMPTY_ANSWER_MESSAGE = "لطفاً این سوال را پاسخ دهید.";
const NESTED_REPEATER_MIN_ROWS_MESSAGE = "حداقل ۲ رقیب با اطلاعات کامل وارد کنید.";
const NESTED_REPEATER_MAX_ROWS_MESSAGE = "حداکثر ۱۰ رقیب مجاز است.";

function StepField({
  step,
  steps,
  control,
  hasError,
}: {
  step: SurveyStep;
  steps: SurveyStep[];
  control: ReturnType<typeof useForm<FormValues>>["control"];
  hasError?: boolean;
}) {
  const watchedValues = useWatch({ control }) as FormValues;
  const name = fieldName(step.id);
  const errorClass = hasError
    ? "border-destructive ring-destructive/20 aria-invalid:border-destructive"
    : "";

  if (step.type === "text") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            value={typeof field.value === "string" ? field.value : ""}
            placeholder={step.placeholder || ""}
            aria-invalid={hasError}
            className={cn("h-11 text-base text-foreground bg-white", errorClass)}
          />
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
          <Input
            {...field}
            type="url"
            inputMode="url"
            value={typeof field.value === "string" ? field.value : ""}
            placeholder={step.placeholder || "https://example.com"}
            aria-invalid={hasError}
            dir="ltr"
            className={cn("h-11 bg-white text-base text-foreground text-left", errorClass)}
          />
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
          <NumericInput
            value={typeof field.value === "string" ? field.value : ""}
            onChange={field.onChange}
            suffix={step.numberSuffix}
            placeholder={step.placeholder}
            min={step.numberMin}
            max={step.numberMax}
            allowDecimal={step.numberAllowDecimal}
            format={step.numberFormat ?? "default"}
            hasError={hasError}
          />
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
          <Textarea
            {...field}
            value={typeof field.value === "string" ? field.value : ""}
            placeholder={step.placeholder || ""}
            rows={5}
            aria-invalid={hasError}
            className={cn("min-h-[120px] text-base text-foreground bg-white", errorClass)}
          />
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
          <ShamsiDateInput
            value={typeof field.value === "string" ? field.value : ""}
            onChange={field.onChange}
            mode={step.shamsiPickerMode ?? "date"}
            placeholder={step.placeholder}
            hasError={hasError}
          />
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
            hasError={hasError}
            namePlaceholder={step.placeholder}
          />
        )}
      />
    );
  }

  if (step.type === "select") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            value={typeof field.value === "string" ? field.value : ""}
            aria-invalid={hasError}
            className={cn(
              "h-11 w-full rounded-lg border border-input bg-transparent px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              errorClass,
            )}
          >
            <option value="">انتخاب کنید</option>
            {step.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      />
    );
  }

  if (step.type === "radio") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={typeof field.value === "string" ? field.value : ""}
            onValueChange={field.onChange}
            className={cn("gap-3", hasError && "rounded-lg border border-destructive p-2")}
          >
            {step.options?.map((option) => (
              <Label
                key={option}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent p-2 hover:bg-muted/50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5"
              >
                <RadioGroupItem value={option} className="mt-0.5" />
                <span className="radio-label text-sm leading-6 text-foreground">{option}</span>
              </Label>
            ))}
          </RadioGroup>
        )}
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
            hasError={hasError}
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
            hasError={hasError}
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
            hasError={hasError}
          />
        )}
      />
    );
  }

  if (step.type === "percentageAllocation") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <PercentageAllocationInput
            options={step.options}
            value={parsePercentageAllocationValue(field.value, step.options)}
            onChange={(next) =>
              field.onChange(serializePercentageAllocationValue(next))
            }
            hasError={hasError}
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
          <FileUploadInput
            value={parseFileUploadValue(field.value)}
            onChange={(next) => field.onChange(serializeFileUploadValue(next))}
            hasError={hasError}
            accept={step.fileAccept}
            uploadHint={step.uploadHint}
            descriptionPlaceholder={step.placeholder}
            maxFiles={step.maxFiles}
          />
        )}
      />
    );
  }

  if (step.type === "repeater") {
    const fields = getRepeaterFields(step);
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RepeaterInput
            value={parseRepeaterValue(field.value, fields)}
            onChange={(next) => field.onChange(serializeRepeaterValue(next))}
            fields={fields}
            hasError={hasError}
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
            hasError={hasError}
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
            for (const config of subConfigs) {
              if (!nextSelected.includes(config.parentOption)) {
                delete nextSubSelections[config.parentOption];
              }
            }
            updateValue({ selected: nextSelected, subSelections: nextSubSelections });
          }

          function updateSubSelected(parentOption: string, nextSubSelected: string[]) {
            updateValue({
              selected,
              subSelections: {
                ...value.subSelections,
                [parentOption]: nextSubSelected,
              },
            });
          }

          return (
            <div className="flex flex-col gap-3">
              <div
                className={cn(
                  "checkbox-list max-h-80 overflow-y-auto rounded-lg border border-input p-2",
                  hasError && "border-destructive",
                )}
              >
                {step.options?.map((option) => {
                  const checked = selected.includes(option);
                  const subConfig = subConfigByParent[option];
                  const subSelected = subConfig
                    ? (value.subSelections[subConfig.parentOption] ?? [])
                    : [];
                  const showSubOptions = Boolean(subConfig && checked);

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
                        <div className="mr-7 mt-1 mb-2 rounded-lg border border-input bg-muted/20 p-3">
                          <p className="mb-2 text-xs font-semibold text-foreground">
                            {subConfig.label ?? subConfig.parentOption}
                          </p>
                          <div className="flex flex-col gap-1">
                            {subConfig.options.map((subOption) => {
                              const subChecked = subSelected.includes(subOption);
                              return (
                                <Label
                                  key={subOption}
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
                              );
                            })}
                          </div>
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
        const parentAnswer = step.optionsFromParent
          ? getAnswerByQuestion(steps, watchedValues ?? {}, step.optionsFromParent.parentQuestion)
          : "";
        const checkboxOptions = step.optionsFromParent
          ? step.optionsFromParent.optionMap[parentAnswer] ?? []
          : step.options ?? [];
        const visibleSelected = step.optionsFromParent
          ? selected.filter((item) => checkboxOptions.includes(item))
          : selected;

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
            <div
              className={cn(
                "checkbox-list max-h-80 overflow-y-auto rounded-lg border border-input p-2",
                hasError && "border-destructive",
              )}
            >
              {checkboxOptions.map((option) => {
                const checked = visibleSelected.includes(option);
                const isOtherOption = stepHasOtherOption(step) && option === step.otherOption;

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
                            ? [...visibleSelected, option]
                            : visibleSelected.filter((item) => item !== option);
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
                          aria-invalid={hasError}
                          className={cn("h-11 bg-white text-base text-foreground", errorClass)}
                          autoFocus
                        />
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

export default function SurveyStepper({ survey }: { survey: SurveyConfig }) {
  const [currentStepId, setCurrentStepId] = useState(survey.steps[0]?.id ?? 1);
  const [isFinished, setIsFinished] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [fieldErrorStepId, setFieldErrorStepId] = useState<number | null>(null);

  const form = useForm<FormValues>({
    defaultValues: buildDefaultValues(survey.steps),
    mode: "onChange",
  });

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

  const activeFieldError = useMemo(() => {
    if (!fieldError || fieldErrorStepId === null) {
      return { message: null as string | null, stepId: null as number | null };
    }
    const errorStep = survey.steps.find((step) => step.id === fieldErrorStepId);
    if (!errorStep) {
      return { message: null, stepId: null };
    }
    if (isStepAnswerValid(errorStep, watchedValues ?? {}, survey.steps)) {
      return { message: null, stepId: null };
    }
    return { message: fieldError, stepId: fieldErrorStepId };
  }, [fieldError, fieldErrorStepId, watchedValues, survey.steps]);

  useEffect(() => {
    form.reset(buildDefaultValues(survey.steps));
    setCurrentStepId(survey.steps[0]?.id ?? 1);
    setIsFinished(false);
    setFieldError(null);
    setFieldErrorStepId(null);
  }, [survey.id, survey.steps, form]);

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
      const error = getStepValidationError(
        step,
        values[fieldName(step.id)],
        values,
        survey.steps,
      );
      if (error) {
        setFieldError(error);
        setFieldErrorStepId(step.id);
        return false;
      }
    }
    setFieldError(null);
    setFieldErrorStepId(null);
    return true;
  }

  function validateAllVisibleSteps(values: FormValues): boolean {
    const allVisibleSteps = getAllVisibleSteps(survey.steps, values);
    const invalidStep = allVisibleSteps.find(
      (step) =>
        getStepValidationError(step, values[fieldName(step.id)], values, survey.steps) !==
        null,
    );
    if (!invalidStep) {
      setFieldError(null);
      setFieldErrorStepId(null);
      return true;
    }
    setCurrentStepId(
      getNavigableSteps(survey.steps, values).find((step) => step.id === invalidStep.id)?.id ??
        getParentStepForInlineChild(invalidStep, survey.steps)?.id ??
        invalidStep.id,
    );
    setFieldError(
      getStepValidationError(
        invalidStep,
        values[fieldName(invalidStep.id)],
        values,
        survey.steps,
      ),
    );
    setFieldErrorStepId(invalidStep.id);
    return false;
  }

  function completeSurvey(values: FormValues) {
    if (!validateAllVisibleSteps(values)) return;
    const answers = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        Array.isArray(value) ? JSON.stringify(value) : value,
      ]),
    );

    const payload = {
      surveyId: survey.id,
      surveyLabel: survey.label,
      answers,
      completedAt: new Date().toISOString(),
    };
    const json = JSON.stringify(payload, null, 2);
    localStorage.setItem(`survey-${survey.id}-answers`, json);
    console.log("Saved survey answers:", json);
    setIsFinished(true);
  }

  function goNext() {
    if (!currentStep) return;
    const values = form.getValues();
    if (!validateCurrentStep(values)) return;

    const index = visibleSteps.findIndex((step) => step.id === currentStep.id);

    if (index < visibleSteps.length - 1) {
      setCurrentStepId(visibleSteps[index + 1].id);
      setFieldError(null);
      setFieldErrorStepId(null);
      return;
    }

    completeSurvey(values);
  }

  function goPrev() {
    if (!currentStep) return;
    setFieldError(null);
    setFieldErrorStepId(null);
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
          hasError={activeFieldError.stepId === currentStep.id}
        />
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
              hasError={activeFieldError.stepId === childStep.id}
            />
          </div>
        ))}
        {activeFieldError.message && (
          <p className="field-error" role="alert">
            {activeFieldError.message}
          </p>
        )}
      </div>

      <div className="survey-actions">
        {!isFinished && currentIndex > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            className="btn-prev h-10 min-w-28 rounded-xl font-semibold"
          >
            قبلی
          </Button>
        )}
        {!isFinished ? (
          <Button
            type="button"
            onClick={goNext}
            className="btn-next h-10 min-w-28 rounded-xl font-semibold"
          >
            {currentIndex === visibleSteps.length - 1 ? "پایان" : "بعدی"}
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
              className="btn-prev h-10 min-w-28 rounded-xl font-semibold"
            >
              ویرایش پاسخ‌ها
            </Button>
            <Button
              type="button"
              onClick={() => completeSurvey(form.getValues())}
              className="btn-next h-10 min-w-28 rounded-xl font-semibold"
            >
              ذخیره تغییرات
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
