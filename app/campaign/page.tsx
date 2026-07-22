import StaticFormPage from "@/app/components/StaticFormPage";
import { campaignFormSurvey } from "@/app/lib/campaignForm";

export default function CampaignFormPage() {
  return <StaticFormPage survey={campaignFormSurvey} />;
}
