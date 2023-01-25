import Layout from "../components/Layout";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";

const NEW_PRODUCT = gql`
  mutation createNewProduct($input: ProductInput) {
    createNewProduct(input: $input) {
      id
      name
      existence
      price
      category
      description
      CreatedAt
    }
  }
`;
const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      name
      existence
      price
      category
      description
      CreatedAt
    }
  }
`;

const NewProduct = () => {
  const router = useRouter();

  // Mutation for create new products
  const [createNewProduct] = useMutation(NEW_PRODUCT, {
    update(cache, { data: { createNewProduct } }) {
      const { getProducts } = cache.readQuery({ query: GET_PRODUCTS });
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          getProducts: [...getProducts, createNewProduct],
        },
      });
    },
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      existence: "",
      price: "",
      category: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Der Name ist erforderlich"),
      existence: Yup.number()
        .required("Existenz ist erforderlich")
        .positive("Es muss eine Menge eingetragen werden")
        .integer("Es muss eine ganze Zahl sein"),
      price: Yup.number()
        .required("Preis ist erforderlich")
        .positive("Der Preis muss eine positive Zahl sein")
        .integer("Es muss eine ganze Zahl sein"),
      category: Yup.string()
        .required("Der Artikel muss eine Kategorie zugeordnet werden")
        .min(2, "Die Kategorie muss mindestens 2 Zeichen lang sein"),
      description: Yup.string()
        .required("Beschreibung ist erforderlich")
        .min(10, "Die Beschreibung muss mindestens 10 Zeichen lang sein"),
    }),
    onSubmit: async (values) => {
      const { name, existence, price, category, description } = values;
      try {
        const { data } = await createNewProduct({
          variables: {
            input: {
              name,
              existence,
              price,
              category,
              description,
            },
          },
        });
        Swal.fire({
          icon: "success",
          title: "Produkt erfolgreich erstellt",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            setTimeout(() => {
              Swal.close();
            }, 1500);
            router.push("/products");
            console.log(data);
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Fashion" },
    { id: 3, name: "Home & Garden" },
    { id: 4, name: "Sports & Outdoors" },
    { id: 5, name: "Books" },
    { id: 6, name: "Toys & Games" },
    { id: 7, name: "Automotive" },
  ];
  const defaultOption ="Kategorie auswählen"
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Neues Produkt</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Name des Produkts"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-xs italic">
                  {formik.errors.name}
                  <p className="text-xs italic"> Der Name ist erforderlich</p>
                  <p>{formik.errors.name}</p>
                </div>
              ) : null}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="existence">
                  {" "}
                  Existenz
                </label>
                <input
                  type="number"
                  id="existence"
                  placeholder="Existence des Produkts"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formik.values.existence}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.existence && formik.errors.existence ? (
                <div className="text-red-500 text-xs italic">
                  {formik.errors.existence}
                  <p className="text-xs italic">
                    {" "}
                    Es muss eine Menge eingetragen werden
                  </p>
                  <p className="text-xs italic">
                    {" "}
                    Es muss eine ganze Zahl sein
                  </p>
                  <p>{formik.errors.existence}</p>
                </div>
              ) : null}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="price">
                  Preis
                </label>
                <input
                  type="number"
                  id="price"
                  placeholder="Preis des Produkts"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
              leading-tight focus:outline-none focus:shadow-outline"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  suffix="€"
                />
              </div>
              {formik.touched.price && formik.errors.price ? (
                <div className="text-red-500 text-xs italic">
                  {formik.errors.price}
                  <p className="text-xs italic">
                    {" "}
                    Es muss eine ganze Zahl sein
                  </p>
                  <p>{formik.errors.price}</p>
                </div>
              ) : null}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="category">
                  Kategorie
                </label>
                <select
                  className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  id="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="category">
                  <option value="" disabled>
                    Kategorie auswählen
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.name}
                      disabled={category.name === defaultOption}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {formik.touched.category && formik.errors.category ? (
                <div className="text-red-500 text-xs italic">
                  {formik.errors.category}
                  <p className="text-xs italic">Es muss eine ganze Zahl sein</p>
                  <p>{formik.errors.category}</p>
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full lg:w-12/12 px-3">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-gray-700 text-xs font-bold mb-2"
                    htmlFor="description">
                    Beschreibung
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-
                  leading-tight focus:outline-none focus:shadow-outline h-48 resize-none block"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Beschreibung des Produkts"
                    rows="4"
                    name="description"
                  />
                </div>
                {formik.touched.description && formik.errors.description ? (
                  <div className="text-red-500 text-xs italic">
                    {formik.errors.description}
                    <p className="text-xs italic">
                      {" "}
                      Es muss eine ganze Zahl sein
                    </p>
                    <p>{formik.errors.description}</p>
                  </div>
                ) : null}
                <input
                  type="submit"
                  className="bg-sky-800 w-full mt-5 p-2 text-white uppercase hover:bg-lime-600 cursor-pointer font-semibold text-amber-500 rounded hover:text-blue-900"
                  value="Erstellen Sie ein neues Produkt"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
export default NewProduct;
