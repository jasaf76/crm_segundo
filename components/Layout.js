import React from "react";
import Navigation from "./navigation/Navigation";
import Sidebar from "./sidebar/Sidebar";
import { useRouter } from "next/router";
import Header from "./header/Header";

const Layout = ({ children }) => {
  const router = useRouter();
  return (
    <>
      <title>CRM - Kundenverwaltung</title>
      {router.pathname === "/login" || router.pathname === "/registrieren" ? (
        <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
          <div>{children}</div>
        </div>
      ) : (
        <div className="bg-gray-200 min-h-screen">
          <Navigation />
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="sm:w-2/3 xl:w-4/5 sm:min-h-screeen p-5">
              <Header />
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
};
export default Layout;
