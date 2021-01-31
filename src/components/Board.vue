<template>
  <tr>
    <td>{{ name }}</td>
    <td v-for="(ref, i) in refs" :key="i">
      <Frame :index="i" :ref="ref" :refs="$refs" :rolls="rolls" />
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
  private refs = [...Array(10)].map((_, i) => "frame" + i);
  private rolls: number[] = [];
  private currentFrameIndex = 0;
  private isMounted = false;

  mounted() {
    this.isMounted = true;
  }

  private get lastFrame() {
    const lastFrameRef = this.$refs.frame9 as Frame[];
    return lastFrameRef[0];
  }

  private get total() {
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
      console.error("not enough pins");
      return;
    }
    const rollIndex = this.rolls.length;
    this.rolls.push(value);
    // console.log("Player rolls ball #", rollIndex, "value", value);
    this.currentFrame.roll(value, rollIndex);
    if (this.currentFrame.isCompleted()) {
      this.currentFrameIndex++;
    }
  }
}
</script>

<style scoped></style>
