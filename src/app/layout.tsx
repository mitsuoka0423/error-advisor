import Script from "next/script";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-1T8VTCLMZK"
        ></Script>
        <Script id="G-1T8VTCLMZK">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-1T8VTCLMZK');
          `}
        </Script>
        <title>ChatGPTに聞く</title>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
