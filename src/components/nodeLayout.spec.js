import { shallowMount } from "@vue/test-utils"
import NodeLayout from "./nodeLayout.vue"
import { nextTick } from "vue";

describe("NodeLayout", () => {
    const wrapper = shallowMount(NodeLayout);
    const event = {};
    const data = {
        data: {
            data: {
                name: "A",
                description: "This is description of A"
            }
        }
    };
    
    it("should test the node-layout is exist or not", () => {
        expect(wrapper.find('#nodeStructure').exists()).toBe(true);
    });

    it("should test the popup box is exist or not", async () => {
        expect(wrapper.find('.popup-box').exists()).toBe(false);
        wrapper.vm.showPopUp = true;
        await nextTick();
        expect(wrapper.find('.popup-box').exists()).toBe(true);
    });

    it("should test the selectedNode when clicked on node", async () => {
        const spyEvent = jest.spyOn(wrapper.vm, 'onSelectNode');
        await wrapper.vm.onSelectNode(event, data);
        expect(spyEvent).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.showPopUp).toBe(true);
        expect(wrapper.vm.popUpData).toStrictEqual({
            name: "A",
            description: "This is description of A"
        });
    });

    it("should test the popup text", async () => {
        await wrapper.vm.onSelectNode(event, data);
        expect(wrapper.find('.popup-box').exists()).toBe(true);
        expect(wrapper.find('.popup-box #name').text()).toBe('A');
        expect(wrapper.find('.popup-box #description').text()).toBe('This is description of A');
    })
    
    it("should test the close popup event", async () => {
        const spyCloseModal = jest.spyOn(wrapper.vm, 'closePopUp');
        wrapper.vm.showPopUp = false;
        await nextTick();
        expect(wrapper.find('.closeButton').exists()).toBe(false);
        wrapper.vm.showPopUp = true;
        await nextTick();
        expect(wrapper.find('.closeButton').exists()).toBe(true);
        await wrapper.find('.closeButton').trigger('click');
        expect(spyCloseModal).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.showPopUp).toBe(false);
        expect(wrapper.vm.popUpData).toStrictEqual({});
    });
});