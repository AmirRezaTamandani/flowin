import StaticFormPage from "@/app/components/StaticFormPage";
import { brandFormSurvey } from "@/app/lib/brandForm";

export default function BrandingFormPage() {
  return <StaticFormPage survey={brandFormSurvey} />;
}
