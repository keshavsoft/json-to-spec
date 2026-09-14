import { interpolateString } from "./interpolate.js";

export const injectStory = (cloned, localNode, currentItem, localRootData) => {
    if (typeof localNode.story !== "string" || localNode.story.trim() === "") return cloned;

    const storyText = interpolateString({
        inText: localNode.story,
        inItemContext: currentItem,
        inRootData: localRootData
    });

    const storyTitle = typeof localNode.storyTitle === "string" && localNode.storyTitle.trim() !== ""
        ? interpolateString({ inText: localNode.storyTitle, inItemContext: currentItem, inRootData: localRootData })
        : null;

    const storyTag = (typeof localNode.storyTag === "string" && localNode.storyTag.trim() !== "") ? localNode.storyTag : "p";
    const storyClass = (typeof localNode.storyClass === "string" && localNode.storyClass.trim() !== "") ? localNode.storyClass : "story text-muted small";
    const storyPosition = localNode.storyPosition === "append" ? "append" : "prepend";

    cloned.children = Array.isArray(cloned.children) ? cloned.children : [];

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
        cloned.children.unshift(...storyNodes);
    } else {
        cloned.children.push(...storyNodes);
    }

    return cloned;
};

export default injectStory;
