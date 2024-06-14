import {Tinos} from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "NYT Games Club",
  description: "The weekly competition for daily games from the New York Times",
};

const tinos = Tinos({ 
  weight: ["400"], 
  subsets: ["latin"], 
  display: 'swap',
  variable: '--font-tinos',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (


    <html lang="en" className={tinos.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>The Daily Puzzler</title>
        {/* <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" /> */}
      </head>
      <body className="bg-background text-foreground bg-gray-200">
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
