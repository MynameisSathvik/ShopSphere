import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

const PRODUCT = {
  id: 1,
  name: "Wireless Headphones",
  category: "Electronics",
  price: 2999,
  rating: 4.8,
  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  description: "Premium wireless headphones with clear sound"
};

function Header({ cart }) {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">✦ ◈ ShopSphere</Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/cart">
          🛒 Cart
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </Link>
      </div>
    </nav>
  );
}

function Home({ addToCart }) {
  const navigate = useNavigate();

  return (
    <main>
      <section className="hero">
        <div>
          <span className="eyebrow">CURATED FOR YOU</span>
          <h1>Trending Products</h1>
          <p>Premium products. Better prices. Delivered to your doorstep.</p>
        </div>

        <button onClick={() => navigate("/products")} className="view-btn">
          View All →
        </button>
      </section>

      <section className="product-section">
        <ProductCard product={PRODUCT} addToCart={addToCart} />
      </section>
    </main>
  );
}

function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <div className="product-info">
        <div className="category">{product.category}</div>

        <div className="rating">
          ★★★★★ <span>{product.rating}</span>
        </div>

        <h2>{product.name}</h2>
        <p>{product.description}</p>

        <div className="product-bottom">
          <strong>₹{product.price.toLocaleString()}</strong>

          <button onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function Products({ addToCart }) {
  return (
    <main className="page">
      <span className="eyebrow">OUR COLLECTION</span>
      <h1>All Products</h1>

      <ProductCard product={PRODUCT} addToCart={addToCart} />
    </main>
  );
}

function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (cart.length === 0) {
    return (
      <main className="empty-cart">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/products" className="dark-btn">Shop Products</Link>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>Your Cart</h1>

      {cart.map(item => (
        <div className="cart-item" key={item.id}>
          <img src={item.image} alt={item.name} />

          <div className="cart-details">
            <h2>{item.name}</h2>
            <p>{item.category}</p>
            <strong>₹{item.price.toLocaleString()}</strong>
          </div>

          <div>
            <span>Qty: 1</span>
            <button
              className="remove-btn"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="summary">
        <h2>Order Summary</h2>
        <div><span>Subtotal</span><strong>₹{total.toLocaleString()}</strong></div>
        <div><span>Delivery</span><strong>FREE</strong></div>
        <hr />
        <div className="total"><span>Total</span><strong>₹{total.toLocaleString()}</strong></div>

        <button
          className="checkout-btn"
          onClick={() => {
            if (localStorage.getItem("loggedIn") === "true") {
              navigate("/checkout");
            } else {
              navigate("/login?redirect=checkout");
            }
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </main>
  );
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    localStorage.setItem("loggedIn", "true");

    const params = new URLSearchParams(window.location.search);

    if (params.get("redirect") === "checkout") {
      navigate("/checkout");
    } else {
      navigate("/");
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={login}>
        <div className="auth-icon">✨</div>
        <h1>Welcome Back</h1>
        <p>Login to your ShopSphere account.</p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </main>
  );
}

function Register() {
  const navigate = useNavigate();

  const register = (e) => {
    e.preventDefault();
    localStorage.setItem("loggedIn", "true");
    navigate("/");
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={register}>
        <div className="auth-icon">✨</div>
        <h1>Create Account</h1>
        <p>Join the ShopSphere community.</p>

        <input placeholder="Full name" required />
        <input type="email" placeholder="Email address" required />
        <input type="password" placeholder="Password" required />

        <button type="submit">Create Account</button>
      </form>
    </main>
  );
}

function Checkout() {
  const navigate = useNavigate();

  const loggedIn = localStorage.getItem("loggedIn") === "true";

  if (!loggedIn) {
    navigate("/login?redirect=checkout");
    return null;
  }

  return (
    <main className="checkout-page">
      <div className="checkout-card">
        <div className="checkout-icon">✓</div>

        <h1>Checkout</h1>
        <p>Complete your details to place your order.</p>

        <div className="checkout-section">
          <h3>Delivery Address</h3>

          <input placeholder="Full Name" required />
          <input placeholder="Phone Number" required />
          <input placeholder="Address" required />

          <div className="checkout-row">
            <input placeholder="City" required />
            <input placeholder="Pincode" required />
          </div>
        </div>

        <div className="checkout-section">
          <h3>Payment Method</h3>

          <label className="payment-option">
            <input type="radio" name="payment" defaultChecked />
            Cash on Delivery
          </label>

          <label className="payment-option">
            <input type="radio" name="payment" />
            UPI / Card
          </label>
        </div>

        <button
          className="place-order"
          onClick={() => alert("🎉 Order placed successfully!")}
        >
          Place Order
        </button>
      </div>
    </main>
  );
}

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    if (!cart.find(item => item.id === product.id)) {
      setCart([...cart, product]);
    }
  };

  return (
    <BrowserRouter>
      <Header cart={cart} />

      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/products" element={<Products addToCart={addToCart} />} />
        <Route
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
