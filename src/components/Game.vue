<template>
  <div class="game">
    <form v-if="!isStarted" @submit="addPlayer($event)">
      <input ref="input" value="John Doe" />
      <button>Add player</button>
    </form>
    <div v-if="isCompleted()">
      <h3>{{ winner }} won!</h3>
    </div>
    <div v-else-if="isStarted && !isRandomGame" class="buttons">
      <button @click="rollRandom()">Random</button>
      <button v-for="(_, i) in buttonsNum" :key="i" @click="roll(i)">
        {{ i }}
      </button>
    </div>
    <div v-else-if="players.length > 0 && !isStarted" class="buttons">
      <button @click="isStarted = true">Start Game</button>
      <button @click="runRandomGame()">Run Random Game</button>
    </div>
    <table>
      <tr>
        <th>Player Name</th>
        <th v-for="i in 10" :key="i">{{ i }}</th>
        <th>Total score</th>
      </tr>
      <template v-for="(name, i) in players">
        <Board :key="i" :name="name" :ref="'board' + i" />
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
  private players: string[] = [];
  private currentBoardIndex = 0;
  private isMounted = false;
  private isStarted = false;
  private isRandomGame = false;

  mounted() {
    this.isMounted = true;
  }

  private get buttonsNum(): number {
    if (!this.isMounted || !this.isStarted || !this.currentBoard.currentFrame)
      return 0;
    return this.currentBoard.currentFrame.pins + 1;
  }

  private get currentBoard() {
    const ref = this.$refs["board" + this.currentBoardIndex] as Board[];
    return ref[0];
  }

  private get winner() {
    return this.players
      .map((name, i) => {
        const ref = this.$refs["board" + i] as Board[];
        return { name, total: ref[0].total! };
      })
      .sort((a, b) => b.total - a.total)[0].name;
  }

  private addPlayer(e: Event) {
    e.preventDefault();
    const input = this.$refs.input as HTMLInputElement;
    this.players.push(input.value);
    input.value = "";
  }

  private async runRandomGame() {
    this.isStarted = true;
    this.isRandomGame = true;
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
      this.currentBoardIndex =
        (this.currentBoardIndex + 1) % this.players.length;
    }
  }

  private isCompleted() {
    if (!this.isMounted || !this.isStarted) return false;
    const lastBoardRef = this.$refs[
      "board" + (this.players.length - 1)
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
  min-width: 51px;
}
.game td {
  padding: 0;
  border: 1px solid;
}

.buttons {
  text-align: left;
}
</style>
