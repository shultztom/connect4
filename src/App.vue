<template>
  <v-app>
    <v-app-bar
      color="primary"
      theme="dark"
    >
      <v-app-bar-title>Connect 4!</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <Connect4Board />
    </v-main>
  </v-app>
</template>

<script setup>
import Connect4Board from './components/Connect4Board.vue'
</script>
