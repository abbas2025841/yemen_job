import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sizer/sizer.dart';

import '../../core/app_export.dart';
import '../../theme/app_theme.dart';
import './widgets/app_logo_widget.dart';
import './widgets/login_form_widget.dart';
import './widgets/register_link_widget.dart';
import './widgets/social_login_widget.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _isLoading = false;

  // Mock credentials for testing
  final Map<String, String> _mockCredentials = {
    'admin@yemenjob.com': 'admin123',
    'user@yemenjob.com': 'user123',
    'employer@yemenjob.com': 'employer123',
    '+967771234567': 'mobile123',
  };

  @override
  void initState() {
    super.initState();
    // Set status bar style
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
      ),
    );
  }

  Future<void> _handleLogin(String email, String password) async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate network delay
      await Future.delayed(Duration(seconds: 2));

      // Check mock credentials
      if (_mockCredentials.containsKey(email) &&
          _mockCredentials[email] == password) {
        // Success haptic feedback
        HapticFeedback.lightImpact();

        // Navigate to job feed home
        Navigator.pushNamedAndRemoveUntil(
          context,
          '/job-feed-home',
          (route) => false,
        );
      } else {
        // Show error message
        _showErrorMessage('بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.');
      }
    } catch (e) {
      _showErrorMessage('حدث خطأ في الاتصال. يرجى المحاولة لاحقاً.');
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _handleGoogleLogin() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate Google login process
      await Future.delayed(Duration(seconds: 2));

      // Success haptic feedback
      HapticFeedback.lightImpact();

      // Navigate to job feed home
      Navigator.pushNamedAndRemoveUntil(
        context,
        '/job-feed-home',
        (route) => false,
      );
    } catch (e) {
      _showErrorMessage(
          'فشل في تسجيل الدخول باستخدام Google. يرجى المحاولة لاحقاً.');
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _handleAppleLogin() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate Apple login process
      await Future.delayed(Duration(seconds: 2));

      // Success haptic feedback
      HapticFeedback.lightImpact();

      // Navigate to job feed home
      Navigator.pushNamedAndRemoveUntil(
        context,
        '/job-feed-home',
        (route) => false,
      );
    } catch (e) {
      _showErrorMessage(
          'فشل في تسجيل الدخول باستخدام Apple. يرجى المحاولة لاحقاً.');
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _showErrorMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
            color: Colors.white,
          ),
        ),
        backgroundColor: AppTheme.errorLight,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(3.w),
        ),
        margin: EdgeInsets.all(4.w),
        duration: Duration(seconds: 4),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: AppTheme.lightTheme.scaffoldBackgroundColor,
        body: SafeArea(
          child: SingleChildScrollView(
            physics: BouncingScrollPhysics(),
            child: ConstrainedBox(
              constraints: BoxConstraints(
                minHeight: MediaQuery.of(context).size.height -
                    MediaQuery.of(context).padding.top -
                    MediaQuery.of(context).padding.bottom,
              ),
              child: IntrinsicHeight(
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 6.w),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      SizedBox(height: 4.h),

                      // App Logo Section
                      AppLogoWidget(),
                      SizedBox(height: 6.h),

                      // Login Form Section
                      LoginFormWidget(
                        onLogin: _handleLogin,
                        isLoading: _isLoading,
                      ),
                      SizedBox(height: 4.h),

                      // Social Login Section
                      SocialLoginWidget(
                        onGoogleLogin: _handleGoogleLogin,
                        onAppleLogin: _handleAppleLogin,
                        isLoading: _isLoading,
                      ),

                      // Spacer to push register link to bottom
                      Spacer(),

                      // Register Link Section
                      RegisterLinkWidget(
                        isLoading: _isLoading,
                      ),
                      SizedBox(height: 2.h),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
