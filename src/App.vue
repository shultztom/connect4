<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <span class="mr-2">Connect 4!</span>
    </v-app-bar>

    <v-main>
      <Connect4Board />
    </v-main>
  </v-app>
</template>

<script>
import Connect4Board from "./components/Connect4Board";

export default {
  name: "App",

  components: {
    Connect4Board,
  },

  data: () => ({
    //
  }),
};
</script>
