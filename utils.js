// Get The Active URL of The Tab
export async function getActiveTabURL() {
    let queryOption = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOption);
    return tab;
}

// Create Element Func
export function createElement(elemType) {
    return document.createElement(elemType);
}

// Add Child To Parent Element Func
export function addChildElem(parentElem, childElem) {
    return parentElem.appendChild(childElem);
}

// Add Class To Element
export function addClassNameToElem(elem, className) {
    return elem.classList.add(className);
}