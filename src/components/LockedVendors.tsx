import VendorCard from "./VendorCard";

type Props = {
  vendorIds: string[];
  onUnlock: () => void;
};

export default function LockedVendors({ vendorIds, onUnlock }: Props) {
  if (vendorIds.length === 0) return null;

  return (
    <div className="relative cursor-pointer" onClick={onUnlock}>
      <div className="blur-sm pointer-events-none select-none grid grid-cols-1 sm:grid-cols-2 gap-4">
        {vendorIds.map((id) => (
          <VendorCard key={id} vendorId={id} />
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-white font-semibold text-sm">🔒 Vendors locked</p>
        <p className="text-white/40 text-xs max-w-xs">
          Get vetted vendor prices, trust scores, and direct links with Pro
        </p>
        <button className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg hover:bg-white/90 transition-colors">
          Unlock for $19/mo
        </button>
      </div>
    </div>
  );
}
