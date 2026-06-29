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
import type { ShowIfCondition, SurveyConfig, SurveyStep } from "../lib/surveys";

type FormValues = Record<string, string | string[]>;

function fieldName(stepId: number) {
  return `step_${stepId}`;
}

function parseCheckboxValue(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value ? [value] : [];
  }
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
    return parseCheckboxValue(parentValue).includes(step.showIf.includes);
  }
  return true;
}

function buildDefaultValues(steps: SurveyStep[]): FormValues {
  const values: FormValues = {};
  for (const step of steps) {
    values[fieldName(step.id)] = step.type === "checkbox" ? [] : "";
  }
  return values;
}

function isStepEmpty(step: SurveyStep, value: string | string[] | undefined): boolean {
  if (step.type === "checkbox") {
    return parseCheckboxValue(value).length === 0;
  }
  return !value || (typeof value === "string" && !value.trim());
}

function isStepAnswerValid(step: SurveyStep, values: FormValues): boolean {
  if (step.isAllowedEmpty) return true;
  return !isStepEmpty(step, values[fieldName(step.id)]);
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
            className={cn("h-11 text-base", errorClass)}
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
            className={cn("min-h-[120px] text-base", errorClass)}
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
                <span className="text-sm leading-6">{option}</span>
              </Label>
            ))}
          </RadioGroup>
        )}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selected = parseCheckboxValue(field.value);
        return (
          <div
            className={cn(
              "checkbox-list max-h-80 overflow-y-auto rounded-lg border border-input p-2",
              hasError && "border-destructive",
            )}
          >
            {step.options?.map((option) => {
              const checked = selected.includes(option);
              return (
                <Label
                  key={option}
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
                      field.onChange(next);
                    }}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-6">{option}</span>
                </Label>
              );
            })}
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
    if (isStepAnswerValid(currentStep, values)) {
      setFieldError(null);
      return true;
    }
    setFieldError(EMPTY_ANSWER_MESSAGE);
    return false;
  }

  function validateAllVisibleSteps(values: FormValues): boolean {
    const invalidStep = visibleSteps.find((step) => !isStepAnswerValid(step, values));
    if (!invalidStep) {
      setFieldError(null);
      return true;
    }
    setCurrentStepId(invalidStep.id);
    setFieldError(EMPTY_ANSWER_MESSAGE);
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
            variant="secondary"
            onClick={goPrev}
            className="btn-prev h-10 min-w-28 rounded-xl"
          >
            قبلی
          </Button>
        )}
        {!isFinished ? (
          <Button
            type="button"
            onClick={goNext}
            className="btn-next h-10 min-w-28 rounded-xl bg-[var(--btn-dark)] text-white hover:bg-[var(--btn-dark)]/90"
          >
            {currentIndex === visibleSteps.length - 1 ? "پایان" : "بعدی"}
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsFinished(false);
                setCurrentStepId(visibleSteps[0]?.id ?? 1);
              }}
              className="btn-prev h-10 min-w-28 rounded-xl"
            >
              ویرایش پاسخ‌ها
            </Button>
            <Button
              type="button"
              onClick={() => completeSurvey(form.getValues())}
              className="btn-next h-10 min-w-28 rounded-xl bg-[var(--btn-dark)] text-white hover:bg-[var(--btn-dark)]/90"
            >
              ذخیره تغییرات
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
