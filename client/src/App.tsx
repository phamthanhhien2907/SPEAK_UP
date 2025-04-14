import { Route, Routes } from "react-router-dom";
import routes from "./pages/routes";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";

function App() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  console.log(isLoggedIn);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Suspense>
  );
}

export default App;
