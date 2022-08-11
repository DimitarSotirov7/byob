export const environment = {
  production: true,
  appName: 'Quizo',
  firebase: {
    config: {
      apiKey: "AIzaSyBHxqW_DP0Rsi2HMSSmNUaR2JhkZEpS9qQ",
      authDomain: "quizo.firebaseapp.com",
      projectId: "quizo",
      storageBucket: "quizo.appspot.com",
      // authDomain: "quizgame-2d57e.firebaseapp.com",
      // projectId: "quizgame-2d57e",
      // storageBucket: "quizgame-2d57e.appspot.com",
      messagingSenderId: "949475743242",
      appId: "1:949475743242:web:563fdfe774daf7a20c31f3",
      measurementId: "G-Z4BVZQZ8ME"
    },
  },
  admin: {
    email: 'dimitarsotirov7@gmail.com'
  },
  translate: [ 'bg', 'en' ],
  cookieName: "security-auth-uid",
  quizConfig: {
    secPerQuest: 20,
  },
};
