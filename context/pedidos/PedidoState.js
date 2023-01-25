import React, { useReducer } from "react";
import PedidoContext from "./PedidoContext";
import PedidoReducer from "./PedidoReducer";

import {
  SELECCIONAR_CLIENTE,
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTOS,
  ACTUALIZAR_TOTAL,
} from "../../types";

const PedidoState = ({ children }) => {
  // State de Pedidos
  const initialState = {
    client: {},
    products: [],
    total: 0,
  };

  const [state, dispatch] = useReducer(PedidoReducer, initialState);

  // Modifica el Cliente
  const addClient = (client) => {
    // console.log(client);

    dispatch({
      type: SELECCIONAR_CLIENTE,
      payload: client,
    });
  };

  // Modifica los productos
  const addProduct = (selectProducts) => {
    let newState;
    if (state.products.length > 0) {
      // Tomar del segundo arreglo, una copia para asignarlo al primero
      newState = selectProducts.map((product) => {
        const newObject = state.products.find(
          (productState) => productState.id === product.id
        );
        return { ...product, ...newObject };
      });
    } else {
      newState = selectProducts;
    }

    dispatch({
      type: SELECCIONAR_PRODUCTO,
      payload: newState,
    });
  };

  // Modifica las cantidades de los productos
  const quantityProducts = (newProduct) => {
    dispatch({
      type: CANTIDAD_PRODUCTOS,
      payload: newProduct,
    });
  };

  const updateTotal = () => {
    dispatch({
      type: ACTUALIZAR_TOTAL,
    });
  };

  return (
    <PedidoContext.Provider
      value={{
        client: state.client,
        products: state.products,
        total: state.total,
        addClient,
        addProduct,
        quantityProducts,
        updateTotal,
      }}>
      {children}
    </PedidoContext.Provider>
  );
};

export default PedidoState;
