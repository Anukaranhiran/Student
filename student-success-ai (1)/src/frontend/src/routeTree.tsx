import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Generate from "./pages/Generate";
import History from "./pages/History";
import Home from "./pages/Home";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const generateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/generate",
  component: Generate,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: History,
});

export const routeTree = rootRoute.addChildren([
  homeRoute,
  generateRoute,
  historyRoute,
]);
