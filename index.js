import { getActiveTabURL, createElement, addChildElem, addClassNameToElem} from "./utils";

// adding a new bookmark row to the popup
const addNewBookmark = (bookmarksElement, bookmark) => {
  const bookmarkTitleElement = createElement("div")
  const newBookmarkElement = createElement("div")
  const controlsElement = createElement("div");

  bookmarkTitleElement.textContent = bookmark.desc;
  addClassNameToElem(bookmarkTitleElement, "bookmark-title");

  addClassNameToElem(controlsElement, "bookmark-controls");

  newBookmarkElement.id = `bookmark-${bookmark.time}`;
  addClassNameToElem(newBookmarkElement, "bookmark")
  newBookmarkElement.setAttribute("timestamp", bookmark.time);

  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  // Append the child elements
  addChildElem(newBookmarkElement, bookmarkTitleElement);
  addChildElem(newBookmarkElement, controlsElement);
  addChildElem(bookmarksElement, newBookmarkElement);
};

// View Bookmarks Func
const viewBookmarks = (currentBookmarks = []) => {
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";

  if (currentBookmarks.length > 0) {
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
  }
};

// Play Bookmark Func
const onPlay = async (e) => {
  const activeTab = await getActiveTabURL();
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};

// Delet Bookmark Func
const onDelete = async (e) => {
  const activeTab = await getActiveTabURL();
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const bookmarksElementToDelete = document.getElementById(
    `bookmark-${bookmark.time}`
  );

  bookmarksElementToDelete.parentNode.removeChild(bookmarksElementToDelete);

  chrome.tabs.sendMessage(
    activeTab.id,
    {
      type: "DELETE",
      value: bookmarkTime,
    },
    viewBookmarks
  );
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = createElement("img");

  controlElement.src = `assets/${src}.png`;
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);

  addChildElem(controlParentElement, controlElement);
};

// Loads the conent of HTML
document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideo = urlParameters.get("v");
u
  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.tabs.storage.get([currentVideo], (data) => {
      data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

      viewBookmarks();
    });
  } else {
    const container = document.querySelector(".container")[0];
    container.innerHTML =
      '<div class="title">This page is not a youtube vide page</div>';
  }
});

