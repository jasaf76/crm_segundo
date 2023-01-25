import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";

const UPDATE_ORDER = gql`
  mutation updateOrder($id: ID!, $input: OrderInput) {
    updateOrder(id: $id, input: $input) {
      status
    
    }
  }
`;

const DELETE_ORDER = gql`
  mutation deleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`;

const GET_ORDERS = gql`
  query getOrdersBySeller {
    getOrdersBySeller {
      id
  }
  }
`;

const Order = ({ order }) => {
  const {
    id,
    total,
    client: { name, nachname, email, phone },
    client,
    status,
  } = order;
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const [deleteOrder] = useMutation(DELETE_ORDER, {
    update(cache) {
      const { getOrdersBySeller } = cache.readQuery({ query: GET_ORDERS });
      cache.writeQuery({
        query: GET_ORDERS,
        data: {
          getOrdersBySeller: getOrdersBySeller.filter(
            (order) => order.id !== id
          ),
        },
      });
    },
  });
  console.log(order);

  const [statusOrder, setStatusOrder] = useState(status);
  const [classe, setClasse] = useState("");

  useEffect(() => {
    if (statusOrder) {
      setStatusOrder(statusOrder);
    }
    classeOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusOrder]);

  const classeOrder = () => {
    switch (statusOrder) {
      case "PENDING":
        setClasse("bg-warning text-dark");
        break;
      case "COMPLETED":
        setClasse("bg-success text-white");
        break;
      case "CANCELLED":
        setClasse("bg-danger text-blue");
        break;
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const { data } = await updateOrder({
        variables: {
          id,
          input: {
            status: newStatus,
            client: client.id,
          },
        },
      });
      setStatusOrder(data.updateOrder.status);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrderHandler = async () => {
    Swal.fire({
      title: "bist du sicher?",
      text: "Sie können diese Aktion nicht rückgängig machen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ja, löschen!",
      cancelButtonText: "Nein, abbrechen",
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: false,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.value) {
        try {
          const { data } = await deleteOrder({
            variables: {
              id,
            },
          });
          Swal.fire("Gelöscht!", data.deleteOrder.message, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <div
      className={`${classe} border-t-4 mt-4 bg-white rounded p-6 md:grid-cols-2 md:gap-4 shadow-lg`}>
      <div>
        <p className="font-bold text-gray-800">
          Kunde: {name} {nachname}
        </p>
        {email && (
          <p className="flex items-center my-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7l4 4m0 0l4-4m-4 4v10m6-10l4 4m0 0l4-4m-4 4v10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            {email}
          </p>
        )}


           {phone && (
          <p className="flex items-center my-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 3h.01M12 14l9-5-9-5-9 5 9 5z"></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-4-4"></path>
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            {phone}
          </p>
        )}
        <h2 className="text-gray-800 font-bold mt-10">Bestellstatus:</h2>
        <select
          className="mt-2 appereance-none bg-blue-600 border border-gray-200 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-gray-500 uppercase text-xs font-bold"
          value={statusOrder}
          onChange={(e) => updateStatus(e.target.value)}>
          <option value="COMPLETED">COMPLETED</option>
          <option value="PENDING">PENDING</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>
      <div>
        <h2 className="text-gray-800 font-bold mt-2">Bestellsumme:</h2>
        {order.order.map((product) => (
          <div key={product.id} className="mt-4">
            <p className="text-sm text-gray-600">Produkt: {product.name}</p>
            <p className="text-sm text-gray-600">Menge: {product.quantity}</p>
          </div>
        ))}
        <p className="text-gray-800 mt-3 font-bold">Gesamtbetrag: {total} €</p>
        <button
          className="bg-red-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-red-900"
          onClick={() => deleteOrderHandler()}>
          Bestellung löschen
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 ml-2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"></path>
            <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Order;
