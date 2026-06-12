import { vendors, type VendorType } from "../data/vendors";

interface Props {
  vendorId: string;
}

const TYPE_STYLES: Record<VendorType, { label: string; classes: string }> = {
  pharmacy:         { label: "Pharmacy",        classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  "big-box":        { label: "Big Box",         classes: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  "niche-ecom":     { label: "Specialist",      classes: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  marketplace:      { label: "Marketplace",     classes: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  research:         { label: "Research",        classes: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  "supplement-store": { label: "Supplement Store", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
};

export default function VendorCard({ vendorId }: Props) {
  const vendor = vendors.find((v) => v.id === vendorId);
  if (!vendor) return null;

  const typeStyle = TYPE_STYLES[vendor.type];

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 flex flex-col gap-3 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm">{vendor.name}</h3>
          <p className="text-white/30 text-xs mt-0.5">{vendor.badge}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${typeStyle.classes}`}>
            {typeStyle.label}
          </span>
          {vendor.trusted && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Vetted
            </span>
          )}
        </div>
      </div>

      <p className="text-white/40 text-xs leading-relaxed">{vendor.notes}</p>

      <p className="text-white/20 text-[10px]">
        Ships: {vendor.ships.join(", ")}
      </p>

      {vendor.keyPrices.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
          {vendor.keyPrices.map((p) => (
            <div key={p.item} className="flex justify-between items-center text-xs gap-2">
              <span className="text-white/40 truncate">{p.item}</span>
              <span className="text-white font-medium shrink-0">{p.price}</span>
            </div>
          ))}
        </div>
      )}

      <a
        href={vendor.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-white/40 hover:text-white transition-colors mt-auto flex items-center gap-1"
      >
        Visit {vendor.name} →
      </a>
    </div>
  );
}
