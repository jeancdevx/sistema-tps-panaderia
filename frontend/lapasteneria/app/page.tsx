import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Obtener el rol del usuario desde los metadatos públicos de Clerk
  const userRole = user.publicMetadata?.role as string;

  /* // Redirigir según el rol
  switch (userRole) {
    case "VENDEDOR":
      redirect("/vendedor");
    case "CAJERO":
      redirect("/cajero");
    case "ADMIN":
      redirect("/admin");
    default:
      // Si no tiene rol asignado, redirigir a una página de error o configuración
      redirect("/sin-acceso");
  } */
}
