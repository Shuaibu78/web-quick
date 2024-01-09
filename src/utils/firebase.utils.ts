import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA21c8Jj4i-tBWPkKDqDQMBeQdOKuuJ2zU",
  authDomain: "timartbizapp-1007f.firebaseapp.com",
  projectId: "timartbizapp-1007f",
  storageBucket: "timartbizapp-1007f.appspot.com",
  messagingSenderId: "416240554991",
  appId: "1:416240554991:web:64b696d85218c3afc89c1a",
  measurementId: "G-16GD8E3P0S",
};

const vapidKey =
  "BHcBr7nH9g5DRZaCwLI2QUErr_e3pXCki3hEbcH1K5S9vNMUJIdM2-uc8wbrn5RtBezuGPRg2nWeyJmgB_0gpy4";

const app = initializeApp(firebaseConfig);

async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    return true;
  }

  return false;
}

// Get an FCM token for the current user
export async function getFCMToken() {
  if (!(await requestNotificationPermission())) {
    console.log("Notification permission not denied");
    return null;
  }

  try {
    // Initialize Firebase Cloud Messaging and get a reference to the service
    const messaging = getMessaging(app);
    // Add the public key generated from the console here.
    const token = await getToken(messaging, { vapidKey });

    return token;
  } catch (error) {
    console.error("Notification errror:", error);
  }
}

export function askNotificationPermission() {
  // Check if the browser supports notifications
  if (!Reflect.has(window, "Notification")) {
    console.log("This browser does not support notifications.");
  } else if (Notification.permission === "default") {
    Notification.requestPermission();
  }
};
