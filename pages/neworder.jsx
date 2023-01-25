import React, { useState,useContext } from "react";
import Layout from "../components/Layout";
import AddCostumer from "../components/bestellungen/AddCostumer";
import AddProducts from "../components/bestellungen/AddProducts";
import OrderSummary from "../components/bestellungen/OrderSummary";
import Total from "../components/bestellungen/Total";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

// TODO: context for orders
import PedidoContext from "../context/pedidos/PedidoContext";

const NEW_ORDER = gql`
  mutation createNewOrder($input: OrderInput) {
    createNewOrder(input: $input) {
      id
    }
  }
`;

const GET_ORDERS = gql`
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
        address
        company
      }
      seller
      status
    }
  }
`;

const NewOrder = () => {
  const router = useRouter();

  const [message, setMessage] = useState(null);

  const pedidoContext = useContext(PedidoContext);

  const { client, products, total } = pedidoContext;
  console.log(products);
  console.log(client)
  const [createNewOrder] = useMutation(NEW_ORDER, {
    update(cache, { data: { createNewOrder } }) {
      const { getOrdersBySeller } = cache.readQuery({ query: GET_ORDERS });
      cache.writeQuery({
        query: GET_ORDERS,
        data: { getOrdersBySeller: [...getOrdersBySeller, createNewOrder] },
      });
    },
  }); //TODO: update cache

  const validateOrder = () => {

      return  !products.every((product) => product.quantity > 0) ||
        total === 0 ||
        client.length === 0
        ? " opacity-50 cursor-not-allowed "
        : "";
    };

 const functionCreateNewOrdner = async () => {
   const { id } = client;
   const order = products.map(
     ({ __typename, existence, ...product }) => product
   );
    console.log(products);
   try {
     const { data } = await createNewOrder({
       variables: {
         input: {
           client: id,
           total,
           order,
         },
       },
     });
     router.push("/orders");
     Swal.fire("Success", "The order has been created", "success");
   } catch (error) {
     setMessage(error.message.replace("GraphQL error: ", ""));
     setTimeout(() => {
       setMessage(null);
     }, 8000);
   }
 };

  const showMessage = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto ">
        <p>{message} </p>
      </div>
    );
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800">Bestellungen</h1>
      {message && showMessage()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AddCostumer />
          <AddProducts />
          <OrderSummary />
          <Total />
          <button
            type="button"
            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validateOrder()} `}
            onClick={functionCreateNewOrdner}>
            Bestellung registrieren
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NewOrder;
