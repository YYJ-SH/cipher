
import "./globals.css";

export const metadata = {
  title: "시저암호 해독기",
  description: "시저암호를 쉽게 풀어봅시다",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
      {children}
      </body>
    </html>
    );
}
