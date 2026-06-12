export default function LegalPage({ title, sections }) {

  return (
    <>
      <section className="legal-gradient pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-light text-brand-dark text-sm font-medium">
            Legal
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mt-7 text-ink">
            {title}
          </h1>
          <p className="mt-5 text-ink-soft">Last updated: January 15, 2025</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 space-y-6">
          {sections.map((s, i) => (
            <article
              key={i}
              className="bg-white border border-line rounded-2xl p-8 shadow-sm"
            >
              <div className="flex items-start gap-5">
                <span className="flex-shrink-0 w-11 h-11 rounded-full bg-brand-light text-brand-dark font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <h2 className="font-serif text-2xl font-bold text-ink">
                    {s.title}
                  </h2>
                  <div className="mt-5 space-y-4 text-ink-soft leading-relaxed">
                    {s.body.map((block, j) => {
                      if (typeof block === "string")
                        return <p key={j}>{block}</p>;
                      if (block.list)
                        return (
                          <ul
                            key={j}
                            className="list-disc list-outside pl-5 space-y-2"
                          >
                            {block.list.map((li, k) => (
                              <li key={k}>{li}</li>
                            ))}
                          </ul>
                        );
                      if (block.subhead)
                        return (
                          <div key={j}>
                            <h3 className="font-semibold text-ink">
                              {block.subhead}
                            </h3>
                            <p className="mt-2">{block.text}</p>
                          </div>
                        );
                      return null;
                    })}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
