import { vendors, type VendorType } from "../data/vendors";

interface Props {
  vendorId: string;
  productUrl?: string;
}

const TYPE_STYLES: Record<VendorType, { label: string; classes: string }> = {
  pharmacy:         { label: "Pharmacy",        classes: "bg-[#6b93c9]/10 text-[#8fadd6] border-[#6b93c9]/25" },
  "big-box":        { label: "Big Box",         classes: "bg-[#8c8f96]/10 text-[#a4a7ad] border-[#8c8f96]/25" },
  "niche-ecom":     { label: "Specialist",      classes: "bg-[#a084d1]/10 text-[#b7a2dd] border-[#a084d1]/25" },
  marketplace:      { label: "Marketplace",     classes: "bg-[#c9793f]/10 text-[#d6996b] border-[#c9793f]/25" },
  research:         { label: "Research",        classes: "bg-[#c9a227]/10 text-[#d6bb5c] border-[#c9a227]/25" },
  "supplement-store": { label: "Supplement Store", classes: "bg-[#6fae7c]/10 text-[#8fc099] border-[#6fae7c]/25" },
};

export default function VendorCard({ vendorId, productUrl }: Props) {
  const vendor = vendors.find((v) => v.id === vendorId);
  if (!vendor) return null;

  const typeStyle = TYPE_STYLES[vendor.type];
  const linkUrl = productUrl ?? vendor.url;

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
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
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
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-white/40 hover:text-white transition-colors mt-auto flex items-center gap-1"
      >
        {productUrl ? "View product →" : `Visit ${vendor.name} →`}
      </a>
    </div>
  );
}
