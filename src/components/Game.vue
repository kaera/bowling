<template>
  <div class="game">
    <h3 v-if="isCompleted()">Game over</h3>
    <div v-else class="buttons">
      <button @click="rollRandom()">Random</button>
      <button v-for="(_, i) in buttonsNum" :key="i" @click="roll(i)">
        {{ i }}
      </button>
      <br />
      <button @click="runRandomGame()">Run Random Game</button>
    </div>
    <table>
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
  private playersNum = 3;
  private refs = [...Array(this.playersNum)].map((_, i) => "board" + i);
  private currentBoardIndex = 0;
  private isMounted = false;

  private get buttonsNum(): number {
    if (!this.isMounted || !this.currentBoard.currentFrame) return 0;
    return this.currentBoard.currentFrame.pins + 1;
  }

  get currentBoard() {
    const ref = this.$refs["board" + this.currentBoardIndex] as Board[];
    return ref[0];
  }

  async mounted() {
    this.isMounted = true;
  }

  private async runRandomGame() {
    while (!this.isCompleted()) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      this.rollRandom();
    }
  }

  private rollRandom() {
    this.roll((Math.random() * this.buttonsNum) | 0);
  }

  private roll(value: number) {
    // console.log(
    //   "Player",
    //   this.currentBoardIndex + 1,
    //   "knocks down",
    //   value,
    //   "pins"
    // );
    const currentFrame = this.currentBoard.currentFrame;

    this.currentBoard.roll(value);
    if (currentFrame !== this.currentBoard.currentFrame) {
      this.currentBoardIndex = (this.currentBoardIndex + 1) % this.refs.length;
    }
  }

  isCompleted() {
    if (!this.isMounted) return false;
    const lastBoardRef = this.$refs[
      "board" + (this.refs.length - 1)
    ] as Board[];
    return lastBoardRef[0].isCompleted();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.game {
  width: 900px;
}
.game button {
  margin: 5px 8px;
  padding: 5px 20px;
}
.game table {
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

.buttons {
  text-align: left;
}
</style>
