import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import OriginSection from "@/components/OriginSection";
import SolutionSection from "@/components/SolutionSection";
import HowItWorks from "@/components/HowItWorks";
import ClinicalTrustSection from "@/components/ClinicalTrustSection";
import PatientApp from "@/components/PatientApp";
import ClinicPanel from "@/components/ClinicPanel";
import ReportsSection from "@/components/ReportsSection";
import FeedbackColors from "@/components/FeedbackColors";
import Benefits from "@/components/Benefits";
import ContrastSection from "@/components/ContrastSection";
import PilotForm from "@/components/PilotForm";
import FAQ from "@/components/FAQ";
import AndroidDownload from "@/components/AndroidDownload";
import DownloadApp from "@/components/DownloadApp";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <OriginSection />
        <SolutionSection />
        <HowItWorks />
        <ContrastSection />
        <PatientApp />
        <ClinicPanel />
        <ReportsSection />
        <FeedbackColors />
        <ClinicalTrustSection />
        <Benefits />
        <PilotForm />
        <FAQ />
      </main>
      <AndroidDownload />
      <DownloadApp />
      <Footer />
    </>
  );
}
