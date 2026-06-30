function CartSidebar({
  cart,
  increaseQty,
  decreaseQty,
}) {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <h2 className="text-2xl font-bold mb-4 text-black">
        Cart ({totalItems})
      </h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">
          Cart is empty
        </p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="mb-4 border-b pb-3"
            >
              <div className="flex justify-between text-black">
                <span>
                  {item.name} x{item.quantity}
                </span>

                <span>
                  ₹
                  {item.price *
                    item.quantity}
                </span>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() =>
                    decreaseQty(item.id)
                  }
                  className="bg-red-500 text-white px-2 rounded"
                >
                  -
                </button>

                <button
                  onClick={() =>
                    increaseQty(item.id)
                  }
                  className="bg-green-500 text-white px-2 rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6">
            <h3 className="font-bold text-xl text-black">
              Total: ₹{totalPrice}
            </h3>

            <button className="mt-4 w-full bg-black text-white py-3 rounded-lg">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartSidebar;