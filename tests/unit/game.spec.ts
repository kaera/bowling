import { mount, Wrapper } from "@vue/test-utils";
import Game from "@/components/Game.vue";

describe("Game.vue", () => {
  let wrapper: Wrapper<Game>;

  beforeEach(() => {
    wrapper = mount(Game);
  });

  it("should have 0 boards by default", () => {
    const tableRows = wrapper.findAll("tr");
    expect(tableRows.length).toBe(1);
  });

  it("should display player form by default", () => {
    expect(wrapper.find("form").exists()).toBe(true);
  });

  it("should add a player board on form submit", async () => {
    await wrapper.find("form").trigger("submit");

    const tableRows = wrapper.findAll("tr");
    expect(tableRows.length).toBe(2);
    expect(wrapper.text()).toMatch("John Doe");
  });

  it("should not display start game buttons for 0 players", async () => {
    const startGameButtonWrapper = wrapper
      .findAll("button")
      .filter((button) => button.text() === "Start Game");

    expect(startGameButtonWrapper.length).toBe(0);
  });

  it("should display start game buttons for 1 or more players", async () => {
    await wrapper.find("form").trigger("submit");
    const startGameButtonWrapper = wrapper
      .findAll("button")
      .filter((button) => button.text() === "Start Game");

    expect(startGameButtonWrapper.length).toBe(1);
  });

  it("should hide the form and start buttons on game start", async () => {
    await wrapper.find("form").trigger("submit");
    await wrapper
      .findAll("button")
      .filter((button) => button.text() === "Start Game")
      .trigger("click");

    expect(wrapper.find("form").exists()).toBe(false);
    expect(
      wrapper
        .findAll("button")
        .filter((button) => button.text() === "Start Game").length,
    ).toBe(0);
  });

  it("should run the game and show the result", async () => {
    await wrapper.find("form").trigger("submit");
    await wrapper
      .findAll("button")
      .filter((button) => button.text() === "Start Game")
      .trigger("click");

    const rollButtonWrapper = wrapper
      .findAll("button")
      .filter((button) => button.text() === "10");

    for (let i = 0; i < 12; i++) {
      await rollButtonWrapper.trigger("click");
    }

    expect(wrapper.find("h3").text()).toMatch("John Doe won!");
    expect(
      wrapper
        .findAll("button")
        .filter((button) => button.text() === "Reset Game").length,
    ).toBe(1);
  });
});
