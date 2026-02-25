import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/login");
  }

  return (
    <DashboardShell
      name={session.user?.name || "Demo Name"}
      email={session.user?.email || "example@gmail.com"}
      avatar={undefined}
    >
      {children}
    </DashboardShell>
  );
}
