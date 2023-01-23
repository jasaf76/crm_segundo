//import "styles/globals.css";
import Link from "next/link";
import styles from "./navigation.module.css";

const links = [
  {
    label: "Login",
    route: "/login",
  },
  {
    label: "Bestellungen",
    route: "/bestellungen",
  },
  {
    label: "Produkte",
    route: "/produkte",
  },
  {
    label: "API",
    route: "/posts",
  },
  {
    label: "Dashboard",
    route: "/dashboard",
  },
];

const Navigation =() =>{
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.nav}>
          {links.map(({ label, route }) => (
            <li key={route} className={styles.nav}>
              <Link href={route}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
export default Navigation;