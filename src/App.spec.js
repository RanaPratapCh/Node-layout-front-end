import { shallowMount } from "@vue/test-utils"
import App from "./App.vue"
import NodeLayout from './components/nodeLayout.vue';

describe("App", () => {
    const wrapper = shallowMount(App);
    it("should test the node layout is exist or not", () => {
        expect(wrapper.findComponent(NodeLayout).exists()).toBe(true);
    });
});