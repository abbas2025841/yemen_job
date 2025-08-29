
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:sizer/sizer.dart';

import '../../core/app_export.dart';
import './widgets/basic_info_form_widget.dart';
import './widgets/professional_info_form_widget.dart';
import './widgets/profile_completion_form_widget.dart';
import './widgets/step_indicator_widget.dart';

class RegistrationScreen extends StatefulWidget {
  const RegistrationScreen({Key? key}) : super(key: key);

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  final PageController _pageController = PageController();
  int _currentStep = 1;
  final int _totalSteps = 3;
  bool _isRegistering = false;

  // Form keys
  final GlobalKey<FormState> _basicInfoFormKey = GlobalKey<FormState>();
  final GlobalKey<FormState> _professionalInfoFormKey = GlobalKey<FormState>();
  final GlobalKey<FormState> _profileCompletionFormKey = GlobalKey<FormState>();

  // Step 1: Basic Info Controllers
  final TextEditingController _fullNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // Step 2: Professional Info
  String? _selectedCategory;
  String? _selectedExperience;
  List<String> _selectedCities = [];
  String? _selectedCurrency = 'yer';
  final TextEditingController _salaryController = TextEditingController();

  // Step 3: Profile Completion
  XFile? _selectedImage;
  PlatformFile? _selectedCV;
  bool _emailNotifications = true;
  bool _pushNotifications = true;
  bool _termsAccepted = false;

  @override
  void dispose() {
    _pageController.dispose();
    _fullNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _salaryController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < _totalSteps) {
      setState(() => _currentStep++);
      _pageController.nextPage(
        duration: Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _previousStep() {
    if (_currentStep > 1) {
      setState(() => _currentStep--);
      _pageController.previousPage(
        duration: Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _onCategoryChanged(String? value) {
    setState(() => _selectedCategory = value);
  }

  void _onExperienceChanged(String? value) {
    setState(() => _selectedExperience = value);
  }

  void _onCityChanged(String cityId, bool isSelected) {
    setState(() {
      if (isSelected) {
        _selectedCities.add(cityId);
      } else {
        _selectedCities.remove(cityId);
      }
    });
  }

  void _onCurrencyChanged(String? value) {
    setState(() => _selectedCurrency = value);
  }

  void _onImageSelected(XFile? image) {
    setState(() => _selectedImage = image);
  }

  void _onCVSelected(PlatformFile? cv) {
    setState(() => _selectedCV = cv);
  }

  void _onEmailNotificationChanged(bool value) {
    setState(() => _emailNotifications = value);
  }

  void _onPushNotificationChanged(bool value) {
    setState(() => _pushNotifications = value);
  }

  void _onTermsChanged(bool? value) {
    setState(() => _termsAccepted = value ?? false);
  }

  Future<void> _register() async {
    if (!_termsAccepted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('يجب الموافقة على الشروط والأحكام'),
          backgroundColor: AppTheme.lightTheme.colorScheme.error,
        ),
      );
      return;
    }

    setState(() => _isRegistering = true);

    try {
      // Simulate registration process
      await Future.delayed(Duration(seconds: 2));

      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content:
              Text('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني'),
          backgroundColor: AppTheme.lightTheme.colorScheme.secondary,
          duration: Duration(seconds: 3),
        ),
      );

      // Navigate to login screen after successful registration
      await Future.delayed(Duration(seconds: 1));
      Navigator.pushReplacementNamed(context, '/login-screen');
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى'),
          backgroundColor: AppTheme.lightTheme.colorScheme.error,
        ),
      );
    } finally {
      setState(() => _isRegistering = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: AppTheme.lightTheme.scaffoldBackgroundColor,
        appBar: AppBar(
          title: Text(
            'إنشاء حساب جديد',
            style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          centerTitle: true,
          leading: IconButton(
            onPressed: () {
              if (_currentStep > 1) {
                _previousStep();
              } else {
                Navigator.pop(context);
              }
            },
            icon: CustomIconWidget(
              iconName: 'arrow_back',
              color: AppTheme.lightTheme.colorScheme.onSurface,
              size: 24,
            ),
          ),
          elevation: 0,
          backgroundColor: AppTheme.lightTheme.scaffoldBackgroundColor,
          foregroundColor: AppTheme.lightTheme.colorScheme.onSurface,
        ),
        body: Stack(
          children: [
            Column(
              children: [
                // Step Indicator
                StepIndicatorWidget(
                  currentStep: _currentStep,
                  totalSteps: _totalSteps,
                ),

                // Form Content
                Expanded(
                  child: PageView(
                    controller: _pageController,
                    physics: NeverScrollableScrollPhysics(),
                    children: [
                      // Step 1: Basic Information
                      SingleChildScrollView(
                        padding: EdgeInsets.symmetric(
                            horizontal: 4.w, vertical: 2.h),
                        child: BasicInfoFormWidget(
                          formKey: _basicInfoFormKey,
                          fullNameController: _fullNameController,
                          emailController: _emailController,
                          phoneController: _phoneController,
                          passwordController: _passwordController,
                          onContinue: _nextStep,
                        ),
                      ),

                      // Step 2: Professional Information
                      SingleChildScrollView(
                        padding: EdgeInsets.symmetric(
                            horizontal: 4.w, vertical: 2.h),
                        child: ProfessionalInfoFormWidget(
                          formKey: _professionalInfoFormKey,
                          selectedCategory: _selectedCategory,
                          selectedExperience: _selectedExperience,
                          selectedCities: _selectedCities,
                          selectedCurrency: _selectedCurrency,
                          salaryController: _salaryController,
                          onCategoryChanged: _onCategoryChanged,
                          onExperienceChanged: _onExperienceChanged,
                          onCityChanged: _onCityChanged,
                          onCurrencyChanged: _onCurrencyChanged,
                          onContinue: _nextStep,
                          onBack: _previousStep,
                        ),
                      ),

                      // Step 3: Profile Completion
                      SingleChildScrollView(
                        padding: EdgeInsets.symmetric(
                            horizontal: 4.w, vertical: 2.h),
                        child: ProfileCompletionFormWidget(
                          formKey: _profileCompletionFormKey,
                          selectedImage: _selectedImage,
                          selectedCV: _selectedCV,
                          emailNotifications: _emailNotifications,
                          pushNotifications: _pushNotifications,
                          termsAccepted: _termsAccepted,
                          onImageSelected: _onImageSelected,
                          onCVSelected: _onCVSelected,
                          onEmailNotificationChanged:
                              _onEmailNotificationChanged,
                          onPushNotificationChanged: _onPushNotificationChanged,
                          onTermsChanged: _onTermsChanged,
                          onRegister: _register,
                          onBack: _previousStep,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // Loading Overlay
            _isRegistering
                ? Container(
                    color: Colors.black.withValues(alpha: 0.5),
                    child: Center(
                      child: Container(
                        padding: EdgeInsets.all(6.w),
                        decoration: BoxDecoration(
                          color: AppTheme.lightTheme.colorScheme.surface,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            CircularProgressIndicator(
                              valueColor: AlwaysStoppedAnimation<Color>(
                                AppTheme.lightTheme.colorScheme.primary,
                              ),
                            ),
                            SizedBox(height: 2.h),
                            Text(
                              'جاري إنشاء الحساب...',
                              style: AppTheme.lightTheme.textTheme.titleMedium
                                  ?.copyWith(
                                fontWeight: FontWeight.w500,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    ),
                  )
                : SizedBox.shrink(),
          ],
        ),
      ),
    );
  }
}
