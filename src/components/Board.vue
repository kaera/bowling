<template>
  <div>
    Game board
    <table>
      <tr>
        <td v-for="(ref, i) in refs" :key="i">
          <Frame :index="i" :ref="ref" :refs="$refs" :rolls="rolls" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Frame from "./Frame.vue";

@Component({
  components: {
    Frame,
  },
})
export default class Board extends Vue {
  private refs = [...Array(10)].map((_, i) => "frame" + i);
  private rolls: number[] = [];
  private currentFrameIndex = 0;

  get currentFrame() {
    const ref = this.$refs["frame" + this.currentFrameIndex] as Frame[];
    return ref?.[0];
  }

  isCompleted() {
    const lastFrameRef = this.$refs.frame9 as Frame[];
    return lastFrameRef[0].isCompleted();
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

<style scoped>
table,
td {
  border: 1px solid;
}
</style>
