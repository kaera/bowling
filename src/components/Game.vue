<template>
  <div>
    <div v-for="ref in refs" :key="ref">
      {{ ref }}
      <Board :ref="ref" />
    </div>
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
export default class Game extends Vue {
  private playersNum = 2;
  private refs = [...Array(this.playersNum)].map((_, i) => "board" + i);
  private currentBoardIndex = 0;

  get currentBoard() {
    const ref = this.$refs["board" + this.currentBoardIndex] as Board[];
    return ref[0];
  }

  async mounted() {
    while (!this.isCompleted()) {
      const currentFrame = this.currentBoard.currentFrame;
      while (currentFrame === this.currentBoard.currentFrame) {
        await new Promise((resolve) => setTimeout(resolve, 20));
        const value =
          (Math.random() * (this.currentBoard.currentFrame.pins + 1)) | 0;
        console.log(
          "Player",
          this.currentBoardIndex + 1,
          "knocks down",
          value,
          "pins"
        );

        this.currentBoard.roll(value);
      }
      this.currentBoardIndex = (this.currentBoardIndex + 1) % this.refs.length;
    }
  }

  isCompleted() {
    const lastBoardRef = this.$refs[
      "board" + (this.refs.length - 1)
    ] as Board[];
    return lastBoardRef[0].isCompleted();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
