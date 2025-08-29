import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/components/language-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import Home from "@/pages/home";
import Jobs from "@/pages/jobs";
import PostJob from "@/pages/post-job";
import Companies from "@/pages/companies";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/post-job" component={PostJob} />
      <Route path="/companies" component={Companies} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background transition-colors duration-300">
              <Header />
              <main>
                <Router />
              </main>
            
            {/* Footer */}
            <footer className="bg-card border-t border-border py-12 px-4">
              <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <img 
                          src="/attached_assets/يمن_1756477392932.png" 
                          alt="Yemen Jobs Logo"
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">وظائف اليمن</h4>
                        <p className="text-xs text-muted-foreground">Yemen Jobs</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      منصة الوظائف الرائدة في اليمن، نهدف إلى ربط أفضل المواهب بأفضل الفرص الوظيفية في البلاد.
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-4">روابط سريعة</h5>
                    <ul className="space-y-2 text-sm">
                      <li><a href="/jobs" className="text-muted-foreground hover:text-primary transition-colors">تصفح الوظائف</a></li>
                      <li><a href="/companies" className="text-muted-foreground hover:text-primary transition-colors">الشركات</a></li>
                      <li><a href="/post-job" className="text-muted-foreground hover:text-primary transition-colors">نشر وظيفة</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-4">المساعدة</h5>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">مركز المساعدة</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">تواصل معنا</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">سياسة الخصوصية</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-border pt-8 mt-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    © 2024 وظائف اليمن. جميع الحقوق محفوظة.
                  </p>
                </div>
              </div>
            </footer>
          </div>
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
