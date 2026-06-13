import { Logo } from "@/once-ui/components";

const person = {
  firstName: "Bilal",
  lastName: "Fali",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Flutter Mobile App Developer",
  avatar: "/images/avatar.jpg",
  email: "bilalfali60@gmail.com",
  location: "Africa/Algiers", // IANA timezone for Algeria
  phone: "+213540712393",
  languages: ["English", "Arabic"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>
      I occasionally write about design, technology, and share thoughts on the
      intersection of creativity and engineering.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/BilalFali",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/falibilal/",
  },
  {
    name: "Youtube",
    icon: "youtube",
    link: "https://www.youtube.com/channel/@bidev97",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
  {
    name: "Resume",
    icon: "document",
    link: "https://drive.google.com/file/d/1EwRJ_6Ns7tWK7AIOCP6MSJx3Qamc5_Xr/view?usp=sharing",
  },
];

const home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: "bidev.site – Flutter, Mobile Dev & Developer Tools",
  description: "Learn Flutter, Mobile Development & build real apps. Free developer tools, tutorials, and technical articles by Bilal Fali.",
  headline: <>Learn Flutter, Mobile Dev & Build Real Apps</>,
  featured: {
    title: "New: Free Developer Tools",
    href: "/tools"
  },
  subline: (
    <>
      Free tools, in-depth tutorials, and production-ready guides for Flutter
      <br /> and mobile developers. Start reading or explore the tools.
    </>
  ),
};

const about = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from M'sila, Algeria`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Bilal is a M'sila, Algeria-based Flutter Mobile App Developer with a
        passion for creating seamless cross-platform mobile applications. Master
        of Computer Science graduate with proven experience in designing and
        developing applications for Android and iOS. Proficient in Flutter,
        Dart, Firebase, Supabase, and modern state management solutions. Strong
        background in app performance optimization, API integration, and
        delivering scalable, production-ready applications.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "DevGate Company",
        timeframe: "Feb 2022 - Present",
        role: "Flutter Developer",
        achievements: [
          <>
            Developed and launched multiple mobile apps including VTC
            (ride-hailing/transportation) applications and e-commerce platforms
          </>,
          <>
            Implemented core features such as real-time tracking, secure
            authentication (Google Sign-In), Firebase notifications, and payment
            gateway integration
          </>,
          <>
            Integrated Firebase services (Auth, Firestore, Cloud Storage, Remote
            Config, Messaging) for authentication, cloud storage, and real-time
            databases
          </>,
          <>
            Optimized app performance, reducing loading times and improving UI
            responsiveness
          </>,
          <>
            Successfully deployed apps to Google Play Store and Apple App Store
          </>,
          <>
            Developed and launched 5+ cross-platform mobile apps using Flutter,
            serving over 100K+ active users
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "Wegofleet Project",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "PrivateLoc Project",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/cover-03.jpg",
            alt: "Gaspypa Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Codex Company",
        timeframe: "Oct 2021 - Feb 2022",
        role: "Flutter Developer",
        achievements: [
          <>
            Developed and launched multiple mobile apps for clients, including
            VTC (ride-hailing/transportation) applications
          </>,
          <>
            Implemented core features such as real-time tracking, secure
            authentication (Google Sign-In), Firebase notifications, and payment
            gateway integration
          </>,
          <>
            Integrated Firebase services for authentication and real-time
            communication
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Education",
    institutions: [
      {
        name: "University of M'sila",
        description: (
          <>
            Master's Degree in Computer Science (2019 – 2021). Advanced studies
            in computer science, focusing on research and specialized topics.
          </>
        ),
      },
      {
        name: "University of M'sila",
        description: (
          <>
            Bachelor's Degree in Computer Science (2016 – 2019). Comprehensive
            education in computer science fundamentals, programming, and
            software engineering.
          </>
        ),
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical Skills",
    skills: [
      {
        title: "Flutter & Dart",
        description: (
          <>
            Expert in building high-performance, cross-platform mobile
            applications for Android and iOS using Flutter. Proficient in Dart
            programming language and Flutter framework best practices including
            Clean Architecture, MVVM pattern, and state management solutions
            (GetX, Provider, Bloc).
          </>
        ),
        images: [
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Flutter Project",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/cover-03.jpg",
            alt: "Mobile App",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Backend & APIs",
        description: (
          <>
            Experienced with Firebase (Auth, Firestore, Cloud Storage,
            Messaging, Remote Config), Supabase, RESTful APIs, GraphQL, and
            payment gateway integration (Stripe). Proficient in real-time
            database management and cloud services.
          </>
        ),
        images: [],
      },
      {
        title: "Development Tools & Platforms",
        description: (
          <>
            Proficient with Git, GitHub, VS Code, Android Studio, Figma,
            Postman, Google APIs, Google Maps integration, Socket.IO, and CI/CD
            tools. Experience in publishing apps to Google Play Store and Apple
            App Store.
          </>
        ),
        images: [],
      },
      {
        title: "Technologies & Frameworks",
        description: (
          <>
            Flutter, Dart, Firebase, Supabase, REST APIs, GraphQL, SQLite,
            PostgreSQL, MongoDB, Stripe Payment Gateway, Google APIs, Google
            Maps, Socket.IO, GetX, Provider, Bloc, MVC+S Architecture, Clean
            Architecture.
          </>
        ),
        images: [],
      },
    ],
  },
};

const blog = {
  path: "/blog",
  label: "Blog",
  title: "Blog – Flutter & Mobile Dev Articles",
  description: "In-depth Flutter tutorials, mobile development guides, Firebase tips, and AI tools for developers. Written by Bilal Fali.",
};

const tools = {
  path: "/tools",
  label: "Tools",
  title: "Free Developer Tools – bidev.site",
  description: "Free online tools for developers: QR Code Generator, JSON Formatter & Validator, Password Generator, and more.",
};

const work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Flutter mobile app projects by ${person.name}`,
};

const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery, tools };
