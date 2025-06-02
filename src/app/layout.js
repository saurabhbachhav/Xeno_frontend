import Navbar from "@/components/Navbar";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider"; // ✅ client wrapper

export const metadata = {
  title: "Xeno_minCRM",
  description: "Mini CRM Platform for Campaign Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="p-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
