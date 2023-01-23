import React from "react";
import Swal from "sweetalert2";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Formik } from "formik";
import * as Yup from "yup";
import Layout from "../../components/Layout";

const GET_CLIENT = gql`
  query getClient($id: ID!) {
    getClient(id: $id) {
      name
      id
      nachname
      email
      phone
      company
      address
    }
  }
`;

const UPDATE_CLIENT = gql`
  mutation updateClient($id: ID!, $input: UpdateClientInput) {
    updateClient(id: $id, input: $input) {
      name
      email
      nachname
      company
      phone
      address
    }
  }
`;

const EditClient = () => {
  const router = useRouter();
  // query the current id
  const {
    query: { id },
  } = router;
  console.log(id);
  // query the client
  const { data, loading, error } = useQuery(GET_CLIENT, {
    variables: {
      id,
    },
  });

  //update client
  const [updateClient] = useMutation(UPDATE_CLIENT, {
    update(cache, { data: { updateClient } }) {
      cache.writeQuery({
        query: GET_CLIENT,
        variables: { id },
        data: {
          getClient: updateClient,
        },
      });
    },
  });
  //   update(cache) {
  //     const { getClient } = cache.readQuery({
  //       query: GET_CLIENT,
  //     });

  //     cache.writeQuery({
  //       query: GET_CLIENT,
  //       data: {
  //         getClient: getClient.filter(
  //           (currentClient) => currentClient.id !== id
  //         ),
  //       },
  //     });
  //   },
  // });

  //schema validation
  const schemaValidation = Yup.object({
    name: Yup.string().required("Name is required"),
    nachname: Yup.string().required("Nachname is required"),
    company: Yup.string().required("Company is required"),
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  //if the query is loading protect the app from crashing

  console.log(data.getClient);

  const { getClient } = data;

  //update the info in the DB
  const updateInfoClient = async (values) => {
    const { name, nachname, company, email, phone, address } = values;
    try {
      const { data } = await updateClient({
        variables: {
          id,
          input: {
            name,
            nachname,
            company,
            email,
            phone,
            address,
          },
        },
      });

      console.log(data);
      //ALERT SUCCESS UPDATE
      Swal.fire(
        "Aktualisiert",
        "Der Benutzer wurde erfolgreich aktualisiet",
        "success"
      );
      //redirect to the clients page
      setTimeout(() => {
        router.push("/");
      }, 2000);
     
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Klient Editieren</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            validationSchema={schemaValidation}
            enableReinitialize
            initialValues={getClient}
            onSubmit={(values) => {
              updateInfoClient(values);
            }}>
            {(props) => {
              return (
                <form
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={props.values.name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.name && props.errors.name ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.name}</p>
                    </div>
                  ) : null}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="nachname">
                      Nachname
                    </label>
                    <input
                      id="nachname"
                      type="text"
                      placeholder="Nachname"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={props.values.nachname}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.nachname && props.errors.nachname ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.nachname}</p>
                    </div>
                  ) : null}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="company">
                      Firma
                    </label>
                    <input
                      id="company"
                      type="text"
                      placeholder="Firma"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={props.values.company}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.company && props.errors.company ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.company}</p>
                    </div>
                  ) : null}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={props.values.email}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.email && props.errors.email ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.email}</p>
                    </div>
                  ) : null}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="phone">
                      Telefon
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Telefon"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={props.values.phone}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.phone && props.errors.phone ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.phone}</p>
                    </div>
                  ) : null}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="address">
                      Adresse
                    </label>
                    <input
                      id="address"
                      type="text"
                      placeholder="Adresse"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={props.values.address}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.address && props.errors.address ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.address}</p>
                    </div>
                  ) : null}
                  <input
                    type="submit"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                    value="Senden"
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditClient;

// const EditClient = () => {
//   const router = useRouter();
//   const { query } = router;
//   console.log(query)
//   return (
//     <Layout>
//       <h1 className="text-2xl text-gray-800 font-light">Edit Client</h1>
//     </Layout>
//   );

// };
// export default EditClient;
