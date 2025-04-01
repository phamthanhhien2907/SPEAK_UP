import { Route, Routes } from "react-router-dom";
import routes from "./pages/routes";
import { Suspense } from "react";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route
          path="*"
          element={<div className="bg-red-500">404 Not Found</div>}
        />
      </Routes>
    </Suspense>
  );
}

export default App;
