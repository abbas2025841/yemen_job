import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguageContext } from './language-provider';
import { MapPin, Clock, Calendar, Building } from 'lucide-react';
import type { JobWithCompany } from '@shared/schema';

interface JobCardProps {
  job: JobWithCompany;
  onApply: () => void;
  onSave?: () => void;
}

export function JobCard({ job, onApply, onSave }: JobCardProps) {
  const { language } = useLanguageContext();
  const isArabic = language === 'ar';

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return isArabic ? 'منذ يوم واحد' : '1 day ago';
    }
    return isArabic ? `منذ ${diffDays} أيام` : `${diffDays} days ago`;
  };

  const getEmploymentTypeText = (type: string) => {
    const types = {
      full_time: { ar: 'دوام كامل', en: 'Full Time' },
      part_time: { ar: 'دوام جزئي', en: 'Part Time' },
      contract: { ar: 'عقد', en: 'Contract' },
      remote: { ar: 'عن بُعد', en: 'Remote' }
    };
    return types[type as keyof typeof types]?.[language] || type;
  };

  return (
    <div className="job-card bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 group" data-testid={`job-card-${job.id}`}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-primary/10 group-hover:scale-105">
            <Building className="text-muted-foreground group-hover:text-primary transition-colors duration-300" size={24} />
          </div>

          {/* Job Details */}
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-foreground mb-2" data-testid={`job-title-${job.id}`}>
              {isArabic ? job.title : (job.titleEn || job.title)}
            </h4>
            <p className="text-primary font-medium mb-2" data-testid={`company-name-${job.id}`}>
              {isArabic ? job.company.name : (job.company.nameEn || job.company.name)}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                <span data-testid={`job-location-${job.id}`}>{job.location}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                <span data-testid={`job-type-${job.id}`}>{getEmploymentTypeText(job.employmentType)}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                <span data-testid={`job-date-${job.id}`}>{formatDate(job.createdAt!)}</span>
              </span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-3" data-testid={`job-description-${job.id}`}>
              {isArabic ? job.description : (job.descriptionEn || job.description)}
            </p>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {job.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs"
                    data-testid={`job-skill-${job.id}-${index}`}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 md:w-32 flex-shrink-0">
          <Button 
            onClick={onApply} 
            className="text-sm transition-all duration-300 hover:scale-105 group-hover:shadow-md"
            data-testid={`button-apply-${job.id}`}
          >
            {isArabic ? 'تقدم الآن' : 'Apply Now'}
          </Button>
          {onSave && (
            <Button 
              variant="outline" 
              onClick={onSave} 
              className="text-sm transition-all duration-300 hover:scale-105 hover:border-primary hover:text-primary"
              data-testid={`button-save-${job.id}`}
            >
              {isArabic ? 'حفظ' : 'Save'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
