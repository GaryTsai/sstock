import './App.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import { useRoutes } from "react-router-dom";
import routes from "./routes";

const App = () => {
  const pages = useRoutes(routes);
  return pages;
}

export default App