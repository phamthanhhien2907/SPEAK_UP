import { Route, Routes, useNavigate } from "react-router-dom";
import routes from "./pages/routes";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { Toaster } from "react-hot-toast";
import { getCurrent } from "./stores/actions/userAction";
import { AppDispatch } from "./main";
import { setNavigate } from "./lib/navigate";

function App() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  // const { status, userData } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent());
      else navigate("/auth");
    }, 500);
    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [dispatch, isLoggedIn, navigate]);
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  // if (status === "loading") {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
  //     </div>
  //   );
  // }
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
