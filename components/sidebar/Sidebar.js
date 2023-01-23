import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();
  return (
    <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screeen p-5">
      <div>
        <p className="text-white text-2xl font-black text-center">CRM-Kunden</p>
      </div>
      <nav className="m-t5 list-none">
        <li
          className={
            router.pathname === "/" ? "bg-blue-800 p-3 rounded-lg " : "p-3"
          }>
          <Link className="text-white mb-2 block" href="/">
            Kunden
          </Link>
        </li>

        <li
          className={
            router.pathname === "/bestellungen"
              ? "bg-blue-800 p-3 rounded-lg "
              : "p-3"
          }>
          <Link className="text-white mb-2 block" href="/bestellungen">
            Bestellungen
          </Link>
        </li>
        <li
          className={
            router.pathname === "/products"
              ? "bg-blue-800 p-3 rounded-lg "
              : "p-3"
          }>
          <Link className="text-white mb-2 block" href="/products">
            Produkte
          </Link>
        </li>
      </nav>
    </aside>
  );
};
export default Sidebar;
