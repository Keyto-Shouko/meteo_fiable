<script setup>
</script>


<script>
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
    }
  },
  mounted() {
    this.logJSONData();
  }
}



</script>

<template>
  <div>

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
