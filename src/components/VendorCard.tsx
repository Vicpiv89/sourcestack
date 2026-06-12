import { vendors } from "../data/vendors";

interface Props {
  vendorId: string;
}

export default function VendorCard({ vendorId }: Props) {
  const vendor = vendors.find((v) => v.id === vendorId);
  if (!vendor) return null;

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 flex flex-col gap-3 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-white font-semibold text-sm">{vendor.name}</h3>
          <p className="text-white/40 text-xs mt-0.5">
            Ships: {vendor.ships.join(", ")}
          </p>
        </div>
        {vendor.trusted && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            Vetted
          </span>
        )}
      </div>
      <p className="text-white/50 text-xs leading-relaxed">{vendor.notes}</p>
      {vendor.keyPrices.length > 0 && (
        <div className="flex flex-col gap-1">
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
      <a
        href={vendor.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-white/50 hover:text-white transition-colors mt-auto"
      >
        Visit site →
      </a>
    </div>
  );
}
