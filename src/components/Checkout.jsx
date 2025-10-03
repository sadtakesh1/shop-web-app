import { useState } from "react";
import { useCart } from "../store/cart";
import axios from "axios";

function Checkout() {
  const items = useCart((state) => state.items);
  const clearCart = useCart.setState;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("https://dummyjson.com/carts/add", {
        userId: 1,
        products: items.map((item) => ({ id: item.id, quantity: 1 })),
        customer: formData,
      });

      setSuccess(true);
      clearCart({ items: [] });
    } catch (err) {
      setError("Ошибка при оформлении заказа. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-success">
        <h1>🎉 Спасибо за заказ!</h1>
        <p>Мы свяжемся с вами в ближайшее время.</p>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h1 className="checkout__title">Оформление заказа</h1>

      {items.length === 0 ? (
        <p className="checkout__empty">Корзина пуста</p>
      ) : (
        <form onSubmit={handleSubmit} className="checkout__form">
          <div className="checkout__field">
            <label>Имя</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="checkout__field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="checkout__field">
            <label>Телефон</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="checkout__field">
            <label>Адрес доставки</label>
            <textarea
              name="address"
              required
              rows={3}
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {error && <p className="checkout__error">{error}</p>}

          <button type="submit" disabled={loading} className="checkout__btn">
            {loading ? "Отправка..." : `Оформить заказ на $${totalPrice}`}
          </button>
        </form>
      )}
    </div>
  );
}

export default Checkout;
