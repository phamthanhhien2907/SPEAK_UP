import loginImg from "@/assets/admin/login.svg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import facebook from "@/assets/admin/facebook.png";
import google from "@/assets/admin/google.png";
import icon_auth from "@/assets/user/icon-auth.jpeg";
import { apiLogin } from "@/services/auth.services";
import { ChangeEvent, FormEvent, useState } from "react";
import { authActionProps, loginAction } from "@/stores/actions/authAction";
import { useAppDispatch } from "@/hooks/use-dispatch";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
type loginProps = {
  onRegister?: () => void;
  onReset?: () => void;
  onTogglePassword?: () => void;
  onShowPassword?: boolean;
  onClickTypeLogin: (type: string) => void;
  isAdmin?: boolean;
  isUser?: boolean;
};
const Login = ({
  onRegister,
  onReset,
  onTogglePassword,
  onShowPassword,
  onClickTypeLogin,
  isAdmin,
  isUser,
}: loginProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState<authActionProps>({
    email: "",
    password: "",
  });
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!input.email || !input.password) {
        toast.error("Please fill in all fields");
        return;
      }
      setLoading(true);
      const response = await apiLogin(input);
      console.log(response);
      if (response.data.err === 0) {
        toast.error(response.data.msg);
      }
      if (response?.data?.success) {
        dispatch(loginAction(input))
          .then(() => {
            toast.success("Login successful!");
            navigate("/");
          })
          .catch(() => {
            toast.error("Login failed. Please try again.");
            setInput({ email: "", password: "" });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      {isUser ? (
        <div>
          <div className="main-container --flex-center">
            <div className="img-container-auth flex items-center justify-center ">
              <img
                src={icon_auth}
                alt="login"
                className="w-[70%] h-[90%] object-cover mx-auto -rotate-6 rounded-3xl"
              />
            </div>
            <div className="form-container">
              <form onSubmit={handleSubmit} className="--form-control">
                <h2 className="--color-dark --text-center font-bold">Login</h2>
                <span className="font-normal text-gray-500/80 text-[18px] flex items-center justify-center">
                  Welcome to Speak-Up!
                </span>
                <input
                  onChange={handleInput}
                  name="email"
                  type="text"
                  className="--width-100"
                  placeholder="Email"
                />
                <div className="password">
                  <input
                    type={onShowPassword ? "text" : "password"}
                    name="password"
                    className="--width-100"
                    placeholder="Password"
                    onChange={handleInput}
                  />
                  <span className="icon" onClick={onTogglePassword}>
                    {onShowPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </span>
                </div>
                <button className="--btn --btn-dark hover:bg-black/90 hover:text-gray-300/90 --btn-block">
                  Login
                </button>
                <a className="--text-sm" onClick={onReset}>
                  Forgot password?
                </a>
                <span className="--text-sm --block">
                  Don't have an account?
                  <a className="--text-sm" onClick={onRegister}>
                    Register
                  </a>
                </span>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <img
                    className="h-14 w-14 object-cover cursor-pointer"
                    src={facebook}
                    alt="facebook"
                    onClick={() => onClickTypeLogin("facebook")}
                  />
                  <img
                    className="h-14 w-14 object-cover cursor-pointer"
                    src={google}
                    alt="google"
                    onClick={() => onClickTypeLogin("google")}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : isAdmin ? (
        <div className="main-container --flex-center">
          <div className="img-container">
            <img src={loginImg} alt="login" />
          </div>
          <div className="form-container">
            <form onSubmit={handleSubmit} className="--form-control">
              <h2 className="--color-danger --text-center font-semibold">
                Login
              </h2>
              <input
                onChange={handleInput}
                name="email"
                type="text"
                className="--width-100"
                placeholder="Email"
              />
              <div className="password">
                <input
                  type={onShowPassword ? "text" : "password"}
                  name="password"
                  className="--width-100"
                  placeholder="Password"
                  onChange={handleInput}
                />
                <span className="icon" onClick={onTogglePassword}>
                  {onShowPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </span>
              </div>
              <button className="--btn --btn-primary --btn-block">Login</button>
              <a className="--text-sm" onClick={onReset}>
                Forgot password?
              </a>
              <span className="--text-sm --block">
                Don't have an account?{" "}
                <a className="--text-sm" onClick={onRegister}>
                  Register
                </a>
              </span>
              <div className="flex items-center justify-center gap-4 pt-4">
                <img
                  className="h-14 w-14 object-cover cursor-pointer"
                  src={facebook}
                  alt="facebook"
                  onClick={() => onClickTypeLogin("facebook")}
                />
                <img
                  className="h-14 w-14 object-cover cursor-pointer"
                  src={google}
                  alt="google"
                  onClick={() => onClickTypeLogin("google")}
                />
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Login;
