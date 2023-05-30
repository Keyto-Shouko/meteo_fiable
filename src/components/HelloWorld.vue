<script setup>
</script>


<script>

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Initialize Firebase
const app = initializeApp(import.meta.env.VITE_FIREBASE_CONFIG);

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
    sendNotification(symbolOfWinner) {
      window.navigator.vibrate([100,30,100,30,100,30,200,30,200,30,200,30,100,30,100,30,100]); //
      //send a notification to the player
      let notification
      if (Notification.permission === 'granted') {
        notification = new Notification(`Info météo`, {
          body: 'Des infos sur la météo',
          // Other optional options: icon, badge, etc.
          icon: '/chad.png',
        });
        
        if (navigator.setAppBadge) {
          console.log("The App Badging API is supported!");
          navigator.setAppBadge();
        }
      }
      // Handle notification click event
      notification.onclick = () => {
        // Handle notification click action
        console.log('Notification clicked');
        // Clean up the notification
        notification.close();
      };
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
  },
  created(){
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
  updated(){
    console.log("updated")
    console.log("this.deferredPrompt", this.deferredPrompt) 
  }
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
