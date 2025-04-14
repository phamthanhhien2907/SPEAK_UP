import loginImg from "../../assets/login.svg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import facebook from "../../assets/facebook.png";
import google from "../../assets/google.png";
type loginProps = {
  onRegister?: () => void;
  onReset?: () => void;
  onTogglePassword?: () => void;
  onShowPassword?: boolean;
  onClickTypeLogin: (type: string) => void;
};
const Login = ({
  onRegister,
  onReset,
  onTogglePassword,
  onShowPassword,
  onClickTypeLogin,
}: loginProps) => {
  return (
    <div className="main-container --flex-center">
      <div className="img-container">
        <img src={loginImg} alt="login" />
      </div>
      <div className="form-container">
        <form className="--form-control">
          <h2 className="--color-danger --text-center font-semibold">Login</h2>
          <input type="text" className="--width-100" placeholder="Username" />
          <div className="password">
            <input
              type={onShowPassword ? "text" : "password"}
              className="--width-100"
              placeholder="Password"
            />
            <span className="icon" onClick={onTogglePassword}>
              {onShowPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          <button className="--btn --btn-primary --btn-block">Login</button>
          <a href="#" className="--text-sm" onClick={onReset}>
            Forgot password?
          </a>
          <span className="--text-sm --block">
            Don't have an account?{" "}
            <a href="#" className="--text-sm" onClick={onRegister}>
              Register
            </a>
          </span>
          <div className="flex items-center justify-center gap-2 mt-4">
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
  );
};

export default Login;
