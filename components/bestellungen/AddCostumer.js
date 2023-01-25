import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";
import Loading from "../loading/Loading";

const GET_CLIENTS_BY_USER = gql`
  query getClientBySeller {
    getClientBySeller {
      id
      name
      nachname
      email
      company
      
  
    }
  }
`;

const AddCostumer = () => {
  const [client, setClient] = useState([]);

  // context de pedidos
  const pedidoContext = useContext(PedidoContext);
  const { addClient} = pedidoContext;
  // Consultar la base de datos
  const { loading, error, data } = useQuery(GET_CLIENTS_BY_USER);

  useEffect(() => {
    // TODO: #1 Add Client to the state
    addClient(client);
  }, [client]);

  const selectClient = (client) => {
    setClient(client );

  };
  if (loading) return <Loading />;
  if (error) return `Error: "algo salio faltal"`;

  const { getClientBySeller } = data;

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        1.- ordnet den Auftrag dem Kunden zu
      </p>
      <Select
        className="mt-3"
        options={getClientBySeller}
        onChange={(option) => selectClient(option)}
        getOptionValue={(options) => options.id}
        getOptionLabel={(options) => options.name}
        classNamePrefix="react-select"
        placeholder="Kunden auswählen oder Kunde suchen"
        isSearchable={true}
        isClearable={true}
        noOptionsMessage={() => "Keine Ergebnisse"}
      />
    </>
  );
};
export default AddCostumer;
