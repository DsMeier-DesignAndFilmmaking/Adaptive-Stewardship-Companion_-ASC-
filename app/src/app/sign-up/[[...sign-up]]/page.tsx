import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-full items-center justify-center p-8">
      <SignUp />
    </main>
  );
}
