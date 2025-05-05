import { useState } from "react";
import "./index.css";
import Login from "../Login";
import Register from "../Register";
import Reset from "../Reset";

const Auth = () => {
  const isAdminPath = location.pathname.startsWith("/admin");
  const isUserPath = location.pathname.startsWith("/auth");
  const [auth, setAuth] = useState({
    login: true,
    register: false,
    reset: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    setAuth({ reset: false, register: false, login: true });
  };

  const handleRegister = () => {
    setAuth({ ...auth, login: false, register: true });
  };

  const handleReset = () => {
    setAuth({ ...auth, login: false, reset: true });
  };
  const handleClickTypeLogin = (type: string) => {
    window.open(`http://localhost:8080/api/auth/${type}`, "_self");
  };
  return (
    <section className="--flex-center --100vh bg-white">
      <div className="container box">
        {auth.login && (
          <Login
            isAdmin={isAdminPath}
            isUser={isUserPath}
            onRegister={handleRegister}
            onReset={handleReset}
            onShowPassword={showPassword}
            onTogglePassword={handleTogglePassword}
            onClickTypeLogin={handleClickTypeLogin}
          />
        )}
        {auth.register && (
          <Register
            isAdmin={isAdminPath}
            isUser={isUserPath}
            onLogin={handleLogin}
            onShowPassword={showPassword}
            onTogglePassword={handleTogglePassword}
            onClickTypeLogin={handleClickTypeLogin}
          />
        )}
        {auth.reset && <Reset onLogin={handleLogin} />}
      </div>
    </section>
  );
};

export default Auth;
