import StaticFormPage from "@/app/components/StaticFormPage";
import { brandFormSurvey } from "@/app/lib/brandForm";

export default function BrandFormPage() {
  return <StaticFormPage survey={brandFormSurvey} />;
}
