import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CompanyCardSkeletonGrid } from '@/components/company-card-skeleton';
import { useLanguageContext } from '@/components/language-provider';
import { Building, MapPin, Users, ExternalLink } from 'lucide-react';
import type { Company } from '@shared/schema';

export default function Companies() {
  const { language } = useLanguageContext();
  const isArabic = language === 'ar';

  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ['/api/companies'],
  });

  const getSizeText = (size: string) => {
    const sizes = {
      startup: { ar: 'شركة ناشئة', en: 'Startup' },
      small: { ar: 'صغيرة', en: 'Small' },
      medium: { ar: 'متوسطة', en: 'Medium' },
      large: { ar: 'كبيرة', en: 'Large' }
    };
    return sizes[size as keyof typeof sizes]?.[language] || size;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4" data-testid="page-title">
            {isArabic ? 'الشركات' : 'Companies'}
          </h1>
          <p className="text-muted-foreground" data-testid="page-description">
            {isArabic 
              ? 'تصفح الشركات الرائدة في اليمن والفرص الوظيفية المتاحة'
              : 'Browse leading companies in Yemen and available opportunities'
            }
          </p>
        </div>

        {isLoading ? (
          <CompanyCardSkeletonGrid count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card 
                key={company.id} 
                className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                data-testid={`company-card-${company.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building className="text-muted-foreground" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 truncate" data-testid={`company-name-${company.id}`}>
                        {isArabic ? company.name : (company.nameEn || company.name)}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin size={14} />
                        <span data-testid={`company-location-${company.id}`}>{company.location}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs" data-testid={`company-size-${company.id}`}>
                        {getSizeText(company.size || 'medium')}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4" data-testid={`company-description-${company.id}`}>
                    {isArabic 
                      ? company.description 
                      : (company.descriptionEn || company.description)
                    }
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground" data-testid={`company-industry-${company.id}`}>
                      {company.industry}
                    </span>
                    {company.website && (
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors"
                        data-testid={`company-website-${company.id}`}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && companies.length === 0 && (
          <div className="text-center py-16">
            <Building className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground text-lg" data-testid="text-no-companies">
              {isArabic ? 'لا توجد شركات مسجلة حالياً' : 'No companies registered yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
