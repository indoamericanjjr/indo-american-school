import { Link, useLocation } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const BreadcrumbNav = () => {
  const location = useLocation();

  // Define route labels
  const routeLabels: { [key: string]: string } = {
    "/": "Home",
    "/about": "About Us",
    "/academics": "Academics",
    "/facilities": "Facilities",
    "/admissions": "Admissions",
    "/gallery": "Gallery",
    "/events": "Events",
    "/contact": "Contact",
    "/teacher-applications": "Teacher Applications",
    "/documents": "Documents",
    "/privacy": "Privacy Policy",
    "/terms": "Terms of Service",
    "/admin": "Admin",
  };

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ name: "Home", path: "/" }];

  let currentPath = "";
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
    breadcrumbs.push({ name: label, path: currentPath });
  });

  return (
    <div className="bg-gradient-to-r from-card to-muted/50 py-4 px-4 md:px-6 border-b border-border/50 shadow-sm">
      <div className="container-custom">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center gap-2 md:gap-3">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center">
                {index > 0 && (
                  <BreadcrumbSeparator className="text-muted-foreground/60">
                    <ChevronRight size={16} />
                  </BreadcrumbSeparator>
                )}
                <BreadcrumbItem className="flex items-center">
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="font-semibold text-foreground px-3 py-1.5 bg-primary/10 rounded-md border border-primary/20">
                      {crumb.name}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        to={crumb.path}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-accent hover:text-primary transition-all duration-200 group"
                      >
                        {index === 0 && (
                          <Home size={16} className="text-primary group-hover:scale-110 transition-transform" />
                        )}
                        <span className="font-medium">{crumb.name}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default BreadcrumbNav;

