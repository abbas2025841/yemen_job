import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLanguageContext } from '@/components/language-provider';
import { insertJobSchema } from '@shared/schema';
import { z } from 'zod';
import { Plus } from 'lucide-react';

const jobFormSchema = insertJobSchema.extend({
  skills: z.string().transform((str) => str.split(',').map(s => s.trim()).filter(s => s.length > 0)),
});

export default function PostJob() {
  const { language } = useLanguageContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isArabic = language === 'ar';

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['/api/locations'],
  });

  const form = useForm<z.infer<typeof jobFormSchema>>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      requirements: '',
      requirementsEn: '',
      location: '',
      employmentType: 'full_time',
      experience: 'entry',
      category: '',
      skills: '',
      salary: '',
      companyId: 'company1', // This would come from auth context
    },
  });

  const postJobMutation = useMutation({
    mutationFn: async (data: z.infer<typeof jobFormSchema>) => {
      const response = await apiRequest('POST', '/api/jobs', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: isArabic ? 'تم نشر الوظيفة بنجاح' : 'Job posted successfully',
        description: isArabic 
          ? 'ستظهر الوظيفة في القائمة قريباً' 
          : 'The job will appear in the listings soon',
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
    },
    onError: () => {
      toast({
        title: isArabic ? 'خطأ في نشر الوظيفة' : 'Error posting job',
        description: isArabic 
          ? 'حاول مرة أخرى لاحقاً' 
          : 'Please try again later',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: z.infer<typeof jobFormSchema>) => {
    postJobMutation.mutate(data);
  };

  const employmentTypes = [
    { value: 'full_time', label: { ar: 'دوام كامل', en: 'Full Time' } },
    { value: 'part_time', label: { ar: 'دوام جزئي', en: 'Part Time' } },
    { value: 'contract', label: { ar: 'عقد', en: 'Contract' } },
    { value: 'remote', label: { ar: 'عن بُعد', en: 'Remote' } },
  ];

  const experienceLevels = [
    { value: 'entry', label: { ar: 'مبتدئ', en: 'Entry Level' } },
    { value: 'mid', label: { ar: 'متوسط', en: 'Mid Level' } },
    { value: 'senior', label: { ar: 'خبير', en: 'Senior Level' } },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2" data-testid="page-title">
              <Plus size={24} />
              {isArabic ? 'نشر وظيفة جديدة' : 'Post a New Job'}
            </CardTitle>
            <p className="text-muted-foreground" data-testid="page-description">
              {isArabic 
                ? 'املأ النموذج أدناه لنشر وظيفة جديدة'
                : 'Fill out the form below to post a new job listing'
              }
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-job-title-ar">
                          {isArabic ? 'المسمى الوظيفي (عربي)' : 'Job Title (Arabic)'}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-job-title-ar" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="titleEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-job-title-en">
                          {isArabic ? 'المسمى الوظيفي (إنجليزي)' : 'Job Title (English)'}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-job-title-en" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-job-description">
                        {isArabic ? 'وصف الوظيفة' : 'Job Description'}
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={5} 
                          {...field} 
                          data-testid="textarea-job-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-job-requirements">
                        {isArabic ? 'المتطلبات' : 'Requirements'}
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={4} 
                          {...field} 
                          data-testid="textarea-job-requirements"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-job-location">
                          {isArabic ? 'الموقع' : 'Location'}
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-job-location">
                              <SelectValue placeholder={isArabic ? 'اختر الموقع' : 'Select Location'} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location.name} value={location.name}>
                                {isArabic ? location.name : location.nameEn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-job-category">
                          {isArabic ? 'التخصص' : 'Category'}
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-job-category">
                              <SelectValue placeholder={isArabic ? 'اختر التخصص' : 'Select Category'} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.name} value={category.name}>
                                {isArabic ? category.name : category.nameEn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-employment-type">
                          {isArabic ? 'نوع العمل' : 'Employment Type'}
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-employment-type-form">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employmentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label[language]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-experience-level">
                          {isArabic ? 'مستوى الخبرة' : 'Experience Level'}
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-experience-level">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {experienceLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label[language]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-salary">
                          {isArabic ? 'الراتب (اختياري)' : 'Salary (Optional)'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder={isArabic ? 'مثال: 500,000 - 800,000 ريال' : 'e.g. 500,000 - 800,000 YER'}
                            data-testid="input-salary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-skills">
                        {isArabic ? 'المهارات المطلوبة' : 'Required Skills'}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder={isArabic 
                            ? 'اكتب المهارات مفصولة بفواصل (مثال: React, JavaScript, CSS)'
                            : 'Enter skills separated by commas (e.g. React, JavaScript, CSS)'
                          }
                          data-testid="input-skills"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    data-testid="button-cancel-job"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={postJobMutation.isPending}
                    data-testid="button-submit-job"
                  >
                    {postJobMutation.isPending
                      ? (isArabic ? 'جاري النشر...' : 'Publishing...')
                      : (isArabic ? 'نشر الوظيفة' : 'Publish Job')
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
