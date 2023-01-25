import {
  SELECCIONAR_CLIENTE,
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTOS,
  ACTUALIZAR_TOTAL,
} from "../../types";

export default (state, action) => {
  switch (action.type) {
    case SELECCIONAR_CLIENTE:
      return {
        ...state,
        client: action.payload,
      };
    case SELECCIONAR_PRODUCTO:
      return {
        ...state,
        products: action.payload,
      };
    case CANTIDAD_PRODUCTOS:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? (product = action.payload)
            : product
        ),
      };
    case ACTUALIZAR_TOTAL:
      return {
        ...state,
        total: state.products.reduce(
          (newTotal, element) => (newTotal += element.price * element.quantity),
          0
        ),
      };

    default:
      return state;
  }
};
