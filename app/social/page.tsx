import StaticFormPage from "@/app/components/StaticFormPage";
import { socialStrategyFormSurvey } from "@/app/lib/socialStrategyForm";

export default function SocialFormPage() {
  return <StaticFormPage survey={socialStrategyFormSurvey} />;
}
