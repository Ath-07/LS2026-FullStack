import FoodCard from "./FoodCards";

function MenuGrid({ foods, addToCart }) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {foods.map((food) => (
        <FoodCard
          key={food.id}
          food={food}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
}

export default MenuGrid;