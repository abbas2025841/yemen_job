import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sizer/sizer.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

import '../../core/app_export.dart';
import './widgets/navigation_buttons_widget.dart';
import './widgets/onboarding_page_widget.dart';

class OnboardingFlow extends StatefulWidget {
  const OnboardingFlow({super.key});

  @override
  State<OnboardingFlow> createState() => _OnboardingFlowState();
}

class _OnboardingFlowState extends State<OnboardingFlow>
    with TickerProviderStateMixin {
  late PageController _pageController;
  late AnimationController _animationController;
  int _currentPage = 0;
  final int _totalPages = 3;
  bool _isArabic = true;

  // Mock onboarding data
  final List<Map<String, dynamic>> _onboardingData = [
    {
      "id": 1,
      "imageUrl":
          "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "titleAr": "اكتشف الوظائف المحلية",
      "titleEn": "Discover Local Jobs",
      "subtitleAr":
          "استكشف آلاف الوظائف في التكنولوجيا والرعاية الصحية والهندسة في جميع أنحاء اليمن",
      "subtitleEn":
          "Explore thousands of jobs in Technology, Healthcare, and Engineering across Yemen",
    },
    {
      "id": 2,
      "imageUrl":
          "https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "titleAr": "بحث متقدم وذكي",
      "titleEn": "Advanced Smart Search",
      "subtitleAr":
          "ابحث بالراتب بالريال اليمني أو الدولار، واختر من المدن الرئيسية مثل صنعاء وعدن وتعز",
      "subtitleEn":
          "Search by salary in YER or USD, choose from major cities like Sana'a, Aden, and Taiz",
    },
    {
      "id": 3,
      "imageUrl":
          "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "titleAr": "تتبع التطبيقات والتواصل",
      "titleEn": "Track Applications & Connect",
      "subtitleAr":
          "تابع حالة طلباتك وتواصل مع أصحاب العمل مباشرة عبر واتساب والبريد الإلكتروني",
      "subtitleEn":
          "Track your application status and connect with employers directly via WhatsApp and email",
    },
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  void _onPageChanged(int page) {
    setState(() {
      _currentPage = page;
    });
    _animationController.forward(from: 0);

    // Haptic feedback
    HapticFeedback.lightImpact();
  }

  void _nextPage() {
    if (_currentPage < _totalPages - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _navigateToRegistration();
    }
  }

  void _skipOnboarding() {
    _navigateToRegistration();
  }

  void _navigateToRegistration() {
    Navigator.pushReplacementNamed(context, '/registration-screen');
  }

  void _toggleLanguage() {
    setState(() {
      _isArabic = !_isArabic;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.lightTheme.scaffoldBackgroundColor,
      body: Stack(
        children: [
          // Background gradient
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  AppTheme.lightTheme.scaffoldBackgroundColor,
                  AppTheme.lightTheme.colorScheme.primary
                      .withValues(alpha: 0.05),
                ],
              ),
            ),
          ),

          // Main content
          Column(
            children: [
              // Top bar with language toggle
              SafeArea(
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 2.h),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Language toggle
                      TextButton.icon(
                        onPressed: _toggleLanguage,
                        icon: CustomIconWidget(
                          iconName: 'language',
                          color: AppTheme.lightTheme.colorScheme.primary,
                          size: 20,
                        ),
                        label: Text(
                          _isArabic ? 'EN' : 'عربي',
                          style: AppTheme.lightTheme.textTheme.bodyMedium
                              ?.copyWith(
                            color: AppTheme.lightTheme.colorScheme.primary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),

                      // Skip button (top right)
                      if (_currentPage < _totalPages - 1)
                        TextButton(
                          onPressed: _skipOnboarding,
                          child: Text(
                            _isArabic ? 'تخطي' : 'Skip',
                            style: AppTheme.lightTheme.textTheme.bodyMedium
                                ?.copyWith(
                              color: AppTheme.lightTheme.colorScheme.onSurface
                                  .withValues(alpha: 0.6),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        )
                      else
                        const SizedBox.shrink(),
                    ],
                  ),
                ),
              ),

              // PageView
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: _onPageChanged,
                  itemCount: _totalPages,
                  itemBuilder: (context, index) {
                    final data = _onboardingData[index];
                    return OnboardingPageWidget(
                      imageUrl: data["imageUrl"] as String,
                      title: _isArabic
                          ? (data["titleAr"] as String)
                          : (data["titleEn"] as String),
                      subtitle: _isArabic
                          ? (data["subtitleAr"] as String)
                          : (data["subtitleEn"] as String),
                      isArabic: _isArabic,
                    );
                  },
                ),
              ),

              // Page indicators
              Padding(
                padding: EdgeInsets.symmetric(vertical: 2.h),
                child: SmoothPageIndicator(
                  controller: _pageController,
                  count: _totalPages,
                  effect: WormEffect(
                    dotColor: AppTheme.lightTheme.colorScheme.primary
                        .withValues(alpha: 0.3),
                    activeDotColor: AppTheme.lightTheme.colorScheme.primary,
                    dotHeight: 1.h,
                    dotWidth: 2.w,
                    spacing: 2.w,
                  ),
                ),
              ),

              // Navigation buttons
              NavigationButtonsWidget(
                currentPage: _currentPage,
                totalPages: _totalPages,
                onNext: _nextPage,
                onSkip: _skipOnboarding,
                isArabic: _isArabic,
              ),

              SizedBox(height: 2.h),
            ],
          ),
        ],
      ),
    );
  }
}
