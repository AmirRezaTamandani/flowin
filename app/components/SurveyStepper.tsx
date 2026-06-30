"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import BrandVisualIdentityInput from "./BrandVisualIdentityInput";
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
    } else {
      values[fieldName(step.id)] = "";
    }
  }
  return values;
}

function isStepEmpty(step: SurveyStep, value: string | string[] | undefined): boolean {
  if (step.type === "checkbox") {
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
  if (step.type === "namedShamsiDates") {
    const parsed = parseNamedShamsiDatesValue(value);
    if (hasIncompleteNamedShamsiDates(parsed)) return true;
    return isNamedShamsiDatesEmpty(parsed);
  }
  if (step.type === "number") {
    return !isNumericStepValueValid(value, step.numberMin, step.numberMax);
  }
  return !value || (typeof value === "string" && !value.trim());
}

function getStepValidationError(
  step: SurveyStep,
  value: string | string[] | undefined,
): string | null {
  if (step.isAllowedEmpty && isStepEmpty(step, value)) return null;
  if (isStepEmpty(step, value)) return EMPTY_ANSWER_MESSAGE;
  if (step.type === "url" && !isWebsiteUrlStepValueValid(value)) {
    return INVALID_WEBSITE_URL_MESSAGE;
  }
  return null;
}

function isStepAnswerValid(step: SurveyStep, values: FormValues): boolean {
  return getStepValidationError(step, values[fieldName(step.id)]) === null;
}

const EMPTY_ANSWER_MESSAGE = "لطفاً این سوال را پاسخ دهید.";

function StepField({
  step,
  control,
  hasError,
}: {
  step: SurveyStep;
  control: ReturnType<typeof useForm<FormValues>>["control"];
  hasError?: boolean;
}) {
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
          const subConfig = step.checkboxSubOptions;
          const subSelected = value.subSelections[subConfig.parentOption] ?? [];
          const showSubOptions = selected.includes(subConfig.parentOption);

          function updateValue(next: CheckboxWithSubOptionsValue) {
            field.onChange(serializeCheckboxStepValueWithSubs(step, next));
          }

          function updateSelected(nextSelected: string[]) {
            const nextSubSelections = { ...value.subSelections };
            if (!nextSelected.includes(subConfig.parentOption)) {
              delete nextSubSelections[subConfig.parentOption];
            }
            updateValue({ selected: nextSelected, subSelections: nextSubSelections });
          }

          function updateSubSelected(nextSubSelected: string[]) {
            updateValue({
              selected,
              subSelections: {
                ...value.subSelections,
                [subConfig.parentOption]: nextSubSelected,
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
                  const isSubParent = option === subConfig.parentOption;

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

                      {isSubParent && showSubOptions ? (
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
                                      updateSubSelected(next);
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
                            ? [...selected, option]
                            : selected.filter((item) => item !== option);
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
                          onChange={(event) => updateCheckbox(selected, event.target.value)}
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

  const form = useForm<FormValues>({
    defaultValues: buildDefaultValues(survey.steps),
    mode: "onChange",
  });

  const watchedValues = useWatch({ control: form.control }) as FormValues;

  const visibleSteps = useMemo(
    () =>
      survey.steps.filter((step) =>
        isStepVisible(step, survey.steps, watchedValues ?? {}),
      ),
    [survey.steps, watchedValues],
  );

  const currentIndex = visibleSteps.findIndex((step) => step.id === currentStepId);
  const currentStep = visibleSteps[currentIndex >= 0 ? currentIndex : 0];
  const currentPage = currentStep?.page ?? 1;
  const pageCount = survey.pageCount ?? 1;
  const currentFieldName = currentStep ? fieldName(currentStep.id) : "";

  useEffect(() => {
    form.reset(buildDefaultValues(survey.steps));
    setCurrentStepId(survey.steps[0]?.id ?? 1);
    setIsFinished(false);
    setFieldError(null);
  }, [survey.id, survey.steps, form]);

  useEffect(() => {
    if (!visibleSteps.length) return;
    if (!visibleSteps.some((step) => step.id === currentStepId)) {
      setCurrentStepId(visibleSteps[0].id);
    }
  }, [visibleSteps, currentStepId]);

  useEffect(() => {
    if (!fieldError || !currentFieldName) return;
    if (isStepAnswerValid(currentStep, watchedValues ?? {})) {
      setFieldError(null);
    }
  }, [watchedValues, currentFieldName, fieldError, currentStep]);

  function validateCurrentStep(values: FormValues): boolean {
    if (!currentStep) return false;
    const error = getStepValidationError(currentStep, values[fieldName(currentStep.id)]);
    if (!error) {
      setFieldError(null);
      return true;
    }
    setFieldError(error);
    return false;
  }

  function validateAllVisibleSteps(values: FormValues): boolean {
    const invalidStep = visibleSteps.find(
      (step) => getStepValidationError(step, values[fieldName(step.id)]) !== null,
    );
    if (!invalidStep) {
      setFieldError(null);
      return true;
    }
    setCurrentStepId(invalidStep.id);
    setFieldError(getStepValidationError(invalidStep, values[fieldName(invalidStep.id)]));
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
      return;
    }

    completeSurvey(values);
  }

  function goPrev() {
    if (!currentStep) return;
    setFieldError(null);
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

      <div className="progress-track">
        <div className="progress-line" aria-hidden="true" />
        <div className="progress-steps">
          {Array.from({ length: pageCount }, (_, pageIndex) => {
            const pageNumber = pageIndex + 1;
            return (
              <div
                key={pageNumber}
                className={cn(
                  "progress-step",
                  pageNumber <= currentPage && "active",
                  pageNumber === currentPage && "current",
                )}
                title={survey.pageLabels?.[pageIndex]}
              >
                {pageNumber}
              </div>
            );
          })}
        </div>
      </div>

      <div className="survey-step-panel">
        <Label className="question mb-3 block text-base font-semibold">
          {currentStep.question}
          {!currentStep.isAllowedEmpty && (
            <span className="text-destructive"> *</span>
          )}
        </Label>
        <StepField
          step={currentStep}
          control={form.control}
          hasError={!!fieldError}
        />
        {fieldError && (
          <p className="field-error" role="alert">
            {fieldError}
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
