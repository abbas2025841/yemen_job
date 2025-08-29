import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguageContext } from '@/components/language-provider';
import { User, Briefcase, Building, FileText, Settings } from 'lucide-react';
import type { ApplicationWithJob } from '@shared/schema';

export default function Profile() {
  const { language } = useLanguageContext();
  const isArabic = language === 'ar';
  const [activeTab, setActiveTab] = useState('applications');

  // Mock user data - in a real app this would come from auth context
  const currentUserId = 'user1';

  const { data: applications = [], isLoading } = useQuery<ApplicationWithJob[]>({
    queryKey: ['/api/applications/user', currentUserId],
  });

  const getStatusText = (status: string) => {
    const statuses = {
      pending: { ar: 'قيد المراجعة', en: 'Pending' },
      reviewed: { ar: 'تمت المراجعة', en: 'Reviewed' },
      accepted: { ar: 'مقبول', en: 'Accepted' },
      rejected: { ar: 'مرفوض', en: 'Rejected' }
    };
    return statuses[status as keyof typeof statuses]?.[language] || status;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      case 'reviewed': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold" data-testid="user-name">
                {isArabic ? 'أحمد محمد' : 'Ahmed Mohammed'}
              </h1>
              <p className="text-muted-foreground" data-testid="user-title">
                {isArabic ? 'مطور برمجيات' : 'Software Developer'}
              </p>
              <p className="text-sm text-muted-foreground" data-testid="user-location">
                {isArabic ? 'صنعاء، اليمن' : 'Sanaa, Yemen'}
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications" data-testid="tab-applications">
              <FileText className={isArabic ? 'ml-2' : 'mr-2'} size={16} />
              {isArabic ? 'طلباتي' : 'My Applications'}
            </TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className={isArabic ? 'ml-2' : 'mr-2'} size={16} />
              {isArabic ? 'الملف الشخصي' : 'Profile'}
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className={isArabic ? 'ml-2' : 'mr-2'} size={16} />
              {isArabic ? 'الإعدادات' : 'Settings'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle data-testid="applications-title">
                  {isArabic ? 'طلبات التوظيف' : 'Job Applications'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border border-border rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/6"></div>
                      </div>
                    ))}
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-muted-foreground" data-testid="text-no-applications">
                      {isArabic ? 'لم تقدم على أي وظائف بعد' : 'No applications submitted yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div 
                        key={application.id} 
                        className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                        data-testid={`application-${application.id}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold" data-testid={`application-job-title-${application.id}`}>
                              {isArabic ? application.job.title : (application.job.titleEn || application.job.title)}
                            </h4>
                            <p className="text-muted-foreground text-sm" data-testid={`application-company-${application.id}`}>
                              {isArabic ? application.job.company.name : (application.job.company.nameEn || application.job.company.name)}
                            </p>
                          </div>
                          <Badge 
                            variant={getStatusVariant(application.status || 'pending')}
                            data-testid={`application-status-${application.id}`}
                          >
                            {getStatusText(application.status || 'pending')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span data-testid={`application-location-${application.id}`}>
                              {application.job.location}
                            </span>
                          </span>
                          <span data-testid={`application-date-${application.id}`}>
                            {isArabic ? 'قدم في' : 'Applied'} {new Date(application.appliedAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle data-testid="profile-title">
                  {isArabic ? 'المعلومات الشخصية' : 'Personal Information'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <p className="text-foreground" data-testid="profile-name">
                      {isArabic ? 'أحمد محمد علي' : 'Ahmed Mohammed Ali'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <p className="text-foreground" data-testid="profile-email">ahmed@example.com</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'رقم الهاتف' : 'Phone'}
                    </label>
                    <p className="text-foreground" data-testid="profile-phone">+967 123 456 789</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'المهارات' : 'Skills'}
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['React', 'JavaScript', 'Node.js', 'Python'].map((skill) => (
                        <Badge key={skill} variant="secondary" data-testid={`profile-skill-${skill}`}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button className="mt-6" data-testid="button-edit-profile">
                  {isArabic ? 'تحرير الملف الشخصي' : 'Edit Profile'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle data-testid="settings-title">
                  {isArabic ? 'إعدادات الحساب' : 'Account Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">
                      {isArabic ? 'الإشعارات' : 'Notifications'}
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">
                          {isArabic ? 'إشعارات الوظائف الجديدة' : 'New job notifications'}
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">
                          {isArabic ? 'تحديثات الطلبات' : 'Application updates'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">
                      {isArabic ? 'الخصوصية' : 'Privacy'}
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">
                          {isArabic ? 'إظهار الملف الشخصي للشركات' : 'Show profile to companies'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <Button variant="destructive" data-testid="button-delete-account">
                    {isArabic ? 'حذف الحساب' : 'Delete Account'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
