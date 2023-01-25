import React, { useContext } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";
import ProductSummary from "../../components/bestellungen/ProductSummary";

const OrderSummary = () => {
  // TODO: #4 Adjust Product quantity to show the correct quantity
  const pedidoContext = useContext(PedidoContext);
  const { products } = pedidoContext;

  console.log(products);

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        3.- Productmengen anpassen
      </p>

      {products.length > 0 ? (
        <>
          {products.map((product) => (
            <ProductSummary key={product.id} product={product} />
          ))}
        </>
      ) : (
        <p className="mt-5 text-sm">Noch keine Produkte ausgewählt</p>
      )}
    </>
  );
};
export default OrderSummary;