import { useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
const Registrieren = () => {
  const NEW_USER = gql`
    mutation createNewUser($input: UserInput) {
      createNewUser(input: $input) {
        id
        name
        nachname
        email
      }
    }
  `;
  // const QUERY = gql`
  //   query getProducts {
  //     getProducts {
  //       id
  //       name
  //       existence
  //       price
  //       category
  //       description
  //       CreatedAt
  //     }
  //   }
  // `;

  //consulta de apollo
  // const {data} = useQuery(NEW_USER);
  // console.log(data)
  // console.log(loading)
  // console.log(error)
  const [message, saveMessage] = useState(null);
  const [newUser] = useMutation(NEW_USER);
  const router = useRouter();
 // console.log(data)
  // Valitation form with Yup and Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      nachname: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Vorname ist erforderlich"),
      nachname: Yup.string().required("Nachname ist erforderlich"),
      email: Yup.string()
        .email("Email ist nicht gültig")
        .required("Email ist erforderlich"),
      password: Yup.string()
        .required("Password ist erforderlich")
        .min(6, "Password muss mindestens 6 Zeichen lang sein"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      const { name, nachname, email, password } = values;
      try {
        const { data } = await newUser({
          variables: {
            input: {
              name,
              nachname,
              email,
              password,
            },
          },
        });
        console.log(data);
            saveMessage(`Benutzer ${data.newUser.name} erfolgreich erstellt`);

        setTimeout(() => {
          saveMessage(null);
          router.push("/");
        }, 30000);


      } catch (error) {
     
        saveMessage(error.message.replace("GraphQL error: ", ""));

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
  // if (loading) return "Loading...";
  return (
    <>
      <Layout>
        {message && displayMessage()}
        <h1 className="text-4xl  font-light text-white text-center">
          Registrieren
        </h1>

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm rounded">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}>
              <div>
                <label>
                  <span
                    className="block text-gray-700 text-sm font-bold mb-2  "
                    htmlFor="name">
                    Vorname
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Vorname User"
                  name="name"
                  id="name"
                  required
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  placeholder="Nachname User"
                  name="nachname"
                  id="nachname"
                  required
                  value={formik.values.nachname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {formik.touched.nachname && formik.errors.nachname ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.nachname}</p>
                </div>
              ) : null}
              <div>
                <label>
                  <span
                    className="block text-gray-700 text-sm font-bold mb-2  "
                    htmlFor="email">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="Email User"
                  name="email"
                  id="name"
                  required
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
export default Registrieren;
