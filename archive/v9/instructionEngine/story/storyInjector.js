import { interpolateString } from "../value/interpolate.js";

export const injectStory = (cloned, originalNode, currentItem, inRootData) => {
    if (typeof originalNode.story !== "string" || originalNode.story.trim() === "") return cloned;

    const storyText = interpolateString({
        inText: originalNode.story,
        inItemContext: currentItem,
        inRootData
    });

    const storyTitle = typeof originalNode.storyTitle === "string" && originalNode.storyTitle.trim() !== ""
        ? interpolateString({
            inText: originalNode.storyTitle,
            inItemContext: currentItem,
            inRootData
        })
        : null;

    const storyTag = (typeof originalNode.storyTag === "string" && originalNode.storyTag.trim() !== "") ? originalNode.storyTag : "p";
    const storyClass = (typeof originalNode.storyClass === "string" && originalNode.storyClass.trim() !== "") ? originalNode.storyClass : "story text-muted small";
    const storyPosition = originalNode.storyPosition === "append" ? "append" : "prepend";

    const nextChildren = Array.isArray(cloned.children) ? cloned.children : [];
    const storyNodes = [];

    if (storyTitle) {
        storyNodes.push({
            tagName: "strong",
            attributes: { class: "story-title d-block" },
            textContent: storyTitle
        });
    }

    storyNodes.push({
        tagName: storyTag,
        attributes: { class: storyClass },
        textContent: storyText
    });

    if (storyPosition === "prepend") {
        cloned.children = [...storyNodes, ...nextChildren];
    } else {
        cloned.children = [...nextChildren, ...storyNodes];
    }

    return cloned;
};

export default injectStory;
