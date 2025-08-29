import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:sizer/sizer.dart';

import '../../core/app_export.dart';
import './widgets/category_grid_widget.dart';
import './widgets/empty_state_widget.dart';
import './widgets/featured_job_card_widget.dart';
import './widgets/job_alert_modal_widget.dart';
import './widgets/job_card_widget.dart';
import './widgets/trending_searches_widget.dart';

class JobFeedHome extends StatefulWidget {
  const JobFeedHome({Key? key}) : super(key: key);

  @override
  State<JobFeedHome> createState() => _JobFeedHomeState();
}

class _JobFeedHomeState extends State<JobFeedHome>
    with TickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();

  bool _isLoading = false;
  bool _isRefreshing = false;
  String _selectedCity = 'صنعاء';
  int _notificationCount = 3;
  int _currentBottomNavIndex = 0;

  // Mock data for featured jobs
  final List<Map<String, dynamic>> _featuredJobs = [
    {
      "id": 1,
      "title": "مطور تطبيقات موبايل - Flutter",
      "company": {
        "name": "شركة التقنية المتقدمة",
        "logo":
            "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      "location": "صنعاء، اليمن",
      "salary": "2,500 - 4,000 ر.ي",
      "type": "دوام كامل",
      "postedDate": "منذ يومين",
      "category": "التكنولوجيا والمعلومات",
      "isFeatured": true
    },
    {
      "id": 2,
      "title": "مهندس شبكات وأنظمة",
      "company": {
        "name": "مؤسسة الاتصالات اليمنية",
        "logo":
            "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      "location": "عدن، اليمن",
      "salary": "3,000 - 5,000 ر.ي",
      "type": "دوام كامل",
      "postedDate": "منذ 3 أيام",
      "category": "التكنولوجيا والمعلومات",
      "isFeatured": true
    },
    {
      "id": 3,
      "title": "طبيب أطفال",
      "company": {
        "name": "مستشفى الثورة العام",
        "logo":
            "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      "location": "تعز، اليمن",
      "salary": "4,000 - 6,000 ر.ي",
      "type": "دوام كامل",
      "postedDate": "منذ يوم واحد",
      "category": "الصحة والطب",
      "isFeatured": true
    }
  ];

  // Mock data for regular jobs
  final List<Map<String, dynamic>> _regularJobs = [
    {
      "id": 4,
      "title": "محاسب مالي",
      "company": {
        "name": "شركة الخليج للتجارة",
        "logo":
            "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      "location": "الحديدة، اليمن",
      "salary": "1,800 - 2,500 ر.ي",
      "type": "دوام كامل",
      "postedDate": "منذ 4 أيام",
      "category": "المالية والمحاسبة",
      "isFeatured": false
    },
    {
      "id": 5,
      "title": "مدرس لغة إنجليزية",
      "company": {
        "name": "معهد اللغات الحديثة",
        "logo":
            "https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      "location": "إب، اليمن",
      "salary": "1,200 - 2,000 ر.ي",
      "type": "دوام جزئي",
      "postedDate": "منذ أسبوع",
      "category": "التعليم والتدريب",
      "isFeatured": false
    },
    {
      "id": 6,
      "title": "مهندس مدني",
      "company": {
        "name": "شركة البناء والتعمير",
        "logo":
            "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      "location": "صنعاء، اليمن",
      "salary": "2,800 - 4,200 ر.ي",
      "type": "دوام كامل",
      "postedDate": "منذ 5 أيام",
      "category": "الهندسة والإنشاءات",
      "isFeatured": false
    },
    {
      "id": 7,
      "title": "مندوب مبيعات",
      "company": {
        "name": "شركة التوزيع الشاملة",
        "logo":
            "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      "location": "المكلا، اليمن",
      "salary": "1,500 - 2,200 ر.ي",
      "type": "دوام كامل",
      "postedDate": "منذ 6 أيام",
      "category": "المبيعات والتسويق",
      "isFeatured": false
    },
    {
      "id": 8,
      "title": "ممرضة مؤهلة",
      "company": {
        "name": "مركز الرعاية الصحية",
        "logo":
            "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      "location": "ذمار، اليمن",
      "salary": "1,800 - 2,800 ر.ي",
      "type": "دوام كامل",
      "postedDate": "منذ 3 أيام",
      "category": "الصحة والطب",
      "isFeatured": false
    }
  ];

  // Mock data for job categories
  final List<Map<String, dynamic>> _jobCategories = [
    {
      "id": 1,
      "name": "التكنولوجيا والمعلومات",
      "icon": "computer",
      "count": 45,
      "color": AppTheme.lightTheme.primaryColor
    },
    {
      "id": 2,
      "name": "الصحة والطب",
      "icon": "local_hospital",
      "count": 32,
      "color": AppTheme.lightTheme.colorScheme.secondary
    },
    {
      "id": 3,
      "name": "التعليم والتدريب",
      "icon": "school",
      "count": 28,
      "color": AppTheme.lightTheme.colorScheme.tertiary
    },
    {
      "id": 4,
      "name": "الهندسة والإنشاءات",
      "icon": "engineering",
      "count": 23,
      "color": Colors.orange
    },
    {
      "id": 5,
      "name": "المبيعات والتسويق",
      "icon": "trending_up",
      "count": 19,
      "color": Colors.purple
    },
    {
      "id": 6,
      "name": "المالية والمحاسبة",
      "icon": "account_balance",
      "count": 15,
      "color": Colors.teal
    }
  ];

  // Mock data for trending searches
  final List<String> _trendingSearches = [
    "مطور ويب",
    "محاسب",
    "مهندس",
    "طبيب",
    "مدرس",
    "مندوب مبيعات",
    "ممرضة",
    "مصمم جرافيك"
  ];

  final List<String> _cities = [
    'صنعاء',
    'عدن',
    'تعز',
    'الحديدة',
    'إب',
    'المكلا',
    'ذمار',
    'صعدة'
  ];

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      _loadMoreJobs();
    }
  }

  Future<void> _refreshJobs() async {
    setState(() {
      _isRefreshing = true;
    });

    // Simulate API call
    await Future.delayed(Duration(seconds: 2));

    setState(() {
      _isRefreshing = false;
    });

    Fluttertoast.showToast(
      msg: "تم تحديث الوظائف بنجاح",
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
    );
  }

  Future<void> _loadMoreJobs() async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    // Simulate API call
    await Future.delayed(Duration(seconds: 1));

    setState(() {
      _isLoading = false;
    });
  }

  void _onJobTap(Map<String, dynamic> job) {
    Fluttertoast.showToast(
      msg: "فتح تفاصيل الوظيفة: ${job['title']}",
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
    );
  }

  void _onSaveJob(Map<String, dynamic> job) {
    Fluttertoast.showToast(
      msg: "تم حفظ الوظيفة: ${job['title']}",
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
    );
  }

  void _onShareJob(Map<String, dynamic> job) {
    Fluttertoast.showToast(
      msg: "مشاركة الوظيفة: ${job['title']}",
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
    );
  }

  void _onSimilarJobs(Map<String, dynamic> job) {
    Fluttertoast.showToast(
      msg: "البحث عن وظائف مشابهة لـ: ${job['title']}",
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
    );
  }

  void _onCategoryTap(Map<String, dynamic> category) {
    Fluttertoast.showToast(
      msg: "فتح فئة: ${category['name']}",
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
    );
  }

  void _onTrendingSearchTap(String search) {
    _searchController.text = search;
    Fluttertoast.showToast(
      msg: "البحث عن: $search",
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
    );
  }

  void _showJobAlertModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: JobAlertModalWidget(
          onCreateAlert: (alertData) {
            Fluttertoast.showToast(
              msg: "تم إنشاء تنبيه وظيفي جديد",
              toastLength: Toast.LENGTH_SHORT,
              gravity: ToastGravity.BOTTOM,
            );
          },
        ),
      ),
    );
  }

  void _onBottomNavTap(int index) {
    setState(() {
      _currentBottomNavIndex = index;
    });

    switch (index) {
      case 0:
        // Already on home
        break;
      case 1:
        Fluttertoast.showToast(msg: "البحث");
        break;
      case 2:
        Fluttertoast.showToast(msg: "طلباتي");
        break;
      case 3:
        Fluttertoast.showToast(msg: "الملف الشخصي");
        break;
    }
  }

  Widget _buildHeader() {
    return Container(
      padding: EdgeInsets.fromLTRB(4.w, 6.h, 4.w, 2.h),
      decoration: BoxDecoration(
        color: AppTheme.lightTheme.cardColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: SafeArea(
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 10.w,
                      height: 10.w,
                      decoration: BoxDecoration(
                        color: AppTheme.lightTheme.primaryColor,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Center(
                        child: Text(
                          'ي',
                          style: AppTheme.lightTheme.textTheme.titleMedium
                              ?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(width: 3.w),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'وظائف اليمن',
                          style: AppTheme.lightTheme.textTheme.titleMedium
                              ?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        GestureDetector(
                          onTap: () => _showCitySelector(),
                          child: Row(
                            children: [
                              CustomIconWidget(
                                iconName: 'location_on',
                                color: AppTheme
                                    .lightTheme.colorScheme.onSurfaceVariant,
                                size: 16,
                              ),
                              SizedBox(width: 1.w),
                              Text(
                                _selectedCity,
                                style: AppTheme.lightTheme.textTheme.bodySmall
                                    ?.copyWith(
                                  color: AppTheme
                                      .lightTheme.colorScheme.onSurfaceVariant,
                                ),
                              ),
                              SizedBox(width: 1.w),
                              CustomIconWidget(
                                iconName: 'keyboard_arrow_down',
                                color: AppTheme
                                    .lightTheme.colorScheme.onSurfaceVariant,
                                size: 16,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                Stack(
                  children: [
                    IconButton(
                      onPressed: () {
                        setState(() {
                          _notificationCount = 0;
                        });
                        Fluttertoast.showToast(msg: "الإشعارات");
                      },
                      icon: CustomIconWidget(
                        iconName: 'notifications',
                        color: AppTheme.lightTheme.colorScheme.onSurface,
                        size: 24,
                      ),
                    ),
                    if (_notificationCount > 0)
                      Positioned(
                        right: 8,
                        top: 8,
                        child: Container(
                          padding: EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: AppTheme.lightTheme.colorScheme.tertiary,
                            shape: BoxShape.circle,
                          ),
                          constraints: BoxConstraints(
                            minWidth: 16,
                            minHeight: 16,
                          ),
                          child: Text(
                            '$_notificationCount',
                            style: AppTheme.lightTheme.textTheme.labelSmall
                                ?.copyWith(
                              color: Colors.white,
                              fontSize: 10,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                  ],
                ),
              ],
            ),
            SizedBox(height: 2.h),
            Container(
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.scaffoldBackgroundColor,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppTheme.lightTheme.colorScheme.outline
                      .withValues(alpha: 0.2),
                ),
              ),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'ابحث عن وظيفة...',
                  prefixIcon: CustomIconWidget(
                    iconName: 'search',
                    color: AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                    size: 20,
                  ),
                  suffixIcon: IconButton(
                    onPressed: () {
                      Fluttertoast.showToast(msg: "فلترة النتائج");
                    },
                    icon: CustomIconWidget(
                      iconName: 'tune',
                      color: AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                      size: 20,
                    ),
                  ),
                  border: InputBorder.none,
                  contentPadding:
                      EdgeInsets.symmetric(horizontal: 4.w, vertical: 2.h),
                ),
                onSubmitted: (value) {
                  if (value.isNotEmpty) {
                    Fluttertoast.showToast(msg: "البحث عن: $value");
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showCitySelector() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: EdgeInsets.all(4.w),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'اختر المدينة',
              style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 2.h),
            ...(_cities
                .map((city) => ListTile(
                      title: Text(city),
                      leading: CustomIconWidget(
                        iconName: 'location_on',
                        color: city == _selectedCity
                            ? AppTheme.lightTheme.primaryColor
                            : AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                        size: 20,
                      ),
                      trailing: city == _selectedCity
                          ? CustomIconWidget(
                              iconName: 'check',
                              color: AppTheme.lightTheme.primaryColor,
                              size: 20,
                            )
                          : null,
                      onTap: () {
                        setState(() {
                          _selectedCity = city;
                        });
                        Navigator.pop(context);
                      },
                    ))
                .toList()),
            SizedBox(height: 2.h),
          ],
        ),
      ),
    );
  }

  Widget _buildFeaturedJobsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 4.w),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'الوظائف المميزة',
                style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () {
                  Fluttertoast.showToast(msg: "عرض جميع الوظائف المميزة");
                },
                child: Text('عرض الكل'),
              ),
            ],
          ),
        ),
        SizedBox(height: 2.h),
        SizedBox(
          height: 25.h,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.only(right: 4.w),
            itemCount: _featuredJobs.length,
            itemBuilder: (context, index) {
              final job = _featuredJobs[index];
              return FeaturedJobCardWidget(
                jobData: job,
                onTap: () => _onJobTap(job),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildJobsList() {
    if (_regularJobs.isEmpty) {
      return EmptyStateWidget(
        title: 'لا توجد وظائف متاحة',
        subtitle:
            'لم نجد أي وظائف تطابق معاييرك. جرب البحث بكلمات مختلفة أو قم بإنشاء تنبيه وظيفي.',
        buttonText: 'إنشاء تنبيه وظيفي',
        onButtonPressed: _showJobAlertModal,
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 4.w),
          child: Text(
            'أحدث الوظائف',
            style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        SizedBox(height: 2.h),
        ListView.builder(
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),
          itemCount: _regularJobs.length + (_isLoading ? 1 : 0),
          itemBuilder: (context, index) {
            if (index == _regularJobs.length) {
              return Container(
                padding: EdgeInsets.all(4.w),
                child: Center(
                  child: CircularProgressIndicator(),
                ),
              );
            }

            final job = _regularJobs[index];
            return JobCardWidget(
              jobData: job,
              onTap: () => _onJobTap(job),
              onSave: () => _onSaveJob(job),
              onShare: () => _onShareJob(job),
              onSimilar: () => _onSimilarJobs(job),
            );
          },
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: AppTheme.lightTheme.scaffoldBackgroundColor,
        body: RefreshIndicator(
          onRefresh: _refreshJobs,
          child: CustomScrollView(
            controller: _scrollController,
            slivers: [
              SliverToBoxAdapter(child: _buildHeader()),
              SliverToBoxAdapter(child: SizedBox(height: 3.h)),
              SliverToBoxAdapter(child: _buildFeaturedJobsSection()),
              SliverToBoxAdapter(child: SizedBox(height: 4.h)),
              SliverToBoxAdapter(
                child: CategoryGridWidget(
                  categories: _jobCategories,
                  onCategoryTap: _onCategoryTap,
                ),
              ),
              SliverToBoxAdapter(child: SizedBox(height: 4.h)),
              SliverToBoxAdapter(
                child: TrendingSearchesWidget(
                  trendingSearches: _trendingSearches,
                  onSearchTap: _onTrendingSearchTap,
                ),
              ),
              SliverToBoxAdapter(child: SizedBox(height: 4.h)),
              SliverToBoxAdapter(child: _buildJobsList()),
              SliverToBoxAdapter(child: SizedBox(height: 10.h)),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton.extended(
          onPressed: _showJobAlertModal,
          icon: CustomIconWidget(
            iconName: 'notifications_active',
            color: Colors.white,
            size: 20,
          ),
          label: Text(
            'تنبيه وظيفي',
            style: AppTheme.lightTheme.textTheme.labelMedium?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _currentBottomNavIndex,
          onTap: _onBottomNavTap,
          type: BottomNavigationBarType.fixed,
          items: [
            BottomNavigationBarItem(
              icon: CustomIconWidget(
                iconName: 'home',
                color: _currentBottomNavIndex == 0
                    ? AppTheme.lightTheme.primaryColor
                    : AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                size: 24,
              ),
              label: 'الرئيسية',
            ),
            BottomNavigationBarItem(
              icon: CustomIconWidget(
                iconName: 'search',
                color: _currentBottomNavIndex == 1
                    ? AppTheme.lightTheme.primaryColor
                    : AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                size: 24,
              ),
              label: 'البحث',
            ),
            BottomNavigationBarItem(
              icon: CustomIconWidget(
                iconName: 'work',
                color: _currentBottomNavIndex == 2
                    ? AppTheme.lightTheme.primaryColor
                    : AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                size: 24,
              ),
              label: 'طلباتي',
            ),
            BottomNavigationBarItem(
              icon: CustomIconWidget(
                iconName: 'person',
                color: _currentBottomNavIndex == 3
                    ? AppTheme.lightTheme.primaryColor
                    : AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                size: 24,
              ),
              label: 'الملف الشخصي',
            ),
          ],
        ),
      ),
    );
  }
}
