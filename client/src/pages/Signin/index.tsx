import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <header className="flex items-center justify-center h-screen">
      <SignIn
        redirectUrl={"/login"}
        signUpUrl="/sign-up"
        routing="path"
        path="/sign-in"
      />
    </header>
  );
}
