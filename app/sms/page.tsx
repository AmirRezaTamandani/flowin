import StaticFormPage from "@/app/components/StaticFormPage";
import { smsFormSurvey } from "@/app/lib/smsForm";

export default function SmsFormPage() {
  return <StaticFormPage survey={smsFormSurvey} />;
}
