import { FaRobot, FaUsers, FaChartLine } from "react-icons/fa";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
       
        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10">
          The AI-powered platform to segment audiences, automate campaigns, and
          maximize engagement like never before.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-10 mb-12">
          <Feature
            icon={<FaRobot className="text-blue-600 w-10 h-10 mx-auto mb-3" />}
            title="AI Automation"
            description="Smart campaign automation powered by cutting-edge AI."
          />
          <Feature
            icon={<FaUsers className="text-green-600 w-10 h-10 mx-auto mb-3" />}
            title="Audience Segmentation"
            description="Precisely target your customers with dynamic segmentation."
          />
          <Feature
            icon={
              <FaChartLine className="text-purple-600 w-10 h-10 mx-auto mb-3" />
            }
            title="Insightful Analytics"
            description="Gain deep insights with real-time campaign analytics."
          />
        </div>

        <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition">
          Get Started with AI CRM
        </button>
      </section>
    </main>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="max-w-xs">
      {icon}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
