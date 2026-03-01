import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data));
  }, []);

  const handleAsk = async () => {
    const res = await axios.post("http://localhost:5000/api/ask", { query });
    setSummary(res.data.summary);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Product Discovery</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask something..."
      />
      <button onClick={handleAsk}>Ask</button>

      <p>{summary}</p>

      {products.map(p => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
        </div>
      ))}
    </div>
  );
}

export default App;