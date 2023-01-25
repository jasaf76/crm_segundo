import Link from "next/link";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";
import Product from "../components/product/Product";
import { gql, useQuery } from "@apollo/client";
import Loading from "../components/loading/Loading";
const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      name
      existence
      price
      category
      description
      CreatedAt
    }
  }
`;

const Products = () => {

  const { data, loading, error } = useQuery(GET_PRODUCTS);
  console.log(data);
  console.log(loading);
  console.log(error);
  if (loading) return  <Loading />;
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <Layout className="text-white">
        <h1 className="text-2xl text-gray-800 font-light">Produkte</h1>
        <Link legacyBehavior href="/newproduct">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-fulllg:w-auto text-center">
            Neu Produkt
          </a>
        </Link>
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-zinc-800 ">
            <tr className="text-white">
              <th className="w-1/5 py-2">Name</th>
              <th className="w-1/5 py-2">Existenz</th>
              <th className="w-1/5 py-2">Preis</th>
              <th className="w-1/5 py-2">Kategorie</th>
              <th className="w-1/5 py-2">Beschreibung</th>
              <th className="w-1/5 py-2">ID</th>
              <th className="w-1/5 py-2">Löschen</th>
              <th className="w-1/5 py-2">Editieren</th>
            </tr>
          </thead>
          <tbody className="bg-white text-blue">
            {data.getProducts.map((product, index) => (
              <Product key={index} product={product} />
            ))}
          </tbody>
        </table>


      </Layout>
    </div>
  );
};
export default Products;
