import { mount, Wrapper } from "@vue/test-utils";
import Board from "@/components/Board.vue";

type IBoard = Board & {
  total: number;
  reset: () => void;
  roll: (value: number, index: number) => void;
};

describe("Board.vue", () => {
  let board: IBoard;
  let wrapper: Wrapper<Board>;

  beforeEach(() => {
    wrapper = mount(Board, {
      propsData: { name: "Player" },
    });
    board = wrapper.vm as IBoard;
  });

  it("should display player's name", () => {
    expect(wrapper.text()).toMatch("Player");
  });

  it("should not count score after first roll", () => {
    board.roll(4, 0);
    expect(board.total).toBeUndefined();
  });

  it("should not count score after first roll", () => {
    board.roll(4, 0);
    expect(board.total).toBeUndefined();
  });

  it("should count score after first frame", () => {
    board.roll(4, 0);
    board.roll(4, 1);
    expect(board.total).toBe(8);
  });

  it("should not count score after first frame in case of spare", () => {
    board.roll(5, 0);
    board.roll(5, 1);
    expect(board.total).toBeUndefined();
  });

  it("should count score after first roll after spare", () => {
    board.roll(5, 0);
    board.roll(5, 1);
    board.roll(4, 2);
    board.roll(3, 2);
    expect(board.total).toBe(21);
  });

  it("should not count score after strike", () => {
    board.roll(10, 0);
    expect(board.total).toBeUndefined();
    board.roll(5, 1);
    expect(board.total).toBeUndefined();
  });

  it("should count score after two rolls after strike", () => {
    board.roll(10, 0);
    board.roll(5, 1);
    board.roll(4, 2);
    expect(board.total).toBe(28);
  });

  it("should correctly handle game with pins not hit", () => {
    for (let i = 0; i < 20; i++) {
      board.roll(0, i);
    }
    expect(board.total).toBe(0);
  });

  it("should correctly handle game with rolls of 1 spin knocked down", () => {
    for (let i = 0; i < 20; i++) {
      board.roll(1, i);
    }
    expect(board.total).toBe(20);
  });

  it("should correctly handle game with spares", () => {
    for (let i = 0; i < 21; i++) {
      board.roll(5, i);
    }
    expect(board.total).toBe(150);
  });

  it("should correctly handle perfect game", () => {
    for (let i = 0; i < 12; i++) {
      board.roll(10, i);
    }
    expect(board.total).toBe(300);
  });

  it("should reset the game", () => {
    board.roll(4, 0);
    board.roll(4, 1);
    board.reset();

    expect(board.total).toBeUndefined();
  });
});
