import axios from "axios";
import { useEffect, useState } from "react";
import { useCart } from "../store/cart";
import ProductModal from "./ProductModal";

function Products() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const add = useCart((state) => state.add);
  const decrease = useCart((state) => state.decrease);
  const items = useCart((state) => state.items);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;

  const [selectedProduct, setSelectedProduct] = useState(null);

  // Загрузка категорий
  useEffect(() => {
    axios
      .get("https://dummyjson.com/products/categories")
      .then((res) => setCategories(res.data))
      .catch((error) => console.error("Ошибка категорий:", error));
  }, []);

  // Загрузка товаров
  useEffect(() => {
    setLoading(true);

    const url = selectedCategory
      ? `https://dummyjson.com/products/category/${selectedCategory}?limit=${itemsPerPage}&skip=${skip}`
      : `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${skip}`;

    axios
      .get(url)
      .then((res) => {
        setProducts(res.data.products);
        setTotalProducts(res.data.total);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedCategory, currentPage]);

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className="products">
      <h1 className="products__title">🛍️ Товары</h1>

      {/* Меню категорий */}
      <div className="categories">
        <button
          onClick={() => handleCategoryChange(null)}
          className="categories__btn"
        >
          Все товары
        </button>
        {categories.map((category, index) => (
          <button
            key={category.slug || index}
            onClick={() => handleCategoryChange(category.slug || category)}
            className="categories__btn"
          >
            {category.name || category}
          </button>
        ))}
      </div>

      {/* Сетка товаров */}
      <div className="products__grid">
        {products.map((product) => {
          const inCart = items.find((item) => item.id === product.id);

          return (
            <div
              key={product.id}
              className="product-card"
              onClick={() => setSelectedProduct(product)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="product-card__image"
              />
              <h3 className="product-card__title">{product.title}</h3>
              <p className="product-card__price">${product.price}</p>
              <p className="product-card__desc">{product.description}</p>

              {/* Управление количеством */}
              {inCart ? (
                <div className="product-card__controls">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      decrease(product.id);
                    }}
                  >
                    -
                  </button>
                  <span>{inCart.quantity}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      add(product);
                    }}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    add(product);
                  }}
                  className="product-card__btn"
                >
                  В корзину
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Модалка товара */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Пагинация */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="pagination__btn"
        >
          Назад
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`pagination__btn ${
              currentPage === page ? "pagination__btn--active" : ""
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination__btn"
        >
          Вперёд
        </button>
      </div>
    </div>
  );
}

export default Products;
