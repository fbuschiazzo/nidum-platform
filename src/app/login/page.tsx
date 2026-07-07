import { LoginForm } from "@/components/login-form";
import { PageShell } from "@/components/ui";

export default function LoginPage() {
  return (
    <PageShell>
      <section className="login-page">
        <LoginForm />
      </section>
    </PageShell>
  );
}
