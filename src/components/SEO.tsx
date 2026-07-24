import { Helmet } from "react-helmet-async";

const BASE_URL = "https://sourcestack.app";
const DEFAULT_TITLE = "SourceStack — Looksmaxxing Protocol & Vendor Hub";
const DEFAULT_DESC =
  "Vetted protocols and trusted vendor sources for hair loss, skincare, peptides, and supplements. 80 compounds, 22 verified vendors. Built by practitioners.";

interface Props {
  title?: string;
  description?: string;
  path?: string;
  /** Account/checkout-style pages — keep out of search results entirely. */
  noindex?: boolean;
}

export default function SEO({ title, description, path = "", noindex = false }: Props) {
  const fullTitle = title ? `${title} | SourceStack` : DEFAULT_TITLE;
  const desc = description ?? DEFAULT_DESC;
  const canonical = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="SourceStack" />
      <meta property="og:image" content={`${BASE_URL}/brand/og-image.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={`${BASE_URL}/brand/og-image.png`} />
    </Helmet>
  );
}
