import StaticFormPage from "@/app/components/StaticFormPage";
import { socialCompetitorFormSurvey } from "@/app/lib/socialCompetitorForm";

export default function SocialCompetitorFormPage() {
  return <StaticFormPage survey={socialCompetitorFormSurvey} />;
}
