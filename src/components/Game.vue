<template>
  <div>
    <table class="game">
      <tr>
        <th>Player Name</th>
        <th v-for="i in 10" :key="i">{{ i }}</th>
        <th>Total score</th>
      </tr>
      <template v-for="(ref, i) in refs">
        <Board :key="ref" :name="'player' + i" :ref="ref" />
      </template>
    </table>
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
        await new Promise((resolve) => setTimeout(resolve, 100));
        const value =
          (Math.random() * (this.currentBoard.currentFrame.pins + 1)) | 0;
        // console.log(
        //   "Player",
        //   this.currentBoardIndex + 1,
        //   "knocks down",
        //   value,
        //   "pins"
        // );

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
<style>
table.game {
  border: 1px solid;
  border-collapse: collapse;
}
.game th {
  padding: 2px 5px;
  border: 1px solid;
}
.game td {
  padding: 0;
  border: 1px solid;
}
</style>
