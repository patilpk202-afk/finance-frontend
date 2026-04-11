import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Personal Finance Manager",
  description: "Manage your finances effortlessly",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  if (storedTheme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else if (storedTheme === 'light') {
                    document.documentElement.removeAttribute('data-theme');
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main style={{ paddingTop: "76px" }} className="sm:px-4 md:px-0">
          {children}
        </main>
      </body>
    </html>
  );
}
