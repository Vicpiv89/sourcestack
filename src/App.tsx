import { useState } from "react";
import { vendors, type Category } from "./data/vendors";

const CATEGORIES: Category[] = [
  "Minoxidil",
  "Peptides",
  "Supplements",
  "Research Compounds",
  "Skincare",
];

export default function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const filtered = vendors.filter((v) => {
    const matchesSearch =
      search === "" ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.notes.toLowerCase().includes(search.toLowerCase()) ||
      v.keyPrices.some((p) =>
        p.item.toLowerCase().includes(search.toLowerCase())
      );
    const matchesCategory =
      activeCategory === null || v.categories.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <div>
          <span className="text-xl font-semibold tracking-tight text-white">
            SourceStack
          </span>
          <span className="ml-3 text-xs text-white/40 uppercase tracking-widest">
            Find your stack cheaper
          </span>
        </div>
        <a
          href="#submit"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          Submit a source →
        </a>
      </header>

      {/* Hero */}
      <div className="px-6 pt-16 pb-12 max-w-2xl">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
          Stop overpaying for your stack.
        </h1>
        <p className="text-white/50 text-lg">
          Vetted sources for minoxidil, peptides, research compounds, and
          supplements — curated by guys who actually use this stuff.
        </p>
      </div>

      {/* Filters */}
      <div className="px-6 pb-8 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Search compounds, vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === null
                ? "bg-white text-black"
                : "bg-white/5 text-white/50 hover:text-white/80"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory(activeCategory === cat ? null : cat)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/50 hover:text-white/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor Grid */}
      <div className="px-6 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        {filtered.length === 0 ? (
          <p className="text-white/30 text-sm col-span-3 py-12">
            No sources found.
          </p>
        ) : (
          filtered.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-5 flex flex-col gap-4 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-white font-semibold text-base">
                    {vendor.name}
                  </h2>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {vendor.categories.map((cat) => (
                      <span
                        key={cat}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                {vendor.trusted && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    Vetted
                  </span>
                )}
              </div>

              <p className="text-white/50 text-sm leading-relaxed">
                {vendor.notes}
              </p>

              {vendor.keyPrices.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {vendor.keyPrices.map((p) => (
                    <div
                      key={p.item}
                      className="flex justify-between items-center text-xs"
                    >
                      <span className="text-white/40">{p.item}</span>
                      <span className="text-white font-medium">{p.price}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                <span className="text-xs text-white/30">
                  Ships: {vendor.ships.join(", ")}
                </span>
                <a
                  href={vendor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/60 hover:text-white transition-colors"
                >
                  Visit →
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit CTA */}
      <div
        id="submit"
        className="mx-6 mb-20 border border-white/10 rounded-xl p-8 text-center max-w-6xl"
      >
        <p className="text-white/60 text-sm mb-1">Know a cheaper source?</p>
        <p className="text-white font-medium mb-4">
          Submit it and we'll vet it.
        </p>
        <a
          href="mailto:hello@sourcestack.io"
          className="inline-block bg-white text-black text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors"
        >
          Submit a source
        </a>
      </div>
    </div>
  );
}
