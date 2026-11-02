# React Native Full-Stack Application 🚀

### Building Modern Android & iOS Applications with React Native, Node.js and Generative AI

A full-stack mobile application project focused on learning and building modern, scalable cross-platform applications for Android and iOS.

I am a Full-Stack Developer with experience in **React.js, Next.js, Node.js, Express.js, MongoDB, MERN Stack and Generative AI Integration**. I am expanding my development skills into mobile application development using **React Native and Expo**.

My goal is to build feature-rich mobile applications with production-oriented architecture, secure authentication, reusable components, scalable APIs and modern mobile experiences.

---

## 👨‍💻 About Me

**Full-Stack Developer | React.js | Next.js | Node.js | MERN | Generative AI**

- Experienced with React.js and Next.js application development.
- Backend development using Node.js and Express.js.
- REST API development and MongoDB database integration.
- Authentication using JWT, cookies and secure backend practices.
- Generative AI integration in web applications.
- Currently learning React Native to develop Android and iOS applications.

---

## 🎯 Project Goals

Build a complete full-stack mobile application with:

- Cross-platform Android and iOS support.
- Reusable React Native components.
- Modern application navigation.
- Secure user authentication.
- REST API integration.
- MongoDB database connectivity.
- Image upload and device feature integration.
- Push notifications.
- Scalable backend architecture.
- Mobile application deployment.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Mobile Frontend | React Native, Expo, TypeScript |
| Navigation | Expo Router |
| UI | View, Text, Pressable, StyleSheet |
| State Management | React Hooks, Context API |
| API Integration | Axios, Fetch API |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Validation | Zod |
| Secure Storage | Expo SecureStore |
| Development | VS Code, Git, GitHub |
| AI Integration | Generative AI APIs |

## 📁 Project Structure

```text
react-native-fullstack-app/
│
├── MyMobileApp/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── constants/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── assets/
│   ├── package.json
│   └── app.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
└── .gitignore
```

## 📱 Mobile Application Features

### Frontend

- React Native and Expo setup.
- Reusable components and TypeScript props.
- React Hooks and state management.
- Stack, Bottom Tab and Drawer navigation.
- Sign In and Sign Up screens.
- Form validation and keyboard management.
- Fetch and Axios API integration.
- Loading and error handling.

### Planned Mobile Features

- Product listing and product details.
- Search, filters and pagination.
- Shopping cart and checkout UI.
- Camera and image gallery.
- Location and device permissions.
- Push notifications.
- Secure token storage.
- Android APK/AAB and iOS application builds.

## ⚙️ Backend Features

- Node.js and Express REST APIs.
- MongoDB database integration.
- Modular routes, controllers and services.
- User registration and login.
- Password hashing using bcrypt.
- JWT access and refresh tokens.
- Authentication middleware.
- Request validation with Zod.
- Centralized error handling.
- Rate limiting and API security.

*Backend features are under development and will be marked complete as they are implemented and tested.*

## 🔐 Authentication Architecture

```text
React Native Application
          |
          v
       Axios API
          |
          v
    Express Backend
          |
          v
  Authentication Middleware
          |
          v
      Auth Service
          |
          v
     MongoDB Database
```

Authentication will include password hashing, JWT verification, protected APIs, secure mobile token storage and session management.

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL

cd react-native-fullstack-app
```

### 2. Setup Mobile Frontend

```bash
cd MyMobileApp

npm install

npx expo start
```

Install Expo Go on your Android phone and scan the development QR code.

### 3. Setup Backend

Open another terminal:

```bash
cd backend

npm install
```

Create a `.env` file using `.env.example` as a reference.

Configure your environment variables:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

Start the backend:

```bash
npm run dev
```

### 4. Connect Mobile App to Backend

Use the backend computer's local network IP address in your mobile app API configuration.

Example:

```text
http://YOUR_LOCAL_IP:5000/api/v1
```

For a physical Android phone, do not use `localhost` to access the development server running on your computer.

## 🗺️ Development Roadmap

- [x] React Native + Expo installation
- [x] React Native components and props
- [x] useState and useEffect
- [x] useRef, useMemo and useCallback
- [x] Stack Navigation
- [x] Bottom Tab Navigation
- [x] Drawer Navigation
- [x] Sign In and Sign Up UI
- [x] Basic Form Validation
- [x] Fetch API integration
- [x] Axios API integration
- [ ] Node.js backend integration
- [ ] MongoDB connection
- [ ] Complete JWT authentication
- [ ] Secure token management
- [ ] CRUD APIs and mobile integration
- [ ] Camera, gallery and location
- [ ] Push notifications
- [ ] Android and iOS testing
- [ ] Production builds and deployment

## 🧪 Development Approach

The project follows a practical, step-by-step development approach:

1. Build reusable mobile components.
2. Develop clean and maintainable screens.
3. Create modular REST APIs.
4. Connect frontend and backend.
5. Secure authentication and user data.
6. Test application features on real devices.
7. Prepare Android and iOS production builds.

## 🌟 Vision

My aim is to combine my existing Full-Stack and Generative AI development experience with mobile engineering to build scalable, intelligent and user-friendly applications for Android and iOS.

**Learning. Building. Improving. Shipping.**

---

### Developed with ❤️ and continuous learning

**Technologies:** React Native • Expo • TypeScript • Node.js • Express.js • MongoDB • Generative AI