import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import Loading from "../components/loading/Loading";
import Order from "../components/bestellung/Order";

const GET_BESTELLUNGEN = gql`
  query getOrdersBySeller {
    getOrdersBySeller {
      id
      order {
        id
        quantity
        name
      }

      client {
        id
        name
        nachname
        email
        phone
      
      }
      seller
      total
      status
    }
  }
`;

const orders = () => {
  const { data, loading, error } = useQuery(GET_BESTELLUNGEN);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const Timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(Timer);
  // }, []);

 
 
   console.log(data)


  if (loading)
    return (
      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            <p>Loading...</p>
          </div>
        )}
      </div>
    );
  
  const { getOrdersBySeller } = data;
 if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Bestellungen</h1>

        <Link legacyBehavior href="/neworder">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
            Neue Bestellung
          </a>
        </Link>
        {getOrdersBySeller.length === 0 ? (
          <p className="mt-5 text-center text-2xl">Noch keine Bestellungen</p>
        ) : (
          getOrdersBySeller.map((order) => (
            <Order key={order.id} order={order} />
          ))
        )}
      </Layout>
    </div>
  );
};

export default orders;
