const features = [
  { title: 'Seamless Video Playback', description: 'Watch HD videos with no lag.' },
  { title: 'Upload Videos', description: 'Easily upload your content and share.' },
  { title: 'Dark & Light Mode', description: 'Switch themes effortlessly.' },
];

export default function Features() {
  return (
    <section className="py-10 px-4">
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-lg shadow-md bg-background-light dark:bg-background-dark border border-secondary-light dark:border-secondary-dark hover:scale-105 transition duration-200"
          >
            <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark">
              {feature.title}
            </h3>
            <p className="text-secondary-light dark:text-secondary-dark">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
