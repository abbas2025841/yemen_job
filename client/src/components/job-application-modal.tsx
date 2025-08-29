import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLanguageContext } from './language-provider';
import { insertApplicationSchema } from '@shared/schema';
import { z } from 'zod';
import { X } from 'lucide-react';

const applicationFormSchema = insertApplicationSchema.extend({
  fullName: z.string().min(1, 'الاسم الكامل مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(1, 'رقم الهاتف مطلوب'),
});

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
}

export function JobApplicationModal({ isOpen, onClose, jobId, jobTitle }: JobApplicationModalProps) {
  const { language } = useLanguageContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isArabic = language === 'ar';

  const form = useForm<z.infer<typeof applicationFormSchema>>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      jobId,
      userId: 'user1', // This would come from auth context in a real app
      coverLetter: '',
      resumeUrl: '',
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof applicationFormSchema>) => {
      const response = await apiRequest('POST', '/api/applications', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: isArabic ? 'تم إرسال الطلب بنجاح' : 'Application sent successfully',
        description: isArabic 
          ? 'سيتم التواصل معك قريباً' 
          : 'We will contact you soon',
      });
      form.reset();
      onClose();
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
    },
    onError: () => {
      toast({
        title: isArabic ? 'خطأ في إرسال الطلب' : 'Error sending application',
        description: isArabic 
          ? 'حاول مرة أخرى لاحقاً' 
          : 'Please try again later',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: z.infer<typeof applicationFormSchema>) => {
    applyMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-job-application">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {isArabic ? 'التقدم للوظيفة' : 'Apply for Job'}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              data-testid="button-close-modal"
            >
              <X size={18} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground" data-testid="text-job-title">
            {jobTitle}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-testid="label-full-name">
                    {isArabic ? 'الاسم الكامل' : 'Full Name'}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      data-testid="input-full-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-testid="label-email">
                    {isArabic ? 'البريد الإلكتروني' : 'Email'}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      {...field} 
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-testid="label-phone">
                    {isArabic ? 'رقم الهاتف' : 'Phone Number'}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      {...field} 
                      data-testid="input-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resumeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-testid="label-resume">
                    {isArabic ? 'رابط السيرة الذاتية' : 'Resume URL'}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="url" 
                      placeholder={isArabic ? 'رابط السيرة الذاتية' : 'Resume URL'}
                      {...field} 
                      data-testid="input-resume"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-testid="label-cover-letter">
                    {isArabic ? 'رسالة تغطية (اختياري)' : 'Cover Letter (Optional)'}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder={isArabic 
                        ? 'اكتب رسالة قصيرة تعبر عن اهتمامك بهذه الوظيفة...' 
                        : 'Write a brief message expressing your interest in this position...'}
                      {...field}
                      data-testid="textarea-cover-letter"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={applyMutation.isPending}
                data-testid="button-submit-application"
              >
                {applyMutation.isPending 
                  ? (isArabic ? 'جاري الإرسال...' : 'Sending...') 
                  : (isArabic ? 'إرسال الطلب' : 'Send Application')
                }
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                data-testid="button-cancel-application"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
