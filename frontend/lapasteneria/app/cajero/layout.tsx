import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CajeroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userRole = user.publicMetadata?.role as string;

  // Verificar que el usuario tenga permisos de cajero o admin
  /* if (userRole !== "CAJERO" && userRole !== "ADMIN") {
    redirect("/sin-acceso");
  } */

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
