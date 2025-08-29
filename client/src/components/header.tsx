import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguageContext } from './language-provider';
import { useThemeContext } from './theme-provider';
import { Menu, Briefcase, User, Sun, Moon, Monitor } from 'lucide-react';

export function Header() {
  const { language, toggleLanguage } = useLanguageContext();
  const { theme, toggleTheme } = useThemeContext();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isArabic = language === 'ar';

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': 
        return <Sun size={16} />;
      case 'dark': 
        return <Moon size={16} />;
      default: 
        return <Monitor size={16} />;
    }
  };

  const navigation = [
    { 
      href: '/jobs', 
      label: { ar: 'الوظائف', en: 'Jobs' }, 
      active: location === '/jobs' 
    },
    { 
      href: '/companies', 
      label: { ar: 'الشركات', en: 'Companies' }, 
      active: location === '/companies' 
    },
    { 
      href: '/post-job', 
      label: { ar: 'نشر وظيفة', en: 'Post Job' }, 
      active: location === '/post-job' 
    },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="/attached_assets/يمن_1756477392932.png" 
                  alt="Yemen Jobs Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {isArabic ? 'وظائف اليمن' : 'Yemen Jobs'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'Yemen Jobs' : 'وظائف اليمن'}
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`link-${item.href.slice(1)}`}
              >
                <span
                  className={`font-medium transition-colors hover:text-primary ${
                    item.active ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label[language]}
                </span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative transition-all duration-300 hover:rotate-12"
              data-testid="button-theme-toggle"
            >
              <div className="transition-all duration-500">
                {getThemeIcon()}
              </div>
            </Button>

            {/* Language Toggle */}
            <div className="language-toggle bg-muted rounded-full p-1 flex items-center gap-1 transition-colors duration-300">
              <button
                onClick={() => language !== 'ar' && toggleLanguage()}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  language === 'ar'
                    ? 'bg-primary text-primary-foreground transform scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
                data-testid="button-language-ar"
              >
                عربي
              </button>
              <button
                onClick={() => language !== 'en' && toggleLanguage()}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-primary text-primary-foreground transform scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
                data-testid="button-language-en"
              >
                EN
              </button>
            </div>

            <Link href="/profile" data-testid="link-profile">
              <Button variant="ghost" size="icon" className="transition-all duration-300 hover:scale-110">
                <User size={18} />
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden transition-all duration-300 hover:scale-110"
                  data-testid="button-mobile-menu"
                >
                  <Menu size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side={isArabic ? 'left' : 'right'} 
                className="w-80 bg-background/95 backdrop-blur-sm border-border"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center gap-3 py-6 border-b border-border">
                    <img 
                      src="/attached_assets/يمن_1756477392932.png" 
                      alt="Yemen Jobs Logo"
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <h2 className="font-bold">
                        {isArabic ? 'وظائف اليمن' : 'Yemen Jobs'}
                      </h2>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-2 mt-6 flex-1">
                    {navigation.map((item, index) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        data-testid={`mobile-link-${item.href.slice(1)}`}
                      >
                        <div
                          className={`p-4 rounded-lg transition-all duration-300 hover:bg-accent group ${
                            item.active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground'
                          }`}
                          style={{ 
                            animationDelay: `${index * 100}ms`,
                            animation: isOpen ? 'slideInRight 0.3s ease-out forwards' : 'none'
                          }}
                        >
                          <span className="text-lg font-medium group-hover:translate-x-1 transition-transform duration-300 inline-block">
                            {item.label[language]}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Theme & Language Controls */}
                  <div className="border-t border-border pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {isArabic ? 'المظهر' : 'Theme'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleTheme}
                        className="transition-all duration-300 hover:rotate-12"
                      >
                        {getThemeIcon()}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {isArabic ? 'اللغة' : 'Language'}
                      </span>
                      <div className="language-toggle bg-muted rounded-full p-1 flex items-center gap-1">
                        <button
                          onClick={() => language !== 'ar' && toggleLanguage()}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                            language === 'ar'
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          عربي
                        </button>
                        <button
                          onClick={() => language !== 'en' && toggleLanguage()}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                            language === 'en'
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          EN
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
