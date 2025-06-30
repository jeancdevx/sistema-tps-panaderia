import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { BarChart3, Home, Package, Tag, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userRole = user.publicMetadata?.role as string;

  // Solo el admin puede acceder
  /* if (userRole !== "ADMIN") {
    redirect("/sin-acceso");
  } */

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: Home,
    },
    {
      name: "Productos",
      href: "/admin/productos",
      icon: Package,
    },
    {
      name: "Categorías",
      href: "/admin/categorias",
      icon: Tag,
    },
    {
      name: "Empleados",
      href: "/admin/empleados",
      icon: Users,
    },
    {
      name: "Reportes",
      href: "/admin/reportes",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Panel de Administración
            </h2>
            <p className="text-sm text-gray-600 mt-1">La Pastineria</p>
          </div>

          <nav className="px-4 pb-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left"
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
