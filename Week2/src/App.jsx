import { useState } from "react";
import MenuGrid from "./components/MenuGrid";
import CartSidebar from "./components/CartSidebar";
import foods from "./assets/foods";

function App() {
  const [cart, setCart] = useState([]);

  function addToCart(food) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  }

  function increaseQty(id) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decreaseQty(id) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold">Food Menu</h1>
      </header>
      <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 pb-12">
        <MenuGrid foods={foods} addToCart={addToCart} />
        <CartSidebar
          cart={cart}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
        />
      </main>
    </div>
  );
}

export default App;
