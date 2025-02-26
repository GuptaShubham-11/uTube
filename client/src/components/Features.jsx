import { Video, Upload, SunMoon } from 'lucide-react';

const features = [
  {
    title: 'Seamless Video Playback',
    description: 'Watch HD videos with no lag.',
    icon: <Video size={40} className="text-gray-900 dark:text-white" />,
    gradient: 'bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800',
  },
  {
    title: 'Upload Videos',
    description: 'Easily upload your content and share.',
    icon: <Upload size={40} className="text-gray-900 dark:text-white" />,
    gradient: 'bg-gradient-to-r from-green-400 to-green-600 dark:from-green-600 dark:to-green-800',
  },
  {
    title: 'Dark & Light Mode',
    description: 'Switch themes effortlessly.',
    icon: <SunMoon size={40} className="text-gray-900 dark:text-white" />,
    gradient:
      'bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-800',
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
              aria-label={feature.title}
              className={`p-4 sm:p-6 rounded-xl shadow-lg border border-secondary-light dark:border-secondary-dark 
              ${feature.gradient} transition-transform transform hover:scale-105 hover:shadow-xl flex flex-col items-center text-center`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-800 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
