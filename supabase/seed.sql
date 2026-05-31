-- ============================================================
-- bidev CMS — Seed data from existing MDX blog posts
-- Run this AFTER schema.sql in the Supabase SQL editor
-- Requires at least one user to exist in auth.users (sign in first)
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- Categories
-- ──────────────────────────────────────────────────────────────
insert into public.categories (id, name, slug, description) values
  ('11111111-0000-0000-0000-000000000001', 'Flutter',      'flutter',       'Flutter mobile development, architecture, and Firebase guides'),
  ('11111111-0000-0000-0000-000000000002', 'AI Tools',     'ai-tools',      'AI productivity tools, reviews, and developer workflows'),
  ('11111111-0000-0000-0000-000000000003', 'Developer Tools', 'developer-tools', 'Tools, utilities, and productivity tips for developers')
on conflict (slug) do nothing;

-- ──────────────────────────────────────────────────────────────
-- Tags
-- ──────────────────────────────────────────────────────────────
insert into public.tags (id, name, slug) values
  ('22222222-0000-0000-0000-000000000001', 'flutter',          'flutter'),
  ('22222222-0000-0000-0000-000000000002', 'architecture',     'architecture'),
  ('22222222-0000-0000-0000-000000000003', 'dart',             'dart'),
  ('22222222-0000-0000-0000-000000000004', 'firebase',         'firebase'),
  ('22222222-0000-0000-0000-000000000005', 'fcm',              'fcm'),
  ('22222222-0000-0000-0000-000000000006', 'mobile',           'mobile'),
  ('22222222-0000-0000-0000-000000000007', 'ai tools',         'ai-tools'),
  ('22222222-0000-0000-0000-000000000008', 'productivity',     'productivity'),
  ('22222222-0000-0000-0000-000000000009', 'developer tools',  'developer-tools')
on conflict (slug) do nothing;

-- ──────────────────────────────────────────────────────────────
-- Articles
-- author_id = first user in auth.users (your admin account)
-- ──────────────────────────────────────────────────────────────

-- 1. Flutter Clean Architecture Guide 2026
insert into public.articles (
  id, title, slug, content, excerpt,
  status, author_id, category_id,
  seo_title, seo_description, seo_keywords,
  reading_time, featured, published_at, created_at, updated_at
) values (
  '33333333-0000-0000-0000-000000000001',
  'Flutter Clean Architecture Guide 2026 – Complete Folder Structure',
  'flutter-clean-architecture-2026',
  $art1$<p>Flutter Clean Architecture is the industry standard for building <strong>scalable, testable, and maintainable</strong> mobile apps. This guide walks you through a production-ready implementation for 2026.</p>

<h2>What Is Clean Architecture?</h2>

<p>Three concentric layers where <strong>dependencies point inward only</strong>:</p>

<ol><li><strong>Presentation</strong> — Widgets, pages, state management (Bloc/GetX)</li><li><strong>Domain</strong> — Pure Dart: entities, use cases, repository interfaces</li><li><strong>Data</strong> — Repository implementations, models, remote/local data sources</li></ol>

<h2>Recommended Folder Structure</h2>

<pre><code>lib/
├── core/
│   ├── errors/
│   │   ├── exceptions.dart
│   │   └── failures.dart
│   └── usecases/usecase.dart
│
└── features/
    └── auth/
        ├── data/
        │   ├── datasources/auth_remote_datasource.dart
        │   ├── models/user_model.dart
        │   └── repositories/auth_repository_impl.dart
        ├── domain/
        │   ├── entities/user_entity.dart
        │   ├── repositories/auth_repository.dart
        │   └── usecases/login_usecase.dart
        └── presentation/
            ├── bloc/
            │   ├── auth_bloc.dart
            │   ├── auth_event.dart
            │   └── auth_state.dart
            └── pages/login_page.dart</code></pre>

<h2>Domain Layer — The Core</h2>

<pre><code class="language-dart">// entity — pure Dart, no packages
class UserEntity {
  final String id;
  final String email;
  final String displayName;
  const UserEntity({required this.id, required this.email, required this.displayName});
}

// repository interface
abstract class AuthRepository {
  Future&lt;Either&lt;Failure, UserEntity&gt;&gt; login({
    required String email,
    required String password,
  });
  Future&lt;Either&lt;Failure, void&gt;&gt; logout();
}

// use case — single responsibility
class LoginUseCase {
  final AuthRepository _repo;
  const LoginUseCase(this._repo);

  Future&lt;Either&lt;Failure, UserEntity&gt;&gt; call(LoginParams params) =&gt;
      _repo.login(email: params.email, password: params.password);
}</code></pre>

<h2>Data Layer — Repository Implementation</h2>

<pre><code class="language-dart">class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remote;
  AuthRepositoryImpl(this._remote);

  @override
  Future&lt;Either&lt;Failure, UserEntity&gt;&gt; login({
    required String email,
    required String password,
  }) async {
    try {
      final model = await _remote.login(email: email, password: password);
      return Right(model);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException {
      return Left(const NetworkFailure('No internet connection'));
    }
  }
}</code></pre>

<h2>Presentation Layer — Bloc</h2>

<pre><code class="language-dart">class AuthBloc extends Bloc&lt;AuthEvent, AuthState&gt; {
  final LoginUseCase _loginUseCase;

  AuthBloc({required LoginUseCase loginUseCase})
      : _loginUseCase = loginUseCase,
        super(AuthInitial()) {
    on&lt;LoginRequested&gt;(_onLoginRequested);
  }

  Future&lt;void&gt; _onLoginRequested(
    LoginRequested event,
    Emitter&lt;AuthState&gt; emit,
  ) async {
    emit(AuthLoading());
    final result = await _loginUseCase(
      LoginParams(email: event.email, password: event.password),
    );
    result.fold(
      (failure) =&gt; emit(AuthError(failure.message)),
      (user)    =&gt; emit(AuthAuthenticated(user)),
    );
  }
}</code></pre>

<h2>Dependency Injection with GetIt</h2>

<pre><code class="language-dart">final sl = GetIt.instance;

Future&lt;void&gt; init() async {
  sl.registerFactory(() =&gt; AuthBloc(loginUseCase: sl()));
  sl.registerLazySingleton(() =&gt; LoginUseCase(sl()));
  sl.registerLazySingleton&lt;AuthRepository&gt;(
    () =&gt; AuthRepositoryImpl(sl()),
  );
  sl.registerLazySingleton&lt;AuthRemoteDataSource&gt;(
    () =&gt; AuthRemoteDataSourceImpl(firebaseAuth: sl()),
  );
  sl.registerLazySingleton(() =&gt; FirebaseAuth.instance);
}</code></pre>

<h2>Key Rules</h2>

<p>Entities have no packages (pure Dart classes only). Models extend entities and add <code>fromJson</code>/<code>toJson</code>. Use cases have one <code>call()</code> method. Blocs live in the presentation layer only. Always use <code>Either&lt;Failure, T&gt;</code> to handle errors explicitly.</p>$art1$,
  'A production-ready Flutter Clean Architecture guide covering domain, data, and presentation layers with dependency injection, use cases, and real Dart code examples.',
  'published',
  (select id from auth.users limit 1),
  '11111111-0000-0000-0000-000000000001',
  'Flutter Clean Architecture Guide 2026 – Complete Folder Structure',
  'A production-ready Flutter Clean Architecture guide covering domain, data, and presentation layers with dependency injection, use cases, and real Dart code examples.',
  array['flutter', 'clean architecture', 'dart', 'bloc', 'getit'],
  3, true,
  '2026-05-20 00:00:00+00',
  '2026-05-20 00:00:00+00',
  '2026-05-20 00:00:00+00'
) on conflict (slug) do nothing;


-- 2. Firebase Push Notifications in Flutter
insert into public.articles (
  id, title, slug, content, excerpt,
  status, author_id, category_id,
  seo_title, seo_description, seo_keywords,
  reading_time, featured, published_at, created_at, updated_at
) values (
  '33333333-0000-0000-0000-000000000002',
  'Firebase Push Notifications in Flutter – Complete 2026 Guide',
  'firebase-push-notifications-flutter',
  $art2$<p>Firebase Cloud Messaging (FCM) is the standard push notification service for Flutter apps. This guide covers every notification state with production-ready code.</p>

<h2>Setup</h2>

<pre><code class="language-yaml"># pubspec.yaml
dependencies:
  firebase_core: ^3.3.0
  firebase_messaging: ^15.1.0
  flutter_local_notifications: ^17.2.1</code></pre>

<h2>Android Configuration</h2>

<pre><code class="language-xml">&lt;!-- AndroidManifest.xml inside &lt;application&gt; --&gt;
&lt;meta-data
    android:name="com.google.firebase.messaging.default_notification_channel_id"
    android:value="high_importance_channel" /&gt;</code></pre>

<h2>The Notification Service</h2>

<pre><code class="language-dart">@pragma('vm:entry-point')
Future&lt;void&gt; _bgHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  await NotificationService.instance.showLocal(message);
}

class NotificationService {
  NotificationService._();
  static final instance = NotificationService._();

  final _fcm   = FirebaseMessaging.instance;
  final _local = FlutterLocalNotificationsPlugin();

  Future&lt;void&gt; init() async {
    FirebaseMessaging.onBackgroundMessage(_bgHandler);
    await _setupLocalNotifications();
    await _requestPermission();
    await _setupHandlers();
  }

  Future&lt;void&gt; _requestPermission() async {
    await _fcm.requestPermission(alert: true, badge: true, sound: true);
    await _fcm.setForegroundNotificationPresentationOptions(
      alert: true, badge: true, sound: true,
    );
  }

  Future&lt;void&gt; _setupLocalNotifications() async {
    const android = AndroidInitializationSettings('@drawable/ic_notification');
    const ios     = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );
    await _local.initialize(
      const InitializationSettings(android: android, iOS: ios),
      onDidReceiveNotificationResponse: _onTap,
    );

    const channel = AndroidNotificationChannel(
      'high_importance_channel',
      'High Importance Notifications',
      importance: Importance.high,
    );
    await _local
        .resolvePlatformSpecificImplementation&lt;AndroidFlutterLocalNotificationsPlugin&gt;()
        ?.createNotificationChannel(channel);
  }

  Future&lt;void&gt; _setupHandlers() async {
    FirebaseMessaging.onMessage.listen(showLocal);
    FirebaseMessaging.onMessageOpenedApp.listen(_navigate);
    final initial = await _fcm.getInitialMessage();
    if (initial != null) _navigate(initial);
  }

  Future&lt;void&gt; showLocal(RemoteMessage msg) async {
    final n = msg.notification;
    if (n == null) return;
    await _local.show(
      n.hashCode, n.title, n.body,
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'high_importance_channel', 'High Importance Notifications',
          importance: Importance.high, priority: Priority.high,
        ),
        iOS: DarwinNotificationDetails(presentAlert: true, presentSound: true),
      ),
      payload: msg.data['route'],
    );
  }

  void _onTap(NotificationResponse r) {
    if (r.payload != null) _goTo(r.payload!);
  }

  void _navigate(RemoteMessage msg) {
    final route = msg.data['route'];
    if (route != null) _goTo(route);
  }

  void _goTo(String route) {
    debugPrint('Navigate to $route');
  }

  Future&lt;String?&gt; getToken() =&gt; _fcm.getToken();
  Future&lt;void&gt; subscribe(String topic) =&gt; _fcm.subscribeToTopic(topic);
}</code></pre>

<h2>Initialize in main.dart</h2>

<pre><code class="language-dart">void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  await NotificationService.instance.init();
  runApp(const MyApp());
}</code></pre>

<h2>FCM Payload Structure</h2>

<pre><code class="language-json">{
  "message": {
    "token": "device_token",
    "notification": { "title": "New Order", "body": "Order #1234 placed" },
    "data": { "route": "/orders/1234", "orderId": "1234" },
    "android": {
      "notification": { "channel_id": "high_importance_channel" }
    }
  }
}</code></pre>

<h2>Topics (Broadcast to Groups)</h2>

<pre><code class="language-dart">await NotificationService.instance.subscribe('all_users');
await NotificationService.instance.subscribe('flutter_devs');</code></pre>

<h2>Common Issues</h2>

<p><strong>No notification on Android</strong> — Check channel ID matches manifest. <strong>No foreground on iOS</strong> — Implement <code>UNUserNotificationCenterDelegate</code>. <strong>Android 13+ blocked</strong> — Request <code>POST_NOTIFICATIONS</code> permission. <strong>Token null</strong> — Wait for Firebase init before calling <code>getToken()</code>.</p>$art2$,
  'Master Firebase Cloud Messaging (FCM) in Flutter. Covers foreground, background, and terminated app states, notification channels, deep links, and production-ready Dart code.',
  'published',
  (select id from auth.users limit 1),
  '11111111-0000-0000-0000-000000000001',
  'Firebase Push Notifications in Flutter – Complete 2026 Guide',
  'Master Firebase Cloud Messaging (FCM) in Flutter. Covers foreground, background, and terminated app states, notification channels, deep links, and production-ready Dart code.',
  array['flutter', 'firebase', 'fcm', 'push notifications', 'mobile'],
  4, false,
  '2026-05-15 00:00:00+00',
  '2026-05-15 00:00:00+00',
  '2026-05-15 00:00:00+00'
) on conflict (slug) do nothing;


-- 3. Best AI Tools for Developers 2026
insert into public.articles (
  id, title, slug, content, excerpt,
  status, author_id, category_id,
  seo_title, seo_description, seo_keywords,
  reading_time, featured, published_at, created_at, updated_at
) values (
  '33333333-0000-0000-0000-000000000003',
  'Best AI Tools for Developers in 2026 – Ranked & Reviewed',
  'best-ai-tools-2026',
  $art3$<p>AI tools have become table stakes for software developers. In 2026, the productivity gap between teams that use AI effectively and those that don't is <strong>2–5×</strong>. Here's what's actually worth using.</p>

<h2>The Short List</h2>

<p><strong>Claude Code</strong> — Complex multi-file tasks · $20/mo<br><strong>GitHub Copilot</strong> — IDE completions · $10/mo<br><strong>Cursor</strong> — AI-native IDE · $20/mo<br><strong>Vercel v0</strong> — UI generation · Freemium<br><strong>Codeium</strong> — Free Copilot alternative · Free</p>

<h2>1. Claude Code — Best for Complex Tasks</h2>

<p>Claude Code runs in your terminal with access to your entire codebase. Unlike IDE plugins, it can coordinate changes across many files, run tests, and reason about architecture.</p>

<pre><code class="language-bash">npm install -g @anthropic-ai/claude-code
claude</code></pre>

<p><strong>Where it wins:</strong> Multi-file refactors, writing tests for existing code, explaining complex codebases, architecting new features.</p>

<p><strong>Where it falls short:</strong> It's slower than tab completion for trivial line fills.</p>

<h2>2. GitHub Copilot — Best IDE Integration</h2>

<p>Copilot excels at line-by-line completions. Write a comment describing what you want and press Tab.</p>

<pre><code class="language-dart">// Calculate cart total with 10% discount if &gt; $100 and 20% VAT
double calculateTotal(List&lt;CartItem&gt; items) {
  // Copilot completes this
}</code></pre>

<p><strong>Tip:</strong> Write detailed comments before functions. The more context you give, the better the suggestion.</p>

<h2>3. Cursor — AI-Native IDE</h2>

<p>Cursor is a VS Code fork with deep AI integration. The key shortcuts:</p>

<ul><li><code>Cmd+K</code> — Edit selected code with AI</li><li><code>Cmd+L</code> — Open AI chat with codebase context</li><li><code>Tab</code> — Accept multi-line completions</li></ul>

<p>It understands your whole project, not just the open file.</p>

<h2>4. Automated Code Review with Claude API</h2>

<pre><code class="language-typescript">import Anthropic from "@anthropic-ai/sdk";
import { execSync } from "child_process";

const client = new Anthropic();

async function reviewDiff() {
  const diff = execSync("git diff main").toString();
  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{
      role: "user",
      content: `Review this diff for security issues, bugs, and missing error handling:\n\n${diff}`,
    }],
  });
  console.log(msg.content[0].text);
}</code></pre>

<h2>5. Vercel v0 — UI Generation</h2>

<p>Paste a description or screenshot and get React + Tailwind components instantly. Best for rapid prototyping, component exploration, and converting Figma designs to code.</p>

<h2>My Daily Stack</h2>

<ol><li><strong>Claude Code</strong> in terminal for architecture decisions</li><li><strong>Copilot</strong> in VS Code for completions while coding</li><li><strong>Cursor</strong> when I need to make large coordinated changes</li><li><strong>v0</strong> for any new React UI I'm prototyping</li></ol>

<p>The tools work best in combination. Don't pick one — use each where it's strongest.</p>

<h2>Where AI Still Falls Short</h2>

<ul><li>Complex domain business logic (AI doesn't know your company's rules)</li><li>Performance optimization (requires profiling, not generation)</li><li>Security-critical code (always have humans review crypto and auth)</li><li>Ambiguous requirements (AI mirrors your own confusion)</li></ul>$art3$,
  'The AI tools that actually make you faster in 2026. Claude Code, GitHub Copilot, Cursor, Vercel v0, and more — with real productivity comparisons and when to use each.',
  'published',
  (select id from auth.users limit 1),
  '11111111-0000-0000-0000-000000000002',
  'Best AI Tools for Developers in 2026 – Ranked & Reviewed',
  'The AI tools that actually make you faster in 2026. Claude Code, GitHub Copilot, Cursor, Vercel v0, and more — with real productivity comparisons and when to use each.',
  array['ai tools', 'productivity', 'claude code', 'github copilot', 'cursor'],
  3, true,
  '2026-05-10 00:00:00+00',
  '2026-05-10 00:00:00+00',
  '2026-05-10 00:00:00+00'
) on conflict (slug) do nothing;


-- ──────────────────────────────────────────────────────────────
-- Article ↔ Tag associations
-- ──────────────────────────────────────────────────────────────

-- flutter-clean-architecture-2026  →  flutter, architecture, dart
insert into public.article_tags (article_id, tag_id) values
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002'),
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003')
on conflict do nothing;

-- firebase-push-notifications-flutter  →  flutter, firebase, fcm, mobile
insert into public.article_tags (article_id, tag_id) values
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001'),
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000004'),
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000005'),
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000006')
on conflict do nothing;

-- best-ai-tools-2026  →  ai tools, productivity, developer tools
insert into public.article_tags (article_id, tag_id) values
  ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000007'),
  ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000008'),
  ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000009')
on conflict do nothing;

-- ──────────────────────────────────────────────────────────────
-- Verify
-- ──────────────────────────────────────────────────────────────
select title, status, category_name, tags
from public.articles_with_relations
order by published_at desc;
