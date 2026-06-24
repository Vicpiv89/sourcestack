import { Helmet } from "react-helmet-async";

const BASE_URL = "https://sourcestack.onrender.com";
const DEFAULT_TITLE = "SourceStack — Looksmaxxing Protocol & Vendor Hub";
const DEFAULT_DESC =
  "Vetted protocols and trusted vendor sources for hair loss, skincare, peptides, and supplements. 55 compounds, 14 verified vendors. Built by practitioners.";

interface Props {
  title?: string;
  description?: string;
  path?: string;
}

export default function SEO({ title, description, path = "" }: Props) {
  const fullTitle = title ? `${title} | SourceStack` : DEFAULT_TITLE;
  const desc = description ?? DEFAULT_DESC;
  const canonical = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="SourceStack" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
}
