// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts(
    'https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js',
);

// setup for localhost
let firebaseConfig = {
    apiKey: 'AIzaSyA8YRwzZW95cSPCVOfNtPZDG0gpG09IjCU',
    authDomain: 'we-development-8a65f.firebaseapp.com',
    projectId: 'we-development-8a65f',
    storageBucket: 'we-development-8a65f.appspot.com',
    messagingSenderId: '79781451597',
    appId: '1:79781451597:web:eb1aef5e6c94530093c904',
    measurementId: 'G-J0YLC4PGFP'
};
// eslint-disable-next-line no-restricted-globals
const isLocalHost = location.hostname.includes('localhost');

if (!isLocalHost) {
    // eslint-disable-next-line no-undef
    importScripts('./firebase-config.js'); // written by custom plugin
    // eslint-disable-next-line no-undef
    firebaseConfig = JSON.parse(Config);
}
// eslint-disable-next-line no-undef
if (firebase.messaging.isSupported()) {
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
// eslint-disable-next-line no-undef
    firebase.initializeApp(firebaseConfig);
    // Retrieve an instance of Firebase Messaging so that it can handle background
    // messages.
    // eslint-disable-next-line no-undef,no-unused-vars
    const messaging = firebase.messaging();
}
// TODO DELETE THIS FILE
