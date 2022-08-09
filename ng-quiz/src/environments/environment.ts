export const environment = {
  production: false,
  appName: 'Quizzing',
  firebase: {
    config: {
      apiKey: "AIzaSyCFeO2c3-jy-1VAiDDE2v8vIk_4p92Tqv0",
      authDomain: "ng-quiz-7.firebaseapp.com",
      projectId: "ng-quiz-7",
      storageBucket: "ng-quiz-7.appspot.com",
      messagingSenderId: "280971311759",
      appId: "1:280971311759:web:fc7370c3aa261925c00efa",
      measurementId: "G-R183RV2JEY"
    },
    dbUrl: 'https://ng-quiz-7-default-rtdb.europe-west1.firebasedatabase.app/',
  },
  admin: {
    email: 'dimitarsotirov7@gmail.com'
  },
  translate: [ 'bg', 'en' ],
  cookieName: "uid",
  quizConfig: {
    secPerQuest: 20,
  },
};