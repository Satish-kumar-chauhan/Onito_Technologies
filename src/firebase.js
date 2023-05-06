import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCVdU2J9hRkz1bo5jaYcvN48M_UhxixkVo",
  authDomain: "test-task-dc093.firebaseapp.com",
  projectId: "test-task-dc093",
  storageBucket: "test-task-dc093.appspot.com",
  messagingSenderId: "871992647226",
  appId: "1:871992647226:web:4ca7b88916d5fc28df9f03",
  databaseURL:"https://test-task-dc093-default-rtdb.firebaseio.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);