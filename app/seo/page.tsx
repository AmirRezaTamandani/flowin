import StaticFormPage from "@/app/components/StaticFormPage";
import { seoFormSurvey } from "@/app/lib/seoForm";

export default function SeoFormPage() {
  return <StaticFormPage survey={seoFormSurvey} />;
}
