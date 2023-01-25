import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";
import Loading from "../loading/Loading";

const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      name
      existence
      price
    
    }
  }
`;

const AddProducts = () => {
  // State local for this component
  const [products, setProducts] = useState([]);
  const pedidoContext = useContext(PedidoContext);
  const { addProduct } = pedidoContext;

  // Get the products from the database
  const { loading, error, data } = useQuery(GET_PRODUCTS);
   console.log(products)
  useEffect(() => {
    //  TODO: #2 Add the products to the state
    addProduct(products);
  }, [products]);

  const selectedProduct = (option) => {
    if (option) {
      setProducts([...products, option]);

    }
  };

  if (loading) return <Loading />;
  if (error) return `Error: "algo salio faltal"`;
  const { getProducts } = data;
  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        2.- wähle die Produkte aus
      </p>
      <Select
        className="mt-3"
        classNamePrefix="react-select"
        options={getProducts}
        onChange={(option) => selectedProduct(option)}
        getOptionValue={(options) => options.id}
        getOptionLabel={(options) =>
          `${options.name} - ${options.existence} verfügbar`
        }
        placeholder="Produkte auswählen oder suchen"
       
        noOptionsMessage={() => "Keine Ergebnisse"}
      />
    </>
  );
};
export default AddProducts;
