import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';

class JobAlertModalWidget extends StatefulWidget {
  final Function(Map<String, dynamic>)? onCreateAlert;

  const JobAlertModalWidget({
    Key? key,
    this.onCreateAlert,
  }) : super(key: key);

  @override
  State<JobAlertModalWidget> createState() => _JobAlertModalWidgetState();
}

class _JobAlertModalWidgetState extends State<JobAlertModalWidget> {
  final TextEditingController _keywordsController = TextEditingController();
  String _selectedLocation = 'جميع المدن';
  String _selectedCategory = 'جميع الفئات';
  String _selectedJobType = 'جميع الأنواع';
  double _minSalary = 0;
  double _maxSalary = 10000;

  final List<String> _locations = [
    'جميع المدن',
    'صنعاء',
    'عدن',
    'تعز',
    'الحديدة',
    'إب',
    'المكلا',
    'ذمار',
    'صعدة'
  ];

  final List<String> _categories = [
    'جميع الفئات',
    'التكنولوجيا والمعلومات',
    'الصحة والطب',
    'التعليم والتدريب',
    'الهندسة والإنشاءات',
    'المبيعات والتسويق',
    'المالية والمحاسبة',
    'الحكومة والمنظمات',
    'النقل واللوجستيات'
  ];

  final List<String> _jobTypes = [
    'جميع الأنواع',
    'دوام كامل',
    'دوام جزئي',
    'عقد مؤقت',
    'عمل حر',
    'تدريب'
  ];

  @override
  void dispose() {
    _keywordsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(4.w),
      decoration: BoxDecoration(
        color: AppTheme.lightTheme.cardColor,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'إنشاء تنبيه وظيفي',
                style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              IconButton(
                onPressed: () => Navigator.pop(context),
                icon: CustomIconWidget(
                  iconName: 'close',
                  color: AppTheme.lightTheme.colorScheme.onSurface,
                  size: 24,
                ),
              ),
            ],
          ),
          SizedBox(height: 3.h),
          TextField(
            controller: _keywordsController,
            decoration: InputDecoration(
              labelText: 'الكلمات المفتاحية',
              hintText: 'مثل: مطور، مهندس، محاسب',
              prefixIcon: CustomIconWidget(
                iconName: 'search',
                color: AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                size: 20,
              ),
            ),
          ),
          SizedBox(height: 2.h),
          DropdownButtonFormField<String>(
            value: _selectedLocation,
            decoration: InputDecoration(
              labelText: 'الموقع',
              prefixIcon: CustomIconWidget(
                iconName: 'location_on',
                color: AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                size: 20,
              ),
            ),
            items: _locations.map((location) {
              return DropdownMenuItem(
                value: location,
                child: Text(location),
              );
            }).toList(),
            onChanged: (value) {
              setState(() {
                _selectedLocation = value!;
              });
            },
          ),
          SizedBox(height: 2.h),
          DropdownButtonFormField<String>(
            value: _selectedCategory,
            decoration: InputDecoration(
              labelText: 'الفئة',
              prefixIcon: CustomIconWidget(
                iconName: 'category',
                color: AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                size: 20,
              ),
            ),
            items: _categories.map((category) {
              return DropdownMenuItem(
                value: category,
                child: Text(category),
              );
            }).toList(),
            onChanged: (value) {
              setState(() {
                _selectedCategory = value!;
              });
            },
          ),
          SizedBox(height: 2.h),
          DropdownButtonFormField<String>(
            value: _selectedJobType,
            decoration: InputDecoration(
              labelText: 'نوع الوظيفة',
              prefixIcon: CustomIconWidget(
                iconName: 'work',
                color: AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                size: 20,
              ),
            ),
            items: _jobTypes.map((type) {
              return DropdownMenuItem(
                value: type,
                child: Text(type),
              );
            }).toList(),
            onChanged: (value) {
              setState(() {
                _selectedJobType = value!;
              });
            },
          ),
          SizedBox(height: 3.h),
          Text(
            'نطاق الراتب (ريال يمني)',
            style: AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          SizedBox(height: 1.h),
          RangeSlider(
            values: RangeValues(_minSalary, _maxSalary),
            min: 0,
            max: 10000,
            divisions: 100,
            labels: RangeLabels(
              '${_minSalary.round()} ر.ي',
              '${_maxSalary.round()} ر.ي',
            ),
            onChanged: (values) {
              setState(() {
                _minSalary = values.start;
                _maxSalary = values.end;
              });
            },
          ),
          SizedBox(height: 4.h),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text('إلغاء'),
                ),
              ),
              SizedBox(width: 4.w),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    final alertData = {
                      'keywords': _keywordsController.text,
                      'location': _selectedLocation,
                      'category': _selectedCategory,
                      'jobType': _selectedJobType,
                      'minSalary': _minSalary,
                      'maxSalary': _maxSalary,
                      'createdAt': DateTime.now(),
                    };
                    widget.onCreateAlert?.call(alertData);
                    Navigator.pop(context);
                  },
                  child: Text('إنشاء التنبيه'),
                ),
              ),
            ],
          ),
          SizedBox(height: 2.h),
        ],
      ),
    );
  }
}
