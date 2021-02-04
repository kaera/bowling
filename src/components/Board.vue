<template>
  <tr>
    <td>{{ name }}</td>
    <td v-for="(ref, i) in refs" :key="i">
      <Frame :index="i" :ref="ref" :refs="$refs" :allRolls="allRolls" />
    </td>
    <td>{{ total }}</td>
  </tr>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Frame from "./Frame.vue";

@Component({
  components: {
    Frame,
  },
})
export default class Board extends Vue {
  @Prop() name!: string;
  private currentFrameIndex = 0;
  private isMounted = false;
  private refs = [...Array(10)].map((_, i) => "frame" + i);
  private allRolls: number[] = [];

  mounted() {
    this.isMounted = true;
  }

  private get lastFrame() {
    const lastFrameRef = this.$refs.frame9 as Frame[];
    return lastFrameRef[0];
  }

  get total() {
    if (!this.isMounted) return null;
    if (this.currentFrameIndex === 10) {
      return this.lastFrame.total;
    }
    let lastFrame = this.currentFrame;
    while (lastFrame && !lastFrame.total) lastFrame = lastFrame.prevFrame;
    return lastFrame && lastFrame.total;
  }

  get currentFrame() {
    const ref = this.$refs["frame" + this.currentFrameIndex] as Frame[];
    return ref?.[0];
  }

  isCompleted() {
    return this.lastFrame.isCompleted();
  }

  roll(value: number) {
    if (value > this.currentFrame.pins) {
      console.error("Not enough pins");
      return;
    }
    const rollIndex = this.allRolls.length;
    this.allRolls.push(value);
    this.currentFrame.roll(value, rollIndex);
    if (this.currentFrame.isCompleted()) {
      this.currentFrameIndex++;
    }
  }

  reset() {
    this.allRolls = [];
    this.currentFrameIndex = 0;
    this.refs.forEach((ref) => {
      const frameRef = this.$refs[ref] as Frame[];
      frameRef[0].reset();
    });
  }
}
</script>

<style scoped>
td {
  padding: 0;
  border: 1px solid;
  text-align: center;
}
</style>
