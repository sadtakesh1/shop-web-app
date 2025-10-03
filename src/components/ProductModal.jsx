import { useCart } from "../store/cart";
function ProductModal({ product, onClose }) {
  const add = useCart((state) => state.add);
  if (!product) return null;

  return (
    <div className="modal">
      <div className="modal__overlay" onClick={onClose}></div>
      <div className="modal__content">
        <button className="modal__close" onClick={onClose}>
          ✖
        </button>
        <img
          src={product.thumbnail}
          alt={product.title}
          className="modal__image"
        />
        <h2 className="modal__title">{product.title}</h2>
        <p className="modal__price">${product.price}</p>
        <p className="modal__desc">{product.description}</p>
        <button
          className="modal__btn"
          onClick={() => {
            add(product);
            onClose(); // закрыть после добавления
          }}
        >
          🛒 В корзину
        </button>
      </div>
    </div>
  );
}

export default ProductModal;
