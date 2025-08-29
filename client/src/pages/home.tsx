import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobCard } from '@/components/job-card';
import { JobApplicationModal } from '@/components/job-application-modal';
import { JobCardSkeletonList } from '@/components/job-card-skeleton';
import { useLanguageContext } from '@/components/language-provider';
import { Link } from 'wouter';
import { Search, ArrowDown, CheckCircle, Building, Code, Bus, TrendingUp, GraduationCap, Stethoscope, Wrench } from 'lucide-react';
import type { JobWithCompany } from '@shared/schema';

export default function Home() {
  const { language } = useLanguageContext();
  const isArabic = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string } | null>(null);

  const { data: jobs = [], isLoading } = useQuery<JobWithCompany[]>({
    queryKey: ['/api/jobs'],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['/api/locations'],
  });

  const featuredJobs = jobs.slice(0, 3);

  const categoryIcons = {
    'تقنية المعلومات': Code,
    'الإدارة': Bus,
    'المبيعات والتسويق': TrendingUp,
    'التعليم': GraduationCap,
    'الرعاية الصحية': Stethoscope,
    'الهندسة': Wrench,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-yemen py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4 slide-in" data-testid="hero-title">
            {isArabic 
              ? 'اعثر على الوظيفة المثالية في اليمن'
              : 'Find the Perfect Job in Yemen'
            }
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 stagger-1 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.2s_forwards]" data-testid="hero-subtitle">
            {isArabic
              ? 'منصة الوظائف الرائدة في اليمن - اربط بين الباحثين عن العمل وأصحاب العمل'
              : 'Yemen\'s leading job platform - connecting job seekers with employers'
            }
          </p>

          {/* Search Form */}
          <div className="bg-card rounded-xl shadow-xl p-6 mb-8 stagger-2 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.4s_forwards]">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={isArabic 
                    ? 'المسمى الوظيفي أو الكلمات المفتاحية' 
                    : 'Job title or keywords'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-right"
                  data-testid="input-job-search"
                />
              </div>
              <div className="flex-1">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger data-testid="select-location">
                    <SelectValue placeholder={isArabic ? 'اختر المحافظة' : 'Select Location'} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.name} value={location.name}>
                        {isArabic ? location.name : location.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Link href={`/jobs?query=${searchQuery}&location=${selectedLocation}`}>
                <Button className="w-full md:w-auto px-8" data-testid="button-search-jobs">
                  <Search className={isArabic ? 'ml-2' : 'mr-2'} size={18} />
                  {isArabic ? 'بحث' : 'Search'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground mb-1" data-testid="stat-jobs">
                {jobs.length}
              </div>
              <div className="text-primary-foreground/80 text-sm">
                {isArabic ? 'وظيفة متاحة' : 'Available Jobs'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground mb-1" data-testid="stat-companies">
                50+
              </div>
              <div className="text-primary-foreground/80 text-sm">
                {isArabic ? 'شركة' : 'Companies'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground mb-1" data-testid="stat-seekers">
                1000+
              </div>
              <div className="text-primary-foreground/80 text-sm">
                {isArabic ? 'باحث عن عمل' : 'Job Seekers'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground mb-1" data-testid="stat-hired">
                200+
              </div>
              <div className="text-primary-foreground/80 text-sm">
                {isArabic ? 'تم التوظيف' : 'Hired'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-2xl font-bold text-center mb-8" data-testid="categories-title">
            {isArabic ? 'التصفح حسب الفئة' : 'Browse by Category'}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Building;
              return (
                <Link key={category.name} href={`/jobs?category=${encodeURIComponent(category.name)}`}>
                  <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary hover:bg-accent transition-all cursor-pointer" data-testid={`category-card-${index}`}>
                    <IconComponent className="text-primary mx-auto mb-3" size={24} />
                    <h4 className="font-semibold text-sm" data-testid={`category-name-${index}`}>
                      {isArabic ? category.name : category.nameEn}
                    </h4>
                    <p className="text-muted-foreground text-xs mt-1" data-testid={`category-count-${index}`}>
                      {category.count} {isArabic ? 'وظيفة' : 'jobs'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h3 className="text-2xl font-bold mb-4 md:mb-0" data-testid="featured-jobs-title">
              {isArabic ? 'أحدث الوظائف المتاحة' : 'Latest Available Jobs'}
            </h3>
          </div>

          {isLoading ? (
            <JobCardSkeletonList count={3} />
          ) : (
            <div className="space-y-6">
              {featuredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={() => setSelectedJob({ id: job.id, title: job.title })}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          <div className="text-center mt-8">
            <Link href="/jobs">
              <Button variant="outline" data-testid="button-view-all-jobs">
                {isArabic ? 'عرض المزيد من الوظائف' : 'View More Jobs'}
                <ArrowDown className={isArabic ? 'mr-2' : 'ml-2'} size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Employer Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Professional office environment"
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="img-office-environment"
              />
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-4" data-testid="employer-section-title">
                {isArabic ? 'هل تبحث عن المواهب المناسبة؟' : 'Looking for the Right Talent?'}
              </h3>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed" data-testid="employer-section-description">
                {isArabic
                  ? 'انضم إلى أكثر من 50 شركة تستخدم منصتنا للعثور على أفضل المواهب في اليمن. نوفر لك وصولاً مباشراً إلى قاعدة بيانات واسعة من المرشحين المؤهلين.'
                  : 'Join over 50 companies using our platform to find the best talent in Yemen. We provide direct access to a vast database of qualified candidates.'
                }
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-primary" size={20} />
                  <span data-testid="benefit-1">
                    {isArabic ? 'نشر الوظائف مجاناً' : 'Post jobs for free'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-primary" size={20} />
                  <span data-testid="benefit-2">
                    {isArabic ? 'وصول إلى آلاف الباحثين عن العمل' : 'Access thousands of job seekers'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-primary" size={20} />
                  <span data-testid="benefit-3">
                    {isArabic ? 'لوحة تحكم سهلة الاستخدام' : 'Easy-to-use dashboard'}
                  </span>
                </div>
              </div>

              <Link href="/post-job">
                <Button className="font-semibold" data-testid="button-start-hiring">
                  {isArabic ? 'ابدأ التوظيف الآن' : 'Start Hiring Now'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-yemen">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl font-bold text-primary-foreground mb-4" data-testid="cta-title">
            {isArabic ? 'ابدأ رحلتك المهنية اليوم' : 'Start Your Career Journey Today'}
          </h3>
          <p className="text-xl text-primary-foreground/90 mb-8" data-testid="cta-description">
            {isArabic
              ? 'انضم إلى آلاف الباحثين عن العمل وأصحاب العمل في اليمن'
              : 'Join thousands of job seekers and employers in Yemen'
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/profile">
              <Button variant="secondary" className="font-semibold" data-testid="button-register-seeker">
                {isArabic ? 'تسجيل باحث عن عمل' : 'Register as Job Seeker'}
              </Button>
            </Link>
            <Link href="/post-job">
              <Button 
                variant="outline" 
                className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold"
                data-testid="button-register-employer"
              >
                <Building className={isArabic ? 'ml-2' : 'mr-2'} size={18} />
                {isArabic ? 'تسجيل صاحب عمل' : 'Register as Employer'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Job Application Modal */}
      {selectedJob && (
        <JobApplicationModal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
        />
      )}
    </div>
  );
}
