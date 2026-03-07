/* eslint-disable import/order */
"use client";

import type { ReactNode } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import { motion } from "framer-motion";
import { ThemeProvider } from "next-themes";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        exit={{ opacity: 0 }}
      >
        {/* ✅ Force light mode here */}
        <div className="flex flex-col min-h-screen bg-[#dcdcdc] text-gray-900">
          <Header />
          <main className="flex-grow p-4">{children}</main>
          <Footer />
        </div>
      </motion.div>
    </ThemeProvider>
  );
};

export default Layout;
