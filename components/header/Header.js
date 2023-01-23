import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const GET_USER = gql`
  query getUser {
    getUser {
      id
      name
      nachname
    }
  }
`;

const Header = () => {
   const router = useRouter();

   const { data, loading, error } = useQuery(GET_USER);
  console.log(data)
  console.log(loading)
  console.log(error)

  //protect data loading for not show error
   if (loading) return null;

  //Si no hay informacion
  if (!data) {
    return router.push("/login");
  }

  const { name, nachname } = data.getUser;

  const sesionClosed = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <div className="sm:flex sm:justify-between mb-6">
      <p className="mr-2 mb-5 lg:mb-0 text-lime-900">
        Hallo: {name}&nbsp;
        {nachname}
      </p>

      <button
        type="button"
        className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
        onClick={() => sesionClosed()}>
        Ausloggen
      </button>
    </div>
  );
};

export default Header;
