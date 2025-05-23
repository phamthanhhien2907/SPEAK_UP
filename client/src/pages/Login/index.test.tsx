import { render, screen, fireEvent, waitFor } from "@testing-library/react";
jest.mock("../../assets/admin/login.svg", () => "test-file-stub");
import "@testing-library/jest-dom";
import Login from "./index";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/use-dispatch";
import { apiLogin } from "@/services/auth.services";
import toast from "react-hot-toast";

// Mocks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("@/hooks/use-dispatch", () => ({
  useAppDispatch: jest.fn(),
}));
jest.mock("@/services/auth.services", () => ({
  apiLogin: jest.fn(),
}));
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));
const mockDispatch = jest.fn(() => Promise.resolve());
const mockNavigate = jest.fn();

beforeEach(() => {
  (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  jest.clearAllMocks();
});

const defaultProps = {
  onRegister: jest.fn(),
  onReset: jest.fn(),
  onTogglePassword: jest.fn(),
  onShowPassword: false,
  onClickTypeLogin: jest.fn(),
  isUser: true,
  isAdmin: false,
};

// ...existing code...

describe("Login Component", () => {
  it("renders user login form", () => {
    render(<Login {...defaultProps} />);
    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByAltText(/facebook/i)).toBeInTheDocument();
    expect(screen.getByAltText(/google/i)).toBeInTheDocument();
  });

  it("shows error toast if fields are empty", async () => {
    render(<Login {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please fill in all fields");
    });
  });

  it("calls apiLogin and dispatch on successful login", async () => {
    (apiLogin as jest.Mock).mockResolvedValue({
      data: { err: 1, success: true, msg: "ok" },
    });
    render(<Login {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com", name: "email" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "passwordA1!", name: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    await waitFor(() => {
      expect(apiLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "passwordA1!",
      });
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it("shows error toast if apiLogin returns err=0", async () => {
    (apiLogin as jest.Mock).mockResolvedValue({
      data: { err: 0, msg: "Invalid", success: false },
    });
    render(<Login {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com", name: "email" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "passwordA1!", name: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid");
    });
  });

  it("calls onClickTypeLogin with correct type", () => {
    render(<Login {...defaultProps} />);
    fireEvent.click(screen.getByAltText(/facebook/i));
    expect(defaultProps.onClickTypeLogin).toHaveBeenCalledWith("facebook");
    fireEvent.click(screen.getByAltText(/google/i));
    expect(defaultProps.onClickTypeLogin).toHaveBeenCalledWith("google");
  });

  it("calls onTogglePassword when icon is clicked", () => {
    render(<Login {...defaultProps} />);
    // Tìm phần tử có class 'icon' (span chứa svg)
    const iconSpan = screen.getByText("", { selector: "span.icon" });
    fireEvent.click(iconSpan);
    expect(defaultProps.onTogglePassword).toHaveBeenCalled();
  });

  it("calls onRegister and onReset", () => {
    render(<Login {...defaultProps} />);
    fireEvent.click(screen.getByText("Register"));
    expect(defaultProps.onRegister).toHaveBeenCalled();
    fireEvent.click(screen.getByText("Forgot password?"));
    expect(defaultProps.onReset).toHaveBeenCalled();
  });

  it("renders admin login form", () => {
    render(<Login {...{ ...defaultProps, isUser: false, isAdmin: true }} />);
    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });
});
