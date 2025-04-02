import { SignUp } from "@clerk/clerk-react";

export default function Login() {
  return (
    <header className="flex items-center justify-center h-screen">
      <SignUp
        redirectUrl={"/login"}
        signInUrl="/sign-in"
        routing="path"
        path="/sign-up"
      />
    </header>
  );
}
