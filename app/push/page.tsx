import StaticFormPage from "@/app/components/StaticFormPage";
import { pushFormSurvey } from "@/app/lib/pushForm";

export default function PushFormPage() {
  return <StaticFormPage survey={pushFormSurvey} />;
}
