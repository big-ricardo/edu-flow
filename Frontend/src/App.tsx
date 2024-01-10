import useAuth from "./hooks/useAuth";
import { publicRoutes, privateRoutes } from "./routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import api from "./services/api";

function App() {
  const [auth, setAuth] = useAuth();

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        window.location.href = "/";
        setAuth(null);
      }
      return Promise.reject(error);
    }
  );

  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {auth &&
          privateRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element}>
              {route.children?.map((child) => (
                <Route
                  key={child.path}
                  path={child.path}
                  element={child.element}
                  index={child.index}
                />
              ))}
            </Route>
          ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
