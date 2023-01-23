import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import Client from "../components/client/Client";
import { useRouter } from "next/router";

const GET_CLIENTS_BY_SELLER = gql`
  query getClientBySeller {
    getClientBySeller {
      id
      name
      nachname
      company
      email
      phone
      address
    }
  }
`;

const Index = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_CLIENTS_BY_SELLER);
  console.log(data);
  console.log(loading);
  console.log(error);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  if (!data.getClientBySeller) {
    return router.push("/login");
  }
  return (
    <div>
      <Layout className="text-white">
        <h1 className="text-2xl text-gray-800 font-light">Klienten </h1>
        <Link legacyBehavior href="/newClient">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-fulllg:w-auto text-center">
            Neu Kunde
          </a>
        </Link>
        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-zinc-800 ">
              <tr className="text-white">
                <th className="w-1/5 py-2">Name</th>
                <th className="w-1/5 py-2">Nachname</th>
                <th className="w-1/5 py-2">Firma</th>
                <th className="w-1/5 py-2">Email</th>
                <th className="w-1/5 py-2">Telefon</th>
                <th className="w-1/5 py-2">Adresse</th>
                <th className="w-1/5 py-2">Löschen</th>
                <th className="w-1/5 py-2">Editieren</th>
              </tr>
            </thead>
            <tbody className="bg-white text-blue">
              {data.getClientBySeller.map((client, index) => (
                <Client key={index} client={client} />
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
};
export default Index;
