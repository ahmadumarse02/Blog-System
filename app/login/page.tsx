"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Clear any error state on mount to prevent stale errors
    setError("");
    
    // Check if already logged in and redirect
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "GET",
          credentials: "include"
        });
        if (response.ok) {
          console.log("User already authenticated, redirecting to dashboard");
          router.push("/dashboard");
        }
      } catch (error) {
        // Ignore auth check errors in development
        console.log("Auth check failed (normal if not logged in):", error);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log("Attempting login for email:", email);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in request
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful, redirecting to dashboard");
        setLoginSuccess(true);
        toast.success("Welcome back! Redirecting to dashboard...");
        
        // Try multiple redirect approaches for better compatibility
        try {
          // First try immediate redirect
          router.push("/dashboard");
          
          // Fallback: use window.location if available
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              if (window.location.pathname === '/login') {
                console.log("Router redirect failed, using window.location");
                window.location.href = "/dashboard";
              }
            }, 1000);
          }
        } catch (redirectError) {
          console.error("Redirect failed:", redirectError);
          // Final fallback: use window.location immediately
          if (typeof window !== 'undefined') {
            window.location.href = "/dashboard";
          }
        }
      } else {
        console.log("Login failed:", data.error);
        setError(data.error || "Login failed");
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hrms-blue-50 via-white to-hrms-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-hrms-blue-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-hrms-emerald-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-hrms-violet-200/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo and Branding */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-hrms-blue-600 to-hrms-blue-700 flex items-center justify-center mb-6 shadow-lg shadow-hrms-blue-600/25 animate-bounce-gentle">
            <Building2 className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-hrms-slate-900 mb-3 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
            HRMS Enterprise
          </h1>
          <p className="text-hrms-slate-600 text-lg animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
            Sign in to your account to continue
          </p>
        </div>

        <Card className="floating-card shadow-2xl border-0 animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the HR system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-hrms-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-hrms-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-hrms-blue-600 to-hrms-blue-700 hover:from-hrms-blue-700 hover:to-hrms-blue-800 text-white shadow-lg shadow-hrms-blue-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-hrms-blue-600/30 disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>

              {loginSuccess && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 mb-2">Login successful! If you're not redirected automatically:</p>
                  <Button
                    onClick={() => {
                      console.log("Manual navigation to dashboard");
                      if (typeof window !== 'undefined') {
                        window.location.href = "/dashboard";
                      } else {
                        router.push("/dashboard");
                      }
                    }}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Go to Dashboard →
                  </Button>
                </div>
              )}
            </form>

            {/* Demo Credentials Info */}
            <div className="mt-6 p-5 bg-gradient-to-r from-hrms-slate-50 to-hrms-blue-50/50 rounded-xl border border-hrms-slate-200/50">
              <h4 className="text-sm font-semibold text-hrms-slate-900 mb-3 flex items-center">
                <div className="w-2 h-2 bg-hrms-blue-500 rounded-full mr-2 animate-pulse-glow"></div>
                Demo Credentials
              </h4>
              <div className="space-y-2 text-xs text-hrms-slate-700">
                <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                  <span><strong>Admin:</strong> admin@company.com</span>
                  <code className="bg-hrms-slate-200 px-2 py-1 rounded text-xs">admin123</code>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                  <span><strong>HR Manager:</strong> hr@company.com</span>
                  <code className="bg-hrms-slate-200 px-2 py-1 rounded text-xs">hr123</code>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                  <span><strong>Employee:</strong> employee@company.com</span>
                  <code className="bg-hrms-slate-200 px-2 py-1 rounded text-xs">emp123</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-hrms-slate-500">
          <p>Secure access to your HR management system</p>
          <p className="mt-1">© 2025 HRMS Enterprise. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}