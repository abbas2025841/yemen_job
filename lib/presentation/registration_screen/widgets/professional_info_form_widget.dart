import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';

class ProfessionalInfoFormWidget extends StatefulWidget {
  final GlobalKey<FormState> formKey;
  final String? selectedCategory;
  final String? selectedExperience;
  final List<String> selectedCities;
  final String? selectedCurrency;
  final TextEditingController salaryController;
  final Function(String?) onCategoryChanged;
  final Function(String?) onExperienceChanged;
  final Function(String, bool) onCityChanged;
  final Function(String?) onCurrencyChanged;
  final VoidCallback onContinue;
  final VoidCallback onBack;

  const ProfessionalInfoFormWidget({
    Key? key,
    required this.formKey,
    required this.selectedCategory,
    required this.selectedExperience,
    required this.selectedCities,
    required this.selectedCurrency,
    required this.salaryController,
    required this.onCategoryChanged,
    required this.onExperienceChanged,
    required this.onCityChanged,
    required this.onCurrencyChanged,
    required this.onContinue,
    required this.onBack,
  }) : super(key: key);

  @override
  State<ProfessionalInfoFormWidget> createState() =>
      _ProfessionalInfoFormWidgetState();
}

class _ProfessionalInfoFormWidgetState
    extends State<ProfessionalInfoFormWidget> {
  final List<Map<String, String>> jobCategories = [
    {"id": "tech", "name": "التكنولوجيا وتقنية المعلومات"},
    {"id": "healthcare", "name": "الرعاية الصحية والطبية"},
    {"id": "education", "name": "التعليم والتدريب"},
    {"id": "engineering", "name": "الهندسة والإنشاءات"},
    {"id": "sales", "name": "المبيعات والتسويق"},
    {"id": "finance", "name": "المالية والمحاسبة"},
    {"id": "government", "name": "الحكومة والمنظمات غير الحكومية"},
    {"id": "transport", "name": "النقل واللوجستيات"},
  ];

  final List<Map<String, String>> experienceLevels = [
    {"id": "fresh", "name": "خريج جديد"},
    {"id": "junior", "name": "1-3 سنوات"},
    {"id": "mid", "name": "3-5 سنوات"},
    {"id": "senior", "name": "5-10 سنوات"},
    {"id": "expert", "name": "أكثر من 10 سنوات"},
  ];

  final List<Map<String, String>> yemeniCities = [
    {"id": "sanaa", "name": "صنعاء"},
    {"id": "aden", "name": "عدن"},
    {"id": "taiz", "name": "تعز"},
    {"id": "hodeidah", "name": "الحديدة"},
    {"id": "ibb", "name": "إب"},
    {"id": "mukalla", "name": "المكلا"},
    {"id": "dhamar", "name": "ذمار"},
    {"id": "saada", "name": "صعدة"},
  ];

  final List<Map<String, String>> currencies = [
    {"id": "yer", "name": "ريال يمني", "symbol": "ر.ي"},
    {"id": "usd", "name": "دولار أمريكي", "symbol": "\$"},
  ];

  @override
  Widget build(BuildContext context) {
    return Form(
      key: widget.formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'المعلومات المهنية',
            style: AppTheme.lightTheme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.right,
          ),
          SizedBox(height: 3.h),

          // Job Category Dropdown
          DropdownButtonFormField<String>(
            value: widget.selectedCategory,
            decoration: InputDecoration(
              labelText: 'فئة الوظيفة',
              prefixIcon: Padding(
                padding: EdgeInsets.all(3.w),
                child: CustomIconWidget(
                  iconName: 'work',
                  color: AppTheme.lightTheme.colorScheme.primary,
                  size: 20,
                ),
              ),
            ),
            items: jobCategories.map((category) {
              return DropdownMenuItem<String>(
                value: category["id"],
                child: Text(
                  category["name"]!,
                  textAlign: TextAlign.right,
                  style: AppTheme.lightTheme.textTheme.bodyMedium,
                ),
              );
            }).toList(),
            onChanged: widget.onCategoryChanged,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'يرجى اختيار فئة الوظيفة';
              }
              return null;
            },
          ),
          SizedBox(height: 2.h),

          // Experience Level Dropdown
          DropdownButtonFormField<String>(
            value: widget.selectedExperience,
            decoration: InputDecoration(
              labelText: 'مستوى الخبرة',
              prefixIcon: Padding(
                padding: EdgeInsets.all(3.w),
                child: CustomIconWidget(
                  iconName: 'timeline',
                  color: AppTheme.lightTheme.colorScheme.primary,
                  size: 20,
                ),
              ),
            ),
            items: experienceLevels.map((level) {
              return DropdownMenuItem<String>(
                value: level["id"],
                child: Text(
                  level["name"]!,
                  textAlign: TextAlign.right,
                  style: AppTheme.lightTheme.textTheme.bodyMedium,
                ),
              );
            }).toList(),
            onChanged: widget.onExperienceChanged,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'يرجى اختيار مستوى الخبرة';
              }
              return null;
            },
          ),
          SizedBox(height: 2.h),

          // Preferred Cities
          Text(
            'المدن المفضلة للعمل',
            style: AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.right,
          ),
          SizedBox(height: 1.h),
          Container(
            padding: EdgeInsets.all(3.w),
            decoration: BoxDecoration(
              border:
                  Border.all(color: AppTheme.lightTheme.colorScheme.outline),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: yemeniCities.map((city) {
                final isSelected = widget.selectedCities.contains(city["id"]);
                return CheckboxListTile(
                  title: Text(
                    city["name"]!,
                    textAlign: TextAlign.right,
                    style: AppTheme.lightTheme.textTheme.bodyMedium,
                  ),
                  value: isSelected,
                  onChanged: (bool? value) {
                    widget.onCityChanged(city["id"]!, value ?? false);
                  },
                  controlAffinity: ListTileControlAffinity.leading,
                  contentPadding: EdgeInsets.zero,
                );
              }).toList(),
            ),
          ),
          SizedBox(height: 2.h),

          // Salary Expectations
          Row(
            children: [
              Expanded(
                flex: 2,
                child: TextFormField(
                  controller: widget.salaryController,
                  keyboardType: TextInputType.number,
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                  textAlign: TextAlign.left,
                  decoration: InputDecoration(
                    labelText: 'الراتب المتوقع',
                    prefixIcon: Padding(
                      padding: EdgeInsets.all(3.w),
                      child: CustomIconWidget(
                        iconName: 'attach_money',
                        color: AppTheme.lightTheme.colorScheme.primary,
                        size: 20,
                      ),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'الراتب المتوقع مطلوب';
                    }
                    return null;
                  },
                ),
              ),
              SizedBox(width: 2.w),
              Expanded(
                flex: 1,
                child: DropdownButtonFormField<String>(
                  value: widget.selectedCurrency,
                  decoration: InputDecoration(
                    labelText: 'العملة',
                  ),
                  items: currencies.map((currency) {
                    return DropdownMenuItem<String>(
                      value: currency["id"],
                      child: Text(
                        currency["symbol"]!,
                        style: AppTheme.lightTheme.textTheme.bodyMedium,
                      ),
                    );
                  }).toList(),
                  onChanged: widget.onCurrencyChanged,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'العملة مطلوبة';
                    }
                    return null;
                  },
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
                  onPressed: () {
                    if (widget.formKey.currentState?.validate() ?? false) {
                      if (widget.selectedCities.isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('يرجى اختيار مدينة واحدة على الأقل'),
                            backgroundColor:
                                AppTheme.lightTheme.colorScheme.error,
                          ),
                        );
                        return;
                      }
                      HapticFeedback.lightImpact();
                      widget.onContinue();
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.lightTheme.colorScheme.secondary,
                    foregroundColor:
                        AppTheme.lightTheme.colorScheme.onSecondary,
                    padding: EdgeInsets.symmetric(vertical: 2.h),
                  ),
                  child: Text(
                    'متابعة',
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
