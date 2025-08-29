import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';

class ProfileCompletionFormWidget extends StatefulWidget {
  final GlobalKey<FormState> formKey;
  final XFile? selectedImage;
  final PlatformFile? selectedCV;
  final bool emailNotifications;
  final bool pushNotifications;
  final bool termsAccepted;
  final Function(XFile?) onImageSelected;
  final Function(PlatformFile?) onCVSelected;
  final Function(bool) onEmailNotificationChanged;
  final Function(bool) onPushNotificationChanged;
  final Function(bool) onTermsChanged;
  final VoidCallback onRegister;
  final VoidCallback onBack;

  const ProfileCompletionFormWidget({
    Key? key,
    required this.formKey,
    required this.selectedImage,
    required this.selectedCV,
    required this.emailNotifications,
    required this.pushNotifications,
    required this.termsAccepted,
    required this.onImageSelected,
    required this.onCVSelected,
    required this.onEmailNotificationChanged,
    required this.onPushNotificationChanged,
    required this.onTermsChanged,
    required this.onRegister,
    required this.onBack,
  }) : super(key: key);

  @override
  State<ProfileCompletionFormWidget> createState() =>
      _ProfileCompletionFormWidgetState();
}

class _ProfileCompletionFormWidgetState
    extends State<ProfileCompletionFormWidget> {
  final ImagePicker _imagePicker = ImagePicker();
  bool _isUploading = false;

  Future<void> _selectProfileImage() async {
    try {
      showModalBottomSheet(
        context: context,
        builder: (BuildContext context) {
          return SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(
                  leading: CustomIconWidget(
                    iconName: 'camera_alt',
                    color: AppTheme.lightTheme.colorScheme.primary,
                    size: 24,
                  ),
                  title: Text(
                    'التقاط صورة',
                    textAlign: TextAlign.right,
                    style: AppTheme.lightTheme.textTheme.bodyLarge,
                  ),
                  onTap: () async {
                    Navigator.pop(context);
                    final XFile? image = await _imagePicker.pickImage(
                      source: ImageSource.camera,
                      maxWidth: 800,
                      maxHeight: 800,
                      imageQuality: 85,
                    );
                    if (image != null) {
                      widget.onImageSelected(image);
                    }
                  },
                ),
                ListTile(
                  leading: CustomIconWidget(
                    iconName: 'photo_library',
                    color: AppTheme.lightTheme.colorScheme.primary,
                    size: 24,
                  ),
                  title: Text(
                    'اختيار من المعرض',
                    textAlign: TextAlign.right,
                    style: AppTheme.lightTheme.textTheme.bodyLarge,
                  ),
                  onTap: () async {
                    Navigator.pop(context);
                    final XFile? image = await _imagePicker.pickImage(
                      source: ImageSource.gallery,
                      maxWidth: 800,
                      maxHeight: 800,
                      imageQuality: 85,
                    );
                    if (image != null) {
                      widget.onImageSelected(image);
                    }
                  },
                ),
                ListTile(
                  leading: CustomIconWidget(
                    iconName: 'cancel',
                    color: AppTheme.lightTheme.colorScheme.error,
                    size: 24,
                  ),
                  title: Text(
                    'إلغاء',
                    textAlign: TextAlign.right,
                    style: AppTheme.lightTheme.textTheme.bodyLarge,
                  ),
                  onTap: () => Navigator.pop(context),
                ),
              ],
            ),
          );
        },
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('حدث خطأ في اختيار الصورة'),
          backgroundColor: AppTheme.lightTheme.colorScheme.error,
        ),
      );
    }
  }

  Future<void> _selectCV() async {
    try {
      setState(() => _isUploading = true);

      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'doc', 'docx'],
        allowMultiple: false,
      );

      if (result != null && result.files.isNotEmpty) {
        final file = result.files.first;
        if (file.size <= 5 * 1024 * 1024) {
          // 5MB limit
          widget.onCVSelected(file);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('حجم الملف يجب أن يكون أقل من 5 ميجابايت'),
              backgroundColor: AppTheme.lightTheme.colorScheme.error,
            ),
          );
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('حدث خطأ في اختيار الملف'),
          backgroundColor: AppTheme.lightTheme.colorScheme.error,
        ),
      );
    } finally {
      setState(() => _isUploading = false);
    }
  }

  void _showTermsModal() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            'الشروط والأحكام',
            textAlign: TextAlign.right,
            style: AppTheme.lightTheme.textTheme.headlineSmall,
          ),
          content: SingleChildScrollView(
            child: Text(
              '''
شروط وأحكام استخدام تطبيق Yemen Job

1. القبول بالشروط
باستخدامك لهذا التطبيق، فإنك توافق على الالتزام بهذه الشروط والأحكام.

2. استخدام الخدمة
- يجب استخدام التطبيق للأغراض المشروعة فقط
- يحظر نشر محتوى مخالف للقوانين اليمنية
- يجب تقديم معلومات صحيحة ودقيقة

3. الخصوصية
نحن نحترم خصوصيتك ونحمي بياناتك الشخصية وفقاً لسياسة الخصوصية الخاصة بنا.

4. المسؤولية
التطبيق غير مسؤول عن دقة المعلومات المقدمة من قبل أصحاب العمل أو الباحثين عن عمل.

5. التعديل
نحتفظ بالحق في تعديل هذه الشروط في أي وقت.

للمزيد من المعلومات، يرجى زيارة موقعنا الإلكتروني.
              ''',
              textAlign: TextAlign.right,
              style: AppTheme.lightTheme.textTheme.bodyMedium,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(
                'إغلاق',
                style: AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
                  color: AppTheme.lightTheme.colorScheme.primary,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: widget.formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'إكمال الملف الشخصي',
            style: AppTheme.lightTheme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.right,
          ),
          SizedBox(height: 3.h),

          // Profile Photo Section
          Center(
            child: Column(
              children: [
                GestureDetector(
                  onTap: _selectProfileImage,
                  child: Container(
                    width: 25.w,
                    height: 25.w,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: AppTheme.lightTheme.colorScheme.outline,
                        width: 2,
                      ),
                      color: AppTheme.lightTheme.colorScheme.surface,
                    ),
                    child: widget.selectedImage != null
                        ? ClipOval(
                            child: kIsWeb
                                ? Image.network(
                                    widget.selectedImage!.path,
                                    fit: BoxFit.cover,
                                    width: 25.w,
                                    height: 25.w,
                                  )
                                : Image.file(
                                    File(widget.selectedImage!.path),
                                    fit: BoxFit.cover,
                                    width: 25.w,
                                    height: 25.w,
                                  ),
                          )
                        : CustomIconWidget(
                            iconName: 'add_a_photo',
                            color: AppTheme
                                .lightTheme.colorScheme.onSurfaceVariant,
                            size: 40,
                          ),
                  ),
                ),
                SizedBox(height: 1.h),
                Text(
                  'صورة شخصية (اختيارية)',
                  style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                    color: AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
          SizedBox(height: 3.h),

          // CV Upload Section
          Container(
            width: double.infinity,
            padding: EdgeInsets.all(4.w),
            decoration: BoxDecoration(
              border: Border.all(
                color: widget.selectedCV != null
                    ? AppTheme.lightTheme.colorScheme.secondary
                    : AppTheme.lightTheme.colorScheme.outline,
              ),
              borderRadius: BorderRadius.circular(12),
              color: widget.selectedCV != null
                  ? AppTheme.lightTheme.colorScheme.secondary
                      .withValues(alpha: 0.1)
                  : AppTheme.lightTheme.colorScheme.surface,
            ),
            child: Column(
              children: [
                CustomIconWidget(
                  iconName: widget.selectedCV != null
                      ? 'check_circle'
                      : 'upload_file',
                  color: widget.selectedCV != null
                      ? AppTheme.lightTheme.colorScheme.secondary
                      : AppTheme.lightTheme.colorScheme.primary,
                  size: 32,
                ),
                SizedBox(height: 1.h),
                Text(
                  widget.selectedCV != null
                      ? widget.selectedCV!.name
                      : 'رفع السيرة الذاتية',
                  style: AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
                    color: widget.selectedCV != null
                        ? AppTheme.lightTheme.colorScheme.secondary
                        : AppTheme.lightTheme.colorScheme.onSurface,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 0.5.h),
                Text(
                  widget.selectedCV != null
                      ? 'تم رفع الملف بنجاح'
                      : 'PDF, DOC, DOCX - حد أقصى 5 ميجابايت',
                  style: AppTheme.lightTheme.textTheme.bodySmall?.copyWith(
                    color: AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 2.h),
                OutlinedButton(
                  onPressed: _isUploading ? null : _selectCV,
                  child: _isUploading
                      ? SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              AppTheme.lightTheme.colorScheme.primary,
                            ),
                          ),
                        )
                      : Text(
                          widget.selectedCV != null
                              ? 'تغيير الملف'
                              : 'اختيار ملف',
                          style: AppTheme.lightTheme.textTheme.titleMedium,
                        ),
                ),
              ],
            ),
          ),
          SizedBox(height: 3.h),

          // Notification Preferences
          Text(
            'تفضيلات الإشعارات',
            style: AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.right,
          ),
          SizedBox(height: 1.h),

          SwitchListTile(
            title: Text(
              'إشعارات البريد الإلكتروني',
              textAlign: TextAlign.right,
              style: AppTheme.lightTheme.textTheme.bodyMedium,
            ),
            subtitle: Text(
              'تلقي إشعارات الوظائف الجديدة عبر البريد الإلكتروني',
              textAlign: TextAlign.right,
              style: AppTheme.lightTheme.textTheme.bodySmall,
            ),
            value: widget.emailNotifications,
            onChanged: widget.onEmailNotificationChanged,
            contentPadding: EdgeInsets.zero,
          ),

          SwitchListTile(
            title: Text(
              'الإشعارات الفورية',
              textAlign: TextAlign.right,
              style: AppTheme.lightTheme.textTheme.bodyMedium,
            ),
            subtitle: Text(
              'تلقي إشعارات فورية على الهاتف',
              textAlign: TextAlign.right,
              style: AppTheme.lightTheme.textTheme.bodySmall,
            ),
            value: widget.pushNotifications,
            onChanged: widget.onPushNotificationChanged,
            contentPadding: EdgeInsets.zero,
          ),
          SizedBox(height: 2.h),

          // Terms and Conditions
          Row(
            children: [
              Checkbox(
                value: widget.termsAccepted,
                onChanged: (bool? value) => widget.onTermsChanged(value ?? false),
              ),
              Expanded(
                child: GestureDetector(
                  onTap: _showTermsModal,
                  child: RichText(
                    textAlign: TextAlign.right,
                    text: TextSpan(
                      style: AppTheme.lightTheme.textTheme.bodyMedium,
                      children: [
                        TextSpan(text: 'أوافق على '),
                        TextSpan(
                          text: 'الشروط والأحكام',
                          style: TextStyle(
                            color: AppTheme.lightTheme.colorScheme.primary,
                            decoration: TextDecoration.underline,
                          ),
                        ),
                        TextSpan(text: ' الخاصة بالتطبيق'),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 4.h),

          // Navigation Buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: widget.onBack,
                  style: OutlinedButton.styleFrom(
                    padding: EdgeInsets.symmetric(vertical: 2.h),
                  ),
                  child: Text(
                    'السابق',
                    style: AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
              SizedBox(width: 4.w),
              Expanded(
                child: ElevatedButton(
                  onPressed: widget.termsAccepted
                      ? () {
                          HapticFeedback.lightImpact();
                          widget.onRegister();
                        }
                      : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.lightTheme.colorScheme.secondary,
                    foregroundColor:
                        AppTheme.lightTheme.colorScheme.onSecondary,
                    padding: EdgeInsets.symmetric(vertical: 2.h),
                  ),
                  child: Text(
                    'إنشاء الحساب',
                    style: AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
                      color: AppTheme.lightTheme.colorScheme.onSecondary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}