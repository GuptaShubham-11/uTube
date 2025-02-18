const features = [
  { title: 'Seamless Video Playback', description: 'Watch HD videos with no lag.' },
  { title: 'Upload Videos', description: 'Easily upload your content and share.' },
  { title: 'Dark & Light Mode', description: 'Switch themes effortlessly.' },
];

export default function Features() {
  return (
    <section className="py-16 px-4 bg-background-light dark:bg-background-dark">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-primary-light dark:text-primary-dark mb-10">
          Key Features
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-background-light dark:bg-background-dark border border-secondary-light dark:border-secondary-dark hover:bg-accent-light dark:hover:bg-accent-dark hover:text-text-light dark:hover:text-text-dark"
            >
              <h3 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                {feature.title}
              </h3>
              <p className="text-secondary-light dark:text-secondary-dark">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
