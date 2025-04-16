import { Route, Routes } from "react-router-dom";
import routes from "./pages/routes";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { Toaster } from "react-hot-toast";
function App() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  console.log(document.cookie);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
            fontSize: "0.9rem",
          },
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
      />
    </Suspense>
  );
}

export default App;
