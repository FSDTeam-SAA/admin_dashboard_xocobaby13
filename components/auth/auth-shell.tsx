import { LogoMark } from "@/components/shared/logo-mark";
import { cn } from "@/lib/utils";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthShell({ title, subtitle, children, className }: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(115deg,#e8f3ff_0%,#f8fbff_38%,#d7e7f8_100%)] px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(22,139,211,0.06),transparent_45%)]" />
      <section className={cn("relative z-10 w-full max-w-[460px]", className)}>
        <div className="mb-12 flex justify-center">
          <LogoMark className="h-[220px] w-[220px] scale-90" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-[#168bd3]">{title}</h1>
        <p className="mt-2 text-lg text-[#314255]">{subtitle}</p>
        <div className="mt-8 space-y-5">{children}</div>
      </section>
    </main>
  );
}
