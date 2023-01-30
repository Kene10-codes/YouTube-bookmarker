import { createElement, addClassNameToElem } from "./utils";

(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];

  // Receive the response generated from the tab
  chrome.tabs.onMessage((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type == "NEW") {
      currentVideo = videoId;
      newVideoLoaded();
    } else if (type == "PLAY") {
      youtubePlayer.currentTime = value;
    } else if (type == "DELETE") {
      currentVideoBookmarks = currentVideoBookmarks.filter(
        (a) => a.time != value
      );
      chrome.storage.sync.set({
        [currentVideo]: JSON.stringify(currentVideoBookmarks),
      });

      response(currentVideoBookmarks);
    }
  });

  // Fetch bookmarks if it's available
  function fetchBookmarks() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideo], (obj) => [
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []),
      ]);
    });
  }

  async function newVideoLoaded() {
    const bookmarkBtnExists = document.querySelector(".bookmark-btn")[0];
    currentVideoBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {
      const bookmarkBtn = createElement("img");

      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      addClassNameToElem(bookmarkBtn, "ytp-button bookmark-btn");
      bookmark.title = "Click bookmark current timestamp";

      youtubeLeftControls = document.querySelector(".ytp-left-controles")[0];
      youtubePlayer = document.querySelector(".video-stream")[0];

      youtubeLeftControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkHandler);
    }
  }

  async function addNewBookmarkHandler() {
    const currentTime = youtubePlayer.currentTime;

    // Updates the bookmarks
    currentVideoBookmarks = await fetchBookmarks();

    const newBookmark = {
      time: currentTime,
      disc: `Bookmark at ${getTime(currentTime)}`,
    };

    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
      ),
    });
  }
  // Invoke New Video Loaded
  newVideoLoaded();
})();

// Get Time Func
function getTime(t) {
  data = new Date(0);
  Date.setSeconds(t);

  return data.toISOString().substr(11, 8);
}
