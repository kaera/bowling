<template>
  <div>
    <p>
      <span>{{ firstScore }}</span> | <span>{{ secondScore }}</span>
      <template v-if="index === 9">
        | <span>{{ thirdScore }}</span>
      </template>
    </p>
    <p>{{ total || "" }}</p>
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
  private rollIndex!: number;

  private get prevFrame() {
    return this.refs["frame" + (this.index - 1)]?.[0];
  }

  private get firstScore() {
    return this.scores[0] === 10 ? "X" : this.scores[0];
  }

  private get secondScore() {
    if (this.scores[0] + this.scores[1] === 10) {
      return "/";
    }
    if (this.scores[1] === 10) {
      return "X";
    }
    if (this.scores[1] === 0) {
      return "-";
    }
    return this.scores[1];
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
        this.rolls[this.rollIndex + 1] +
        this.rolls[this.rollIndex + 2]
      );
    }

    const total = this.scores[0] + this.scores[1];
    if (total === 10) {
      // spare
      return prevTotal + total + this.rolls[this.rollIndex + 2];
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
    if (!this.rollIndex) {
      this.rollIndex = rollIndex;
    }
  }
}
</script>

<style></style>
