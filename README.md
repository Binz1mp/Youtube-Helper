# Youtube Helper

Simple layout and player controls for YouTube: hide related videos, keep watching while scrolling, and choose how Shorts open.

[Install from the Chrome Web Store](https://chrome.google.com/webstore/detail/pnllijckhhmdphamnkihmigimjegedle/)

## Features

- Hide or show related videos and switch to a wider layout.
- Automatically show a mini player when the video scrolls out of view.
- Pin the player, drag it to another position, and resize it.
- Adjust subtitle size from 50% to 200% in the floating menu.
- Open Shorts in the regular player, with an option to turn conversion off.
- Use picture-in-picture (PIP) or jump back to the top of the page.
- Click Popcat in the extension popup for a sound.

The interface supports English and Korean.

## Usage

1. Open a YouTube video. The button row appears below the description, above the comments.
2. Scroll down to use the automatic mini player, or select **Pin video** to keep the player fixed at its current size. Drag the title bar to move it and the corner to resize it.
3. Click the floating **+** button to open the viewing tools and subtitle size control. Click the displayed percentage to reset subtitle size to 100%.
4. Open the extension popup to change **Open Shorts as videos**. It is enabled by default, and changes apply to open YouTube tabs.

After updating or reloading the extension, refresh your open YouTube tabs once to load the new version.

## Install from source

1. Clone or download this repository. Extract it if downloaded as a ZIP.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the folder containing `manifest.json`.

No build step is required.

## Demo

[![Watch the Youtube Helper demo](https://user-images.githubusercontent.com/96367152/162658122-39d7dc99-a2e0-40ff-9b0e-8ca06a9924a9.png)](https://www.youtube.com/watch?v=BxXAmUqmynY)

The demo and screenshots below show an earlier version of the interface.

## Screenshots

<details>
  <summary>Hide related videos</summary>

![Related videos hidden](https://user-images.githubusercontent.com/96367152/162660380-1952b31a-a940-4ce8-85f7-f568df41a0fd.png)

</details>

<details>
  <summary>Shorts in the regular player</summary>

![Shorts in the regular player](https://user-images.githubusercontent.com/96367152/169981712-9bf3f272-6941-4d82-aef0-f496c402762f.png)

</details>

<details>
  <summary>Pinned player</summary>

![Pinned player](https://user-images.githubusercontent.com/96367152/162660384-a6adff37-fd38-4d79-add3-384a68d96cae.png)

</details>

<details>
  <summary>Picture-in-picture</summary>

![Picture-in-picture](https://user-images.githubusercontent.com/96367152/162660386-0876bbdc-60d3-4245-af96-d3f40f01735f.png)

</details>

## Links

- [Report an issue](https://github.com/Binz1mp/Youtube-Helper/issues)
- Update notes: [English](updatenote/update_en.html) · [한국어](updatenote/update_ko.html)
