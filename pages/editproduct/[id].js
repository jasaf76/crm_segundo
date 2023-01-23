import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const GET_PRODUCT = gql`
  query getProductById($id: ID!) {
    getProductById(id: $id) {
      id
      name
      description
      category
      existence
      CreatedAt
      price
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation updatePrduct($id: ID!, $input: ProductInput) {
    updateProduct(id: $id, input: $input) {
      id
      name
      existence
      price
      category
      existence
      description
    }
  }
`;

const EditProduct = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  console.log(id);
  // amswer query for product by id
  const { data, loading, error } = useQuery(GET_PRODUCT , {
    variables: {
      id,
    },
  });
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  
  // Schema validation
  const schemaValidation = Yup.object({
    name: Yup.string()
      .min(2, "Der Name ist zu Kurz!")
      .max(50, "Der Name ist zu lang!")
      .required("muss ausgefüllt werden!"),
    existence: Yup.number()
      .required("muss ausgefüllt werden!")
      .positive("Die Anzahl muss positiv sein!")
      .integer("Die Anzahl muss eine ganze Zahl sein!"),
    price: Yup.number()
      .required("Der Preis muss ausgefüllt werden!")
      .positive("Der Preis muss positiv sein!"),

    category: Yup.string().required("Category muss eingetragen werden!"),
    description: Yup.string().required(
      "Ein Beschreibung muss eingetragen werden!"
    ),
  });
  console.log(data);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  if (!data) {
    return "Kein Produkt gefunden!";
  }

  const updateInfoProduct = async (values) => {
    const { name, existence, price, category, description } = values;
    try {
      const { data } = await updateProduct({
        variables: {
          id,
          input: {
            name,
            existence,
            price,
            category,
            description,
          },
        },
      });
      console.log(data);
      // redirect to products
      router.push("/products");
      // show alert
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Produkt wurde aktualisiert!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.log(error);
      // show alert
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Produkt konnte nicht aktualisiert werden!",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          Swal.hideLoading();
        },
        timer: 1500,
      });
    }
  };
  const { getProductById } = data;
  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Fashion" },
    { id: 3, name: "Home & Garden" },
    { id: 4, name: "Sports & Outdoors" },
    { id: 5, name: "Books" },
    { id: 6, name: "Toys & Games" },
    { id: 7, name: "Automotive" },
  ];
  console.log(categories);
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Edit Product</h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            enableReinitialize
            initialValues={getProductById}
            validationSchema={schemaValidation}
            onSubmit={(values) => {
              updateInfoProduct(values);
            }}>
            {(props) => {
              return (
                <form
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4 rounded-lg border border-gray-200 border-opacity-50 
                  hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  onSubmit={props.handleSubmit}>
                  <div className="m-4">
                    <label
                      className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Name des Produktes"
                      id="name"
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
                  <div className="m-4">
                    <label
                      className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="existence">
                      Anzahl
                    </label>
                    <input
                      type="number"
                      className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Anzahl des Produktes"
                      id="existence"
                      value={props.values.existence}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.existence && props.errors.existence ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.existence}</p>
                    </div>
                  ) : null}
                  <div className="m-4">
                    <label
                      className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="price">
                      Preis
                    </label>
                    <input
                      type="number"
                      className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Preis des Produktes"
                      id="price"
                      value={props.values.price}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.price && props.errors.price ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.price}</p>
                    </div>
                  ) : null}
                  <div className="m-4">
                    <label
                      className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="description">
                      Beschreibung
                    </label>
                    <textarea
                     
                      rows="5"
                      className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150   text-blue-900 " 
                      placeholder="Beschreibung des Produktes rows-5 "
                      id="description"
                      value={props.values.description}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.description && props.errors.description ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.description}</p>
                    </div>
                  ) : null}
                  <div className="m-4">
                    <label
                      className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="category">
                      Kategorie
                    </label>
                    <select
                      className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      id="category"
                      value={props.values.category}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}>
                      <option value="">Kategorie auswählen</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                      </select>
                    {props.touched.category && props.errors.category ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                        <p className="font-bold">Error</p>
                        <p>{props.errors.category}</p>
                      </div>
                    ) : null}

                    <input
                      type="submit"
                      className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 mt-4 w-full cursor-pointer hover:bg-blue-600 hover:text-lime-300"
                      value="Ändern"
                    />
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};
export default EditProduct;
