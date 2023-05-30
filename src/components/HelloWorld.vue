<script setup>
</script>


<script>
navigator.serviceWorker.register("sw.js");
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Initialize Firebase
let apiKey = import.meta.env.VITE_API_KEY
let authDomain = import.meta.env.VITE_AUTH_DOMAIN
let projectID = import.meta.env.VITE_PROJECT_ID
let storageBucket = import.meta.env.VITE_STORAGE_BUCKET
let messaginSenderID = import.meta.env.VITE_MESSAGING_SENDER_ID
let appId = import.meta.env.VITE_APP_ID

let firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectID,
  storageBucket: storageBucket,
  messagingSenderId: messaginSenderID,
  appId: appId
};

console.log("firebaseConfig", firebaseConfig)
const app = initializeApp(firebaseConfig);

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      weatherData: [],
      timeOfRequest: Date()
    }
  },
  beforeMount() {
    console.log(apiKey);
  },
  methods: {
    async logJSONData() {
      const response = await fetch("https://www.infoclimat.fr/public-api/gfs/json?_ll=45.8898726,6.0873035&_auth=U0kEEwd5UnAEKVBnUiQCKwdvUGVbLVdwUy8HZA1oBHkBalc2VTUDZV4wUi8CLQo8AC0HZA02ATFTOFYuCXtTMlM5BGgHbFI1BGtQNVJ9AikHKVAxW3tXcFM5B2INfgRmAWpXN1UoA2BeMFIyAiwKNgAsB3gNMwE%2FUzhWNAlgUzNTNQRmB2FSNgR0UC1SZAIyBzNQNVs2V2pTMAdoDTQENQFhVzNVYwNkXi9SMAI6CjcANwdvDTEBPlM1Vi4Je1NJU0MEfQckUnIEPlB0Un8CYwdqUGQ%3D&_c=b0f64847b6201594895aedeb4e817ac1");
      const jsonData = await response.json();
      const forecast = Object.entries(jsonData).slice(5);
      for (const [key, value] of forecast) {
        console.log(key, value.temperature.sol);
        let tempsPerDay = {
          date: key,
          temperature: value.temperature.sol - 273.15
        }
        this.weatherData.push(tempsPerDay);
      }
    },
    sendNotification() {
      window.navigator.vibrate([100, 30, 100, 30, 100, 30, 200, 30, 200, 30, 200, 30, 100, 30, 100, 30, 100]); //
      //send a notification to the player
      let notification
      if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification("Info météo", {
            body: "Des infos sur la météo",
            icon: "/chad.png",
            vibrate: [250, 100, 300],
            tag: "vibration-sample",
          });
        });

        if (navigator.setAppBadge) {
          console.log("The App Badging API is supported!");
          navigator.setAppBadge();
        }
      }
    },
    promptNotification() {
      console.log("permission", Notification.permission)
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();

      }
    },
    async dismiss() {
      this.deferredPrompt = null;
      console.log("deferredPrompt", this.deferredPrompt)
    },
    async install() {
      console.log("installing")
      console.log("deferredPrompt", this.deferredPrompt)
      this.deferredPrompt.prompt();
    }
  },
  mounted() {
    this.logJSONData();
    setInterval(() => {
      this.sendNotification()
    }, 15000);
  },
  created() {
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("e", e)
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });
  },
  updated() {
    console.log("updated")
    console.log("this.deferredPrompt", this.deferredPrompt)
  }
}



</script>

<template>
  <div>
    <button v-on:click="promptNotification">Get Notifications?</button>
    <button id="installApp" v-on:click="install">Install</button>
    <h1>Weather</h1>
    <p>
      Those data where fetched at : {{ timeOfRequest }}
    </p>
    <li v-for="temp in weatherData">
      {{ temp }}
    </li>
  </div>
</template>


<style scoped></style>
