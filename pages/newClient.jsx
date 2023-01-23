import React, { useState } from "react";
import Layout from "../components/Layout";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
const NEW_CLIENT = gql`
  mutation creteNewClient($input: ClientInput) {
    createNewClient(input: $input) {
      id
      name
      nachname
      email
      phone
      company
      address
    }
  }
`;

const GET_CLIENTS_BY_USER = gql`
  query getClientBySeller {
    getClientBySeller {
      id
      name
      nachname
      company
      email
     
    }
  }
`;
const NewClient = () => {
  const router = useRouter();

  const [message, saveMessage] = useState(null);
  
  const [creteNewClient] = useMutation(NEW_CLIENT, {
    update(cache, { data: { createNewClient } }) {
      // Get the object from the cache
      const { getClientBySeller } = cache.readQuery({
        query: GET_CLIENTS_BY_USER,
      });
      // Add the new client to the cache
      cache.writeQuery({
        query: GET_CLIENTS_BY_USER,
        data: {
          getClientBySeller: [...getClientBySeller, createNewClient],
        },
      });
    },
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      nachname: "",
      email: "",
      phone: "",
      company: "",
      address: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name ist erforderlich")
        .min(3, "Name muss mindestens 3 Zeichen lang sein"),
      nachname: Yup.string()
        .required("Nachname ist erforderlich")
        .min(3, "Nachname muss mindestens 3 Zeichen lang sein"),
      email: Yup.string()
        .email("Email ist nicht gültig")
        .required("Email ist erforderlich"),
      phone: Yup.string()
        .required("Telefon ist erforderlich")
        .min(3, "Telefon muss mindestens 3 Zeichen lang sein"),
      company: Yup.string()
        .required("Firma ist erforderlich")
        .min(3, "Firma muss mindestens 3 Zeichen lang sein"),
      address: Yup.string()
        .required("Adresse ist erforderlich")
        .min(3, "Adresse muss mindestens 3 Zeichen lang sein"),
    }),
    
    onSubmit: async (values) => {
      console.log(values);
      const { name, nachname, email, phone, company, address } = values;

      try {
        const { data } = await creteNewClient({
          variables: {
            input: {
              name,
              nachname,
              email,
              phone,
              company,
              address,
            },
          },
        });
        //console.log(data.createNewClient);
        router.push("/");
        toast.success("Succesfully Edited");
      } catch (error) {
        saveMessage(error.message.replace("GraphQL error: ", ""));
        setTimeout(() => {
          saveMessage(null);
        }, 3000);
      }
    },
  });
  const showMessage = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{message}</p>
      </div>
    );
  };

  return (
    <Layout>
      <h1 className="text-2xl text-lime-800 font-semibold">Neu Kunde</h1>
      {message && showMessage()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4 rounded"
          onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label>
                <span
                  className="block text-gray-700 text-sm font-bold mb-2  "
                  htmlFor="name">
                  Name
                </span>
              </label>
              <input
                type="text"
                placeholder="Name Benutzer"
                name="name"
                id="name"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.name}</p>
              </div>
            ) : null}
            <div>
              <label>
                <span
                  className="block text-gray-700 text-sm font-bold mb-2  "
                  htmlFor="nachname">
                  Nachname
                </span>
              </label>
              <input
                type="text"
                placeholder="Nachname Benutzer"
                name="nachname"
                id="nachname"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nachname}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.nachname && formik.errors.nachname ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.nachname}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label>
                <span
                  className="block text-gray-700 text-sm font-bold mb-2  "
                  htmlFor="company">
                  Firma
                </span>
              </label>
              <input
                type="text"
                placeholder="Ihre Firma"
                name="company"
                id="company"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.company}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.company && formik.errors.company ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.company}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label>
                <span
                  className="block text-gray-700 text-sm font-bold mb-2  "
                  htmlFor="email">
                  Email
                </span>
              </label>
              <input
                type="email"
                placeholder="Email Benutzer"
                name="email"
                id="name"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.email}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label>
                <span
                  className="block text-gray-700 text-sm font-bold mb-2  "
                  htmlFor="phone">
                  Telefon
                </span>
              </label>
              <input
                type="tel"
                placeholder="Telefon Benutzer"
                name="phone"
                id="phone"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.phone && formik.errors.phone ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.phone}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label>
                <span
                  className="block text-gray-700 text-sm font-bold mb-2  "
                  htmlFor="address">
                  Adresse
                </span>
              </label>
              <input
                type="text"
                placeholder="Ihre Adresse"
                name="address"
                id="address"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.address && formik.errors.address ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.address}</p>
              </div>
            ) : null}
            <input
              type="submit"
              className="bg-blue-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor-pointer rounded"
              value="Neu Kunde"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewClient;
