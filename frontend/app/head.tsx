export default function Head() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const title = "Tracker de Trades";
  const description = "Suivi de vos performances de trading";
  const og = `${base}/images/header-image.png`;
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={base} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={base} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Tracker Trading" />
      <meta property="og:image" content={og} />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="720" />
      <meta property="og:locale" content="fr_FR" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={og} />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </>
  );
}