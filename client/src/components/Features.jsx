import { Video, Upload, SunMoon } from "lucide-react";

const features = [
  {
    title: "Seamless Video Playback",
    description: "Watch HD videos with no lag.",
    icon: <Video size={40} className="text-white" />,
    gradient: "bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800",
  },
  {
    title: "Upload Videos",
    description: "Easily upload your content and share.",
    icon: <Upload size={40} className="text-white" />,
    gradient: "bg-gradient-to-r from-green-500 to-green-700 dark:from-green-600 dark:to-green-800",
  },
  {
    title: "Dark & Light Mode",
    description: "Switch themes effortlessly.",
    icon: <SunMoon size={40} className="text-white" />,
    gradient: "bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800",
  },
];

export default function Features() {
  return (
    <section className="px-6 py-12 bg-background-light dark:bg-background-dark text-center">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-lg border border-secondary-light dark:border-secondary-dark 
              ${feature.gradient} transition-transform transform hover:scale-105 flex flex-col items-center text-center`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
