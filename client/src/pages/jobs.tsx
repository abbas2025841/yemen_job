import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobCard } from '@/components/job-card';
import { JobApplicationModal } from '@/components/job-application-modal';
import { JobCardSkeletonList } from '@/components/job-card-skeleton';
import { useLanguageContext } from '@/components/language-provider';
import { Search, Filter } from 'lucide-react';
import type { JobWithCompany } from '@shared/schema';

export default function Jobs() {
  const { language } = useLanguageContext();
  const isArabic = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('');
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string } | null>(null);

  // Get URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    const location = params.get('location');
    const category = params.get('category');
    
    if (query) setSearchQuery(query);
    if (location) setSelectedLocation(location);
    if (category) setSelectedCategory(category);
  }, []);

  const { data: jobs = [], isLoading } = useQuery<JobWithCompany[]>({
    queryKey: ['/api/jobs', { 
      query: searchQuery, 
      location: selectedLocation, 
      category: selectedCategory,
      employmentType: selectedEmploymentType 
    }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedLocation && selectedLocation !== 'all') params.append('location', selectedLocation);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedEmploymentType && selectedEmploymentType !== 'all') params.append('employmentType', selectedEmploymentType);
      
      const response = await fetch(`/api/jobs?${params.toString()}`);
      return response.json();
    }
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['/api/locations'],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  const employmentTypes = [
    { value: 'full_time', label: { ar: 'دوام كامل', en: 'Full Time' } },
    { value: 'part_time', label: { ar: 'دوام جزئي', en: 'Part Time' } },
    { value: 'contract', label: { ar: 'عقد', en: 'Contract' } },
    { value: 'remote', label: { ar: 'عن بُعد', en: 'Remote' } },
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('all');
    setSelectedCategory('all');
    setSelectedEmploymentType('all');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6" data-testid="page-title">
            {isArabic ? 'البحث عن وظائف' : 'Job Search'}
          </h1>

          {/* Search and Filters */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder={isArabic ? 'ابحث عن وظيفة...' : 'Search for jobs...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-jobs"
                />
              </div>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger data-testid="select-location-filter">
                  <SelectValue placeholder={isArabic ? 'الموقع' : 'Location'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isArabic ? 'جميع المواقع' : 'All Locations'}</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location.name} value={location.name}>
                      {isArabic ? location.name : location.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="select-category-filter">
                  <SelectValue placeholder={isArabic ? 'التخصص' : 'Category'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isArabic ? 'جميع التخصصات' : 'All Categories'}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {isArabic ? category.name : category.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedEmploymentType} onValueChange={setSelectedEmploymentType}>
                <SelectTrigger data-testid="select-employment-type">
                  <SelectValue placeholder={isArabic ? 'نوع العمل' : 'Job Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isArabic ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                  {employmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={clearFilters}
                data-testid="button-clear-filters"
              >
                <Filter className={isArabic ? 'ml-2' : 'mr-2'} size={16} />
                {isArabic ? 'مسح المرشحات' : 'Clear Filters'}
              </Button>
              
              <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                {isArabic ? `${jobs.length} وظيفة متاحة` : `${jobs.length} jobs found`}
              </p>
            </div>
          </div>

          {/* Job Results */}
          {isLoading ? (
            <JobCardSkeletonList count={5} />
          ) : jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground text-lg" data-testid="text-no-jobs">
                {isArabic ? 'لا توجد وظائف مطابقة للبحث' : 'No jobs match your search'}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={() => setSelectedJob({ id: job.id, title: job.title })}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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
