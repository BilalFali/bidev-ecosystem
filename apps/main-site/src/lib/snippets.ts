export interface Snippet {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  code: string;
  language: "dart" | "yaml" | "json";
  author?: string;
}

export const SNIPPET_CATEGORIES = [
  "All",
  "Clean Architecture",
  "State Management",
  "Navigation",
  "HTTP & APIs",
  "Firebase",
  "UI & Widgets",
  "Utils & Extensions",
];

export const SNIPPETS: Snippet[] = [
  // ── Clean Architecture ──────────────────────────────────────────────────
  {
    slug: "use-case-base-class",
    title: "UseCase Base Class",
    description: "Abstract base class for use cases following Clean Architecture. Handles single input/output with Either for error handling.",
    category: "Clean Architecture",
    tags: ["clean-architecture", "use-case", "either"],
    difficulty: "intermediate",
    language: "dart",
    code: `import 'package:dartz/dartz.dart';

abstract class UseCase<Type, Params> {
  Future<Either<Failure, Type>> call(Params params);
}

// For use cases with no parameters
class NoParams {
  const NoParams();
}

// Example Failure class
abstract class Failure {
  final String message;
  const Failure(this.message);
}

class ServerFailure extends Failure {
  const ServerFailure([super.message = 'Server error occurred']);
}

class CacheFailure extends Failure {
  const CacheFailure([super.message = 'Cache error occurred']);
}`,
  },
  {
    slug: "repository-pattern",
    title: "Repository Pattern",
    description: "Clean Architecture repository with abstract interface and implementation. Handles network/cache strategy.",
    category: "Clean Architecture",
    tags: ["clean-architecture", "repository", "pattern"],
    difficulty: "intermediate",
    language: "dart",
    code: `// Domain layer – abstract
abstract class UserRepository {
  Future<Either<Failure, User>> getUser(String id);
  Future<Either<Failure, List<User>>> getUsers();
}

// Data layer – implementation
class UserRepositoryImpl implements UserRepository {
  final UserRemoteDataSource remoteDataSource;
  final UserLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  const UserRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, User>> getUser(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await remoteDataSource.getUser(id);
        await localDataSource.cacheUser(user);
        return Right(user.toDomain());
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      }
    } else {
      try {
        final user = await localDataSource.getCachedUser(id);
        return Right(user.toDomain());
      } on CacheException {
        return const Left(CacheFailure());
      }
    }
  }

  @override
  Future<Either<Failure, List<User>>> getUsers() async {
    // similar pattern...
    throw UnimplementedError();
  }
}`,
  },
  // ── State Management ────────────────────────────────────────────────────
  {
    slug: "cubit-template",
    title: "Cubit Template",
    description: "Complete Cubit pattern with states. Best practice for simple BLoC-lite state management.",
    category: "State Management",
    tags: ["bloc", "cubit", "state-management"],
    difficulty: "beginner",
    language: "dart",
    code: `import 'package:flutter_bloc/flutter_bloc.dart';

// States
sealed class CounterState {}
class CounterInitial extends CounterState {}
class CounterLoading extends CounterState {}
class CounterLoaded extends CounterState {
  final int count;
  CounterLoaded(this.count);
}
class CounterError extends CounterState {
  final String message;
  CounterError(this.message);
}

// Cubit
class CounterCubit extends Cubit<CounterState> {
  CounterCubit() : super(CounterInitial());

  void increment() {
    final current = state;
    if (current is CounterLoaded) {
      emit(CounterLoaded(current.count + 1));
    }
  }

  Future<void> load() async {
    emit(CounterLoading());
    try {
      await Future.delayed(const Duration(seconds: 1));
      emit(CounterLoaded(0));
    } catch (e) {
      emit(CounterError(e.toString()));
    }
  }
}

// Usage in widget
class CounterPage extends StatelessWidget {
  const CounterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => CounterCubit()..load(),
      child: BlocBuilder<CounterCubit, CounterState>(
        builder: (context, state) {
          return switch (state) {
            CounterInitial() => const CircularProgressIndicator(),
            CounterLoading() => const CircularProgressIndicator(),
            CounterLoaded(:final count) => Text('Count: \$count'),
            CounterError(:final message) => Text('Error: \$message'),
          };
        },
      ),
    );
  }
}`,
  },
  {
    slug: "getx-controller",
    title: "GetX Controller Template",
    description: "Production-ready GetX controller with reactive state, lifecycle hooks, and dependency injection.",
    category: "State Management",
    tags: ["getx", "state-management", "reactive"],
    difficulty: "beginner",
    language: "dart",
    code: `import 'package:get/get.dart';

class ProductController extends GetxController {
  // Reactive state
  final products = <Product>[].obs;
  final isLoading = false.obs;
  final error = ''.obs;
  final selectedProduct = Rxn<Product>();

  // Dependencies
  late final ProductRepository _repository;

  @override
  void onInit() {
    super.onInit();
    _repository = Get.find<ProductRepository>();
    fetchProducts();
  }

  @override
  void onClose() {
    // Cleanup subscriptions, timers etc.
    super.onClose();
  }

  Future<void> fetchProducts() async {
    isLoading.value = true;
    error.value = '';
    try {
      products.value = await _repository.getProducts();
    } catch (e) {
      error.value = e.toString();
    } finally {
      isLoading.value = false;
    }
  }

  void selectProduct(Product product) {
    selectedProduct.value = product;
  }

  void clearSelection() => selectedProduct.value = null;
}

// Usage in widget
class ProductsPage extends GetView<ProductController> {
  const ProductsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Obx(() {
        if (controller.isLoading.value) return const Center(child: CircularProgressIndicator());
        if (controller.error.value.isNotEmpty) return Center(child: Text(controller.error.value));
        return ListView.builder(
          itemCount: controller.products.length,
          itemBuilder: (_, i) => ListTile(title: Text(controller.products[i].name)),
        );
      }),
    );
  }
}`,
  },
  {
    slug: "riverpod-async-notifier",
    title: "Riverpod AsyncNotifier",
    description: "Modern Riverpod 2.x AsyncNotifier pattern for async state management with codegen-ready syntax.",
    category: "State Management",
    tags: ["riverpod", "state-management", "async"],
    difficulty: "intermediate",
    language: "dart",
    code: `import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'user_provider.g.dart';

@riverpod
class UserNotifier extends _\$UserNotifier {
  @override
  Future<User> build(String userId) async {
    return _fetchUser(userId);
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _fetchUser(ref.read(userIdProvider)));
  }

  Future<void> updateName(String newName) async {
    final current = state.valueOrNull;
    if (current == null) return;

    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final updated = await ref.read(userRepositoryProvider).updateName(current.id, newName);
      return updated;
    });
  }

  Future<User> _fetchUser(String id) {
    return ref.read(userRepositoryProvider).getUser(id);
  }
}

// Simple provider
@riverpod
Future<List<Post>> userPosts(Ref ref, String userId) async {
  final user = await ref.watch(userNotifierProvider(userId).future);
  return ref.read(postRepositoryProvider).getPostsByUser(user.id);
}

// Usage
class UserPage extends ConsumerWidget {
  const UserPage({super.key, required this.userId});
  final String userId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userNotifierProvider(userId));
    return userAsync.when(
      data: (user) => Text(user.name),
      loading: () => const CircularProgressIndicator(),
      error: (err, _) => Text('Error: \$err'),
    );
  }
}`,
  },
  // ── Navigation ──────────────────────────────────────────────────────────
  {
    slug: "go-router-setup",
    title: "GoRouter Setup",
    description: "Complete GoRouter configuration with nested routes, redirects, and route guards.",
    category: "Navigation",
    tags: ["go-router", "navigation", "routing"],
    difficulty: "intermediate",
    language: "dart",
    code: `import 'package:go_router/go_router.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  debugLogDiagnostics: true,
  redirect: (context, state) {
    final isLoggedIn = AuthService.isLoggedIn;
    final isLoginRoute = state.matchedLocation == '/login';

    if (!isLoggedIn && !isLoginRoute) return '/login';
    if (isLoggedIn && isLoginRoute) return '/';
    return null;
  },
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginPage(),
    ),
    ShellRoute(
      builder: (context, state, child) => AppShell(child: child),
      routes: [
        GoRoute(
          path: '/dashboard',
          builder: (context, state) => const DashboardPage(),
          routes: [
            GoRoute(
              path: 'settings',
              builder: (context, state) => const SettingsPage(),
            ),
          ],
        ),
        GoRoute(
          path: '/profile/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return ProfilePage(userId: id);
          },
        ),
      ],
    ),
  ],
  errorBuilder: (context, state) => ErrorPage(error: state.error),
);

// Navigation helpers
extension AppNavigation on BuildContext {
  void goHome() => go('/');
  void goLogin() => go('/login');
  void goDashboard() => go('/dashboard');
  void goProfile(String id) => go('/profile/\$id');
  void pushSettings() => push('/dashboard/settings');
}`,
  },
  // ── HTTP & APIs ──────────────────────────────────────────────────────────
  {
    slug: "dio-service",
    title: "Dio API Service",
    description: "Production-ready Dio HTTP client with interceptors, token refresh, and error handling.",
    category: "HTTP & APIs",
    tags: ["dio", "http", "api", "interceptors"],
    difficulty: "intermediate",
    language: "dart",
    code: `import 'package:dio/dio.dart';

class ApiService {
  static const _baseUrl = 'https://api.example.com/v1';

  late final Dio _dio;

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: _baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 15),
      headers: {'Content-Type': 'application/json'},
    ))
      ..interceptors.addAll([
        _AuthInterceptor(),
        _LoggingInterceptor(),
        _RetryInterceptor(dio: _dio),
      ]);
  }

  Future<T> get<T>(String path, {Map<String, dynamic>? params, required T Function(dynamic) fromJson}) async {
    try {
      final response = await _dio.get(path, queryParameters: params);
      return fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<T> post<T>(String path, {required Map<String, dynamic> data, required T Function(dynamic) fromJson}) async {
    try {
      final response = await _dio.post(path, data: data);
      return fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Exception _handleError(DioException e) {
    return switch (e.type) {
      DioExceptionType.connectionTimeout => const TimeoutException(),
      DioExceptionType.receiveTimeout => const TimeoutException(),
      DioExceptionType.badResponse => switch (e.response?.statusCode) {
          401 => const UnauthorizedException(),
          403 => const ForbiddenException(),
          404 => const NotFoundException(),
          _ => ServerException(e.response?.statusCode ?? 500),
        },
      _ => const NetworkException(),
    };
  }
}

class _AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = TokenStorage.read();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer \$token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      try {
        await AuthService.refreshToken();
        final retryOptions = err.requestOptions;
        retryOptions.headers['Authorization'] = 'Bearer \${TokenStorage.read()}';
        final response = await Dio().fetch(retryOptions);
        handler.resolve(response);
        return;
      } catch (_) {
        AuthService.logout();
      }
    }
    handler.next(err);
  }
}`,
  },
  // ── Firebase ─────────────────────────────────────────────────────────────
  {
    slug: "firestore-crud",
    title: "Firestore CRUD Operations",
    description: "Type-safe Firestore repository with CRUD, real-time streams, and pagination.",
    category: "Firebase",
    tags: ["firebase", "firestore", "crud", "streams"],
    difficulty: "intermediate",
    language: "dart",
    code: `import 'package:cloud_firestore/cloud_firestore.dart';

class FirestoreRepository<T> {
  final CollectionReference collection;
  final T Function(Map<String, dynamic> data, String id) fromFirestore;
  final Map<String, dynamic> Function(T item) toFirestore;

  FirestoreRepository({
    required String collectionPath,
    required this.fromFirestore,
    required this.toFirestore,
  }) : collection = FirebaseFirestore.instance.collection(collectionPath);

  // Create
  Future<String> add(T item) async {
    final ref = await collection.add(toFirestore(item));
    return ref.id;
  }

  Future<void> set(String id, T item) async {
    await collection.doc(id).set(toFirestore(item));
  }

  // Read
  Future<T?> get(String id) async {
    final doc = await collection.doc(id).get();
    if (!doc.exists) return null;
    return fromFirestore(doc.data() as Map<String, dynamic>, doc.id);
  }

  Future<List<T>> getAll({int limit = 20}) async {
    final snapshot = await collection.limit(limit).get();
    return snapshot.docs
        .map((d) => fromFirestore(d.data() as Map<String, dynamic>, d.id))
        .toList();
  }

  // Stream (real-time)
  Stream<List<T>> stream({Query Function(Query q)? query}) {
    final q = query?.call(collection) ?? collection;
    return q.snapshots().map(
      (snapshot) => snapshot.docs
          .map((d) => fromFirestore(d.data() as Map<String, dynamic>, d.id))
          .toList(),
    );
  }

  // Update
  Future<void> update(String id, Map<String, dynamic> data) async {
    await collection.doc(id).update(data);
  }

  // Delete
  Future<void> delete(String id) async {
    await collection.doc(id).delete();
  }
}

// Usage example
final postsRepo = FirestoreRepository<Post>(
  collectionPath: 'posts',
  fromFirestore: (data, id) => Post.fromFirestore(data, id),
  toFirestore: (post) => post.toFirestore(),
);

// Real-time stream in widget
StreamBuilder<List<Post>>(
  stream: postsRepo.stream(
    query: (q) => q.where('published', isEqualTo: true).orderBy('createdAt', descending: true),
  ),
  builder: (context, snapshot) {
    if (snapshot.hasError) return Text('Error: \${snapshot.error}');
    if (!snapshot.hasData) return const CircularProgressIndicator();
    return ListView.builder(
      itemCount: snapshot.data!.length,
      itemBuilder: (_, i) => PostCard(post: snapshot.data![i]),
    );
  },
)`,
  },
  // ── UI & Widgets ─────────────────────────────────────────────────────────
  {
    slug: "responsive-builder",
    title: "Responsive Layout Builder",
    description: "Layout builder that adapts to screen size. Returns different widgets for mobile, tablet, and desktop.",
    category: "UI & Widgets",
    tags: ["responsive", "layout", "adaptive"],
    difficulty: "beginner",
    language: "dart",
    code: `enum ScreenSize { mobile, tablet, desktop }

extension ScreenSizeExtension on BuildContext {
  double get screenWidth => MediaQuery.of(this).size.width;

  ScreenSize get screenSize {
    final width = screenWidth;
    if (width < 600) return ScreenSize.mobile;
    if (width < 1024) return ScreenSize.tablet;
    return ScreenSize.desktop;
  }

  bool get isMobile  => screenSize == ScreenSize.mobile;
  bool get isTablet  => screenSize == ScreenSize.tablet;
  bool get isDesktop => screenSize == ScreenSize.desktop;
}

class Responsive extends StatelessWidget {
  const Responsive({
    super.key,
    required this.mobile,
    this.tablet,
    this.desktop,
  });

  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;

  @override
  Widget build(BuildContext context) {
    return switch (context.screenSize) {
      ScreenSize.desktop => desktop ?? tablet ?? mobile,
      ScreenSize.tablet  => tablet ?? mobile,
      ScreenSize.mobile  => mobile,
    };
  }
}

// Usage
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Responsive(
        mobile: const MobileLayout(),
        tablet: const TabletLayout(),
        desktop: const DesktopLayout(),
      ),
    );
  }
}`,
  },
  {
    slug: "custom-loading-overlay",
    title: "Loading Overlay",
    description: "Reusable loading overlay widget that blocks interactions while async operations run.",
    category: "UI & Widgets",
    tags: ["loading", "overlay", "ux"],
    difficulty: "beginner",
    language: "dart",
    code: `class LoadingOverlay extends StatelessWidget {
  const LoadingOverlay({
    super.key,
    required this.isLoading,
    required this.child,
    this.message,
    this.opacity = 0.5,
  });

  final bool isLoading;
  final Widget child;
  final String? message;
  final double opacity;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          Positioned.fill(
            child: IgnorePointer(
              child: AnimatedOpacity(
                opacity: isLoading ? 1.0 : 0.0,
                duration: const Duration(milliseconds: 200),
                child: Container(
                  color: Colors.black.withOpacity(opacity),
                  child: Center(
                    child: Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.surface,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const CircularProgressIndicator(),
                          if (message != null) ...[
                            const SizedBox(height: 12),
                            Text(message!, style: Theme.of(context).textTheme.bodyMedium),
                          ],
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

// Usage
LoadingOverlay(
  isLoading: controller.isLoading,
  message: 'Saving...',
  child: YourPageContent(),
)`,
  },
  // ── Utils & Extensions ────────────────────────────────────────────────────
  {
    slug: "string-extensions",
    title: "Dart String Extensions",
    description: "Commonly needed String extension methods for Flutter apps — capitalization, truncation, validation, and more.",
    category: "Utils & Extensions",
    tags: ["extensions", "string", "utils"],
    difficulty: "beginner",
    language: "dart",
    code: `extension StringX on String {
  // Capitalize first letter
  String get capitalize => isEmpty ? this : '\${this[0].toUpperCase()}\${substring(1)}';

  // Title case every word
  String get titleCase => split(' ').map((w) => w.capitalize).join(' ');

  // Truncate with ellipsis
  String truncate(int maxLength, {String ellipsis = '...'}) {
    if (length <= maxLength) return this;
    return '\${substring(0, maxLength - ellipsis.length)}\$ellipsis';
  }

  // Validation
  bool get isValidEmail {
    return RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$').hasMatch(this);
  }

  bool get isValidUrl {
    return RegExp(r'^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b').hasMatch(this);
  }

  bool get isValidPhone => RegExp(r'^[+]?[0-9]{8,15}$').hasMatch(replaceAll(' ', ''));

  // Parsing
  int?    get toIntOrNull    => int.tryParse(this);
  double? get toDoubleOrNull => double.tryParse(this);

  // Utils
  String get removeHtml    => replaceAll(RegExp('<[^>]*>'), '');
  String get toSlug        => toLowerCase().trim().replaceAll(RegExp(r'[^a-z0-9]+'), '-');
  bool   get isBlank       => trim().isEmpty;
  bool   get isNotBlank    => !isBlank;
  String get nullIfBlank   => isBlank ? '' : this; // or return null with nullable
}

extension NullableStringX on String? {
  bool get isNullOrEmpty  => this == null || this!.isEmpty;
  bool get isNullOrBlank  => this == null || this!.isBlank;
  String get orEmpty      => this ?? '';
}

// Usage
'hello world'.titleCase;          // 'Hello World'
'bilal@bidev.dev'.isValidEmail;  // true
'Flutter is awesome!'.truncate(14); // 'Flutter is ...'
'  '.isBlank;                      // true`,
  },
  {
    slug: "datetime-extensions",
    title: "DateTime Extensions",
    description: "Useful DateTime extension methods for formatting, comparison, and humanizing timestamps in Flutter.",
    category: "Utils & Extensions",
    tags: ["extensions", "datetime", "formatting"],
    difficulty: "beginner",
    language: "dart",
    code: `import 'package:intl/intl.dart';

extension DateTimeX on DateTime {
  // Formatting
  String format(String pattern) => DateFormat(pattern).format(this);

  String get toReadable     => format('MMM d, yyyy');
  String get toReadableFull => format('MMMM d, yyyy');
  String get toTime         => format('h:mm a');
  String get toDateTime     => format('MMM d, yyyy · h:mm a');
  String get toIso8601      => toIso8601String();

  // Relative time (e.g. "2 hours ago")
  String get timeAgo {
    final now = DateTime.now();
    final diff = now.difference(this);

    if (diff.inSeconds < 60)  return 'just now';
    if (diff.inMinutes < 60)  return '\${diff.inMinutes}m ago';
    if (diff.inHours < 24)    return '\${diff.inHours}h ago';
    if (diff.inDays < 7)      return '\${diff.inDays}d ago';
    if (diff.inDays < 30)     return '\${(diff.inDays / 7).floor()}w ago';
    if (diff.inDays < 365)    return '\${(diff.inDays / 30).floor()}mo ago';
    return '\${(diff.inDays / 365).floor()}y ago';
  }

  // Checks
  bool get isToday    => _isSameDay(this, DateTime.now());
  bool get isYesterday => _isSameDay(this, DateTime.now().subtract(const Duration(days: 1)));
  bool get isTomorrow => _isSameDay(this, DateTime.now().add(const Duration(days: 1)));
  bool get isPast     => isBefore(DateTime.now());
  bool get isFuture   => isAfter(DateTime.now());

  // Start/end of day
  DateTime get startOfDay => DateTime(year, month, day);
  DateTime get endOfDay   => DateTime(year, month, day, 23, 59, 59, 999);

  static bool _isSameDay(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;
}

// Usage
DateTime.now().timeAgo;             // 'just now'
DateTime(2024, 1, 15).toReadable;   // 'Jan 15, 2024'
DateTime.now().isToday;             // true`,
  },
];

export function getSnippetBySlug(slug: string): Snippet | undefined {
  return SNIPPETS.find((s) => s.slug === slug);
}

export function getSnippetsByCategory(category: string): Snippet[] {
  if (category === "All") return SNIPPETS;
  return SNIPPETS.filter((s) => s.category === category);
}
