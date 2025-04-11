import React from "react";

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function BlogLayout({ children }: Readonly<BlogLayoutProps>) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      {children}
    </main>
  );
}
