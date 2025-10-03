import { Link } from "react-router-dom";
import { useCart } from "../store/cart";

function Cart() {
  const items = useCart((state) => state.items);
  const add = useCart((state) => state.add);
  const decrease = useCart((state) => state.decrease);
  const remove = useCart((state) => state.remove);

  const totalPrice = items
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div>
      <h1>Корзина ({items.length})</h1>

      {items.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <div>
          <div>
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.thumbnail} alt={item.title} width="60" />
                <div>
                  <h3>{item.title}</h3>
                  <p>${item.price}</p>
                </div>

                {/* Количество */}
                <div className="cart-item__controls">
                  <button onClick={() => decrease(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => add(item)}>+</button>
                </div>

                <button onClick={() => remove(item.id)}>Удалить</button>
              </div>
            ))}
          </div>

          <div>
            <h2>Общая сумма: ${totalPrice}</h2>
          </div>

          <div className="cart__checkout">
            <Link to="/checkout" className="cart__checkout-btn">
              Оформить заказ
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
