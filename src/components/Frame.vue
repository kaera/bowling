<template>
  <div>
    <div class="scores">
      <div class="score">{{ format(scores[0]) }}</div>
      <div class="score">{{ secondScore }}</div>
      <div class="score" v-if="index === 9">{{ format(scores[2]) }}</div>
    </div>
    <div class="total">{{ total || "" }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Frame extends Vue {
  @Prop() index!: number;
  @Prop() refs!: { [key: string]: Frame[] };
  @Prop() rolls!: number[];
  pins = 10;
  private scores: number[] = [];
  private rollIndex: number | null = null;

  private format(value: number) {
    switch (value) {
      case 0:
        return "-";
      case 10:
        return "X";
      default:
        return value;
    }
  }

  get prevFrame() {
    return this.refs["frame" + (this.index - 1)]?.[0];
  }

  private get secondScore() {
    if (this.scores[0] + this.scores[1] === 10) {
      return "/";
    }
    return this.format(this.scores[1]);
  }

  private get thirdScore() {
    return this.scores[2] === 10 ? "X" : this.scores[2];
  }

  get total(): number {
    const prevTotal = this.prevFrame?.total || 0;
    if (this.scores[0] === 10) {
      // strike
      return (
        prevTotal +
        this.scores[0] +
        this.rolls[(this.rollIndex || 0) + 1] +
        this.rolls[(this.rollIndex || 0) + 2]
      );
    }

    const total = this.scores[0] + this.scores[1];
    if (total === 10) {
      // spare
      return prevTotal + total + this.rolls[(this.rollIndex || 0) + 2];
    }

    if (total < 10) {
      return prevTotal + total;
    }

    return 0;
  }

  isCompleted() {
    if (this.index < 9) {
      return this.scores.length === 2 || this.scores[0] === 10;
    }
    return this.scores.length === 3 || this.scores[0] + this.scores[1] < 10;
  }

  roll(value: number, rollIndex: number) {
    this.scores.push(value);
    this.pins -= value;
    if (this.index === 9 && this.pins === 0) {
      this.pins = 10;
    }
    if (this.rollIndex == null) {
      this.rollIndex = rollIndex;
    }
  }

  reset() {
    this.pins = 10;
    this.scores = [];
    this.rollIndex = null;
  }
}
</script>

<style scoped>
.scores {
  display: flex;
}
.score {
  width: 30px;
  height: 25px;
}
.score + .score {
  border-style: solid;
  border-width: 0 0 1px 1px;
}
.total {
  height: 25px;
}
</style>
