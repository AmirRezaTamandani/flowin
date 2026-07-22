import StaticFormPage from "@/app/components/StaticFormPage";
import { emailFormSurvey } from "@/app/lib/emailForm";

export default function EmailFormPage() {
  return <StaticFormPage survey={emailFormSurvey} />;
}
