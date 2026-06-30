function FoodCard({ food, addToCart }) {
  return (
    <div className="bg-white text-black rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
      <img
        src={food.image}
        alt={food.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="font-bold text-lg">
          {food.name}
        </h3>

        <p className="text-orange-500 font-semibold mt-2">
          ₹{food.price}
        </p>

        <button
          onClick={() => addToCart(food)}
          className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default FoodCard;