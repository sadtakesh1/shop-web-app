import { Link } from "react-router-dom";
import { useCart } from "../store/cart";
import treeIcon from "../assets/tree-0.png";

function Header() {
  const itemCount = useCart((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <header className="header">
      {/* Логотип */}
      <Link to="/" className="logo">
        <img src={treeIcon} alt="Logo" className="logo__img" />
        <span className="logo__text">Shop98</span>
      </Link>

      {/* Кнопка корзины */}
      <Link to="/cart" className="cart-btn">
        Корзина
        {itemCount > 0 && (
          <span className="cart-btn__count">({itemCount})</span>
        )}
      </Link>
    </header>
  );
}

export default Header;
