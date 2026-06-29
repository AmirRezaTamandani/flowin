"use client";
import React, { useEffect, useRef, useState } from "react";
import type { SurveyConfig } from "../lib/surveys";

export default function SurveyStepper({ survey }: { survey: SurveyConfig }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIndex(0);
    setAnswers({});
    setIsFinished(false);
  }, [survey.id]);

  function completeSurvey(finalAnswers: Record<string, string>) {
    const payload = {
      surveyId: survey.id,
      surveyLabel: survey.label,
      answers: finalAnswers,
      completedAt: new Date().toISOString(),
    };
    const json = JSON.stringify(payload, null, 2);
    localStorage.setItem(`survey-${survey.id}-answers`, json);
    console.log("Saved survey answers:", json);
    setIsFinished(true);
  }

  function next() {
    const currentStep = survey.steps[index];
    const currentStepId = String(currentStep.id);
    const currentValue =
      currentStep.type === "text"
        ? (inputRef.current?.value ?? answers[currentStepId] ?? "")
        : (answers[currentStepId] ?? "");
    const updatedAnswers = {
      ...answers,
      [currentStepId]: currentValue,
    };

    setAnswers(updatedAnswers);

    if (index < survey.steps.length - 1) {
      setIndex(index + 1);
      return;
    }

    completeSurvey(updatedAnswers);
  }

  function prev() {
    if (index > 0) setIndex(index - 1);
  }

  function onChange(value: string) {
    const currentStepId = String(survey.steps[index].id);
    setAnswers((prev) => ({ ...prev, [currentStepId]: value }));
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    if (event.key === "Enter" && event.currentTarget.value.trim()) {
      const currentStepId = String(survey.steps[index].id);
      const updatedAnswers = {
        ...answers,
        [currentStepId]: event.currentTarget.value,
      };
      setAnswers(updatedAnswers);

      if (index === survey.steps.length - 1) {
        completeSurvey(updatedAnswers);
      } else {
        setTimeout(() => setIndex(index + 1), 120);
      }
    }
  }

  function handleChoice(value: string) {
    const currentStepId = String(survey.steps[index].id);
    const updatedAnswers = {
      ...answers,
      [currentStepId]: value,
    };
    setAnswers(updatedAnswers);

    if (index === survey.steps.length - 1) {
      completeSurvey(updatedAnswers);
    } else {
      setTimeout(() => setIndex(index + 1), 120);
    }
  }

  return (
    <section className="survey-wrap">
      <div className="progress-track">
        <div className="progress-line" aria-hidden="true" />
        <div className="progress-steps">
          {survey.steps.map((step, stepIndex) => (
            <div
              key={step.id}
              className={`progress-step ${stepIndex <= index ? "active" : ""} ${stepIndex === index ? "current" : ""}`}
            >
              {step.id}
            </div>
          ))}
        </div>
      </div>

      <div
        className="survey-slider"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {survey.steps.map((step) => (
          <div key={step.id} className="survey-step">
            <label className="question">
              {step.question}
              {step.required && <span className="required-mark"> *</span>}
            </label>
            {step.type === "text" && (
              <input
                ref={step.id === survey.steps[index].id ? inputRef : undefined}
                className="input"
                placeholder={step.placeholder || ""}
                value={answers[String(step.id)] || ""}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={handleKeyDown}
              />
            )}
            {step.type === "select" && (
              <select
                className="input"
                value={answers[String(step.id)] || ""}
                onChange={(event) => {
                  onChange(event.target.value);
                  if (event.target.value) {
                    setTimeout(() => next(), 120);
                  }
                }}
              >
                <option value="">انتخاب کنید</option>
                {step.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {step.type === "radio" && (
              <div className="radio-list">
                {step.options?.map((option) => (
                  <label
                    key={option}
                    className={`radio-item ${answers[String(step.id)] === option ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`step-${step.id}`}
                      value={option}
                      checked={answers[String(step.id)] === option}
                      onChange={() => handleChoice(option)}
                    />
                    <span className="radio-label">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="survey-actions">
        {!isFinished && index > 0 && (
          <button type="button" onClick={prev} className="btn btn-prev">
            قبلی
          </button>
        )}
        {!isFinished ? (
          <button type="button" onClick={next} className="btn btn-next">
            {index === survey.steps.length - 1 ? "پایان" : "بعدی"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setIsFinished(false);
                setIndex(0);
              }}
              className="btn btn-prev"
            >
              ویرایش پاسخ‌ها
            </button>
            <button
              type="button"
              onClick={() => {
                const currentStepId = String(survey.steps[index].id);
                completeSurvey({
                  ...answers,
                  [currentStepId]: answers[currentStepId] || "",
                });
              }}
              className="btn btn-next"
            >
              ذخیره تغییرات
            </button>
          </>
        )}
      </div>
    </section>
  );
}
