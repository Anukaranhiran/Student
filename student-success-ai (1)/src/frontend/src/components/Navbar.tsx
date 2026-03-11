import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { BrainCircuit, LogIn, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/generate", label: "Generate" },
    { to: "/history", label: "History" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center ring-1 ring-primary/30 group-hover:bg-primary/30 transition-colors">
            <BrainCircuit className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Student<span className="text-primary">Success</span> AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={`nav.${link.label.toLowerCase()}.link`}
              className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors [&.active]:text-foreground [&.active]:bg-accent/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              data-ocid="nav.logout.button"
              className="border-border/50 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="nav.login.button"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoggingIn ? "Connecting..." : "Login"}
            </Button>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-ocid="nav.mobile.toggle"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  data-ocid={`nav.mobile.${link.label.toLowerCase()}.link`}
                  className="px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors [&.active]:text-foreground [&.active]:bg-accent/50"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border/50">
                {isLoggedIn ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clear();
                      setMobileOpen(false);
                    }}
                    className="w-full"
                    data-ocid="nav.mobile.logout.button"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    disabled={isLoggingIn}
                    className="w-full bg-primary text-primary-foreground"
                    data-ocid="nav.mobile.login.button"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {isLoggingIn ? "Connecting..." : "Login"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
