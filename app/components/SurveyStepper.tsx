"use client";
import React, { useEffect, useState } from "react";

type SurveyStep = {
  id: number;
  question: string;
  type: "text" | "radio" | "select";
  placeholder?: string;
  options?: string[];
};

type SurveyConfig = {
  id: string;
  label: string;
  title: string;
  description: string;
  steps: SurveyStep[];
};

export default function SurveyStepper({ survey }: { survey: SurveyConfig }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

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
    if (index < survey.steps.length - 1) {
      setIndex(index + 1);
      return;
    }

    const currentStepId = String(survey.steps[index].id);
    completeSurvey({
      ...answers,
      [currentStepId]: answers[currentStepId] || "",
    });
  }

  function prev() {
    if (index > 0) setIndex(index - 1);
  }

  function onChange(value: string) {
    setAnswers({ ...answers, [String(survey.steps[index].id)]: value });
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
      <div className="survey-head">
        <div className="survey-title">{survey.title}</div>
        <div className="survey-description">{survey.description}</div>
      </div>

      <div className="progress">
        {survey.steps.map((step, stepIndex) => (
          <div
            key={step.id}
            className={`dot ${stepIndex <= index ? "active" : ""}`}
          >
            {step.id}
          </div>
        ))}
      </div>

      <div
        className="survey-slider"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {survey.steps.map((step) => (
          <div key={step.id} className="survey-step">
            <label className="question">{step.question}</label>
            {step.type === "text" && (
              <input
                className="input"
                placeholder={step.placeholder || "پاسخ شما"}
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
              <div className="options">
                {step.options?.map((option) => (
                  <button
                    key={option}
                    className={`opt ${answers[String(step.id)] === option ? "sel" : ""}`}
                    onClick={() => handleChoice(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="survey-actions">
        <button
          onClick={prev}
          disabled={index === 0 && !isFinished}
          className="btn muted"
        >
          {isFinished ? "ویرایش پاسخ‌ها" : "قبلی"}
        </button>
        {!isFinished ? (
          <button onClick={next} className="btn primary">
            {index === survey.steps.length - 1 ? "پایان" : "بعدی"}
          </button>
        ) : (
          <button
            onClick={() => {
              const currentStepId = String(survey.steps[index].id);
              completeSurvey({
                ...answers,
                [currentStepId]: answers[currentStepId] || "",
              });
            }}
            className="btn primary"
          >
            ذخیره تغییرات
          </button>
        )}
      </div>
    </section>
  );
}
