import React from "react";
import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";
import  Router  from "next/router";

const DELETE_CLIENT = gql`
  mutation deleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`;

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
const Client = ({ client, index }) => {

  const [deleteClient] = useMutation(DELETE_CLIENT, {
    update(cache) {
      const { getClientBySeller } = cache.readQuery({
        query: GET_CLIENTS_BY_SELLER,
      });
      cache.writeQuery({
        query: GET_CLIENTS_BY_SELLER,
        data: {
          getClientsBySeller: getClientBySeller.filter(
            (currentClient) => currentClient.id !== id
          ),
        },
      });
    },
  });
  const { id, name, nachname, company, email, phone, address } = client;
  
  const confirmDeleteClient = () => {
    Swal.fire({
      title: "Sind Sie sicher ?",
      text: "Sie können diese Aktion nicht rückgängig machen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ja, löschen!",
      cancelButtonText: "Nein, abbrechen",
    }).then(async (result) => {
      if (result.value) {
        try {
          const { data } = await deleteClient({
            variables: {
              id,
            },
          });
          console.log(data);
          Swal.fire("Gelöscht!", data.deleteClient, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editClient = () => {
    Router.push({
      pathname: "/editclient/[id]",
      query: { id },
    });
  };
            
  return (
    <tr key={index}>
      <td className="border px-4 py-2 ">{client.name}</td>
      <td className="border px-4 py-2">{client.nachname}</td>
      <td className="border px-4 py-2">{client.company}</td>
      <td className="border px-4 py-2">{client.email}</td>
      <td className="border px-4 py-2">{client.phone}</td>
      <td className="border px-4 py-2">{client.address}</td>
      <td className="border px-4 py-2">
      <button
        type="button"
        className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
        onClick={() => confirmDeleteClient(client.id)}>
        Löschen
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="w-4 h-4 ml-2">
          <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        </button>
      </td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
          onClick={() => editClient()}>
          Bearbeiten
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="w-4 h-4 ml-2">
            <path d="M12 19l9 2-2-9M2 2l7.586 7.586"></path>
            <circle cx="11" cy="11" r="8"></circle>
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default Client;
