import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import type { Viewport } from "next";
import Script from "next/script";
import LinkedInAds from "@/app/utils/LinkedInAds";
import GoogleTagManager from "@/app/utils/GoogleTagManager";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IntroHub",
  description: "This is where magic happens.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <Script id={"my-clarity-tag"} strategy={"afterInteractive"}>
          {`(function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "mt0cpz8e8x");`}
        </Script>

        {process.env.NODE_ENV === "production" && <LinkedInAds />}
        {process.env.NODE_ENV === "production" && <GoogleTagManager />}

      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
