<template>
  <div>
    Test Game
    <Board />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Board from "./Board.vue";

@Component({
  components: {
    Board,
  },
})
export default class Game extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
