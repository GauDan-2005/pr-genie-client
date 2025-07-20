import useUser from "@/api/useUser";
import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/NavUser";
import { ModeToggle } from "@/components/ThemeToggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { showToast } from "@/lib/toast";
import { setUser } from "@/store/userSlice";
import { User } from "@/utils/type";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.user) as User;

  const { getUser } = useUser();

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const getUserData = async () => {
    try {
      getUser((response, error) => {
        if (error || response === null) {
          showToast("error", "Failed fetching user data");
          return;
        }
        showToast("success", response.message);
        dispatch(setUser(response.user));
      });
    } catch (err) {
      showToast("error", "Failed to get repositories.");
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex py-2 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-4 px-4 w-full">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb className="hidden md:block">
              <BreadcrumbList>
                {pathSegments.map((segment, index) => (
                  <BreadcrumbItem key={index}>
                    {index === pathSegments.length - 1 ? (
                      <BreadcrumbPage className="capitalize">
                        {segment.replace("-", " ")}
                      </BreadcrumbPage>
                    ) : (
                      <>
                        <BreadcrumbLink className="capitalize">
                          <Link
                            to={`/${pathSegments
                              .slice(0, index + 1)
                              .join("/")}`}
                          >
                            {segment.replace("-", " ")}
                          </Link>
                        </BreadcrumbLink>
                        <BreadcrumbSeparator />
                      </>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center ml-auto gap-2">
              <ModeToggle />
              <NavUser user={user} />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
