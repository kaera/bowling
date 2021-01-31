<template>
  <div>
    Game board
    <table>
      <tr>
        <td>
          <Frame />
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
export default class Board extends Vue {}
</script>

<style scoped>
table,
td {
  border: 1px solid;
}
</style>
