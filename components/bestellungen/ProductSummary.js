import React, { useContext, useState, useEffect } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";

const ProductSummary = ({product}) => {
  // Get the state of the orders
  const pedidoContext = useContext(PedidoContext);
  const { quantityProducts, updateTotal } = pedidoContext;

  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
      //setQuantity(products[0].quantity);
    // TODO: #3 Update the total when the quantity changes
    updateQuantity();
    updateTotal();
  }, [quantity]);

  const updateQuantity = () => {
    const newproduct = { ...product, quantity: Number(quantity) };
    quantityProducts(newproduct);
  };

  const { name, price } = product;

  return (
    <div className="md:flex md:justify-between md:items-center mt-5">
      <div className="mt-4 md:mt-0">
        <p className="text-sm"> {name}</p>
        <p className="text-lg font-semibold">{price}€</p>
      </div>
      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          setQuantity(e.target.value);
        }}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4 md:mt-0"
        placeholder="Anzahl"
      />
    </div>
  );
};

export default ProductSummary;
