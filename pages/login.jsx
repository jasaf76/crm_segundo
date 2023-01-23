import React, { useState } from "react";

import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const AUTH_USER = gql`
  mutation authUser($input: AuthInput) {
    authUser(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const [authUser] = useMutation(AUTH_USER);
  const router = useRouter();

  const [message, saveMessage] = useState(null);
  // Valitation form with Yup and Formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email ist nicht gültig")
        .required("Email ist erforderlich"),
      password: Yup.string()
        .required("Password ist erforderlich")
        .min(6, "Password muss mindestens 6 Zeichen lang sein"),
    }),
    onSubmit: async (values) => {
      console.log(values)
      const { email, password } = values;

      try {
        const { data } = await authUser({
          variables: {
            input: {
              email,
              password,
             
            },
            
          },
        });
        console.log(data);
        saveMessage(`Benutzer mit der ${email} wurde erfolgreich angemeldet`);
        // Guardar el token en localstorage
        setTimeout(() => {
          const { token } = data.authUser;
          localStorage.setItem("token", token);
        }, 1000);
        // Redireccionar
        setTimeout(() => {
          saveMessage(null);
          router.push("/");
        }, 5000);
      } catch (error) {
        console.log(error)
        saveMessage(error.message.replace("GraphQL error:", ""));
        setTimeout(() => {
          saveMessage(null);
        }, 30000);
      }
    },
  });

  const displayMessage = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{message}</p>
      </div>
    );
  };



  return (
    <>
      <Layout>
        <h1 className="text-4xl  font-light text-white text-center">Login</h1>
        {message && displayMessage()}
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm rounded">
            <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
             
              <div>
                <label>
                  <span
                    className="block text-gray-700 text-sm font-bold mb-2  "
                    htmlFor="name">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="Email User"
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
              <div>
                <label>
                  <span
                    className="block text-gray-700 text-sm font-bold mb-2 pt-2  "
                    htmlFor="password">
                    Password
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Email User"
                  name="password"
                  id="password"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.password}</p>
                </div>
              ) : null}
              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercas hover:cursor-pointer hover:bg-gray-900 rounded-lg"
                value="Einloggen"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};
export default Login;
