toy project no.1, Chrome extension

# Youtube-Related-Videos-Remover
Sometimes you may want to remove or disable some related videos and see comments first. This does that.

[Chrome web store link](https://chrome.google.com/webstore/detail/pnllijckhhmdphamnkihmigimjegedle/)

## What it does
### Before (Close Related Videos)
![001_before](https://user-images.githubusercontent.com/96367152/158127630-8a9fd25e-889d-48c2-9b92-8e8d97221094.png)
### After (Open Related Videos)
![002_after](https://user-images.githubusercontent.com/96367152/158127637-719286e7-d0b9-48bd-9a96-133e34567ad4.png)

## Features
1. Toggle collapse Youtube related videos.
2. Automatically redirects Youtube Shorts to normal Youtube player's layout. 
3. Hover Youtube player so that you can scroll down watching video.
4. Popcat on extension's popup page.

## Devlog (KST, UTC+09:00)
<details>
  <summary>Click to expand!</summary>

### 2022-04-10 20:25 - version 1.1.9.1
minor big fix
### 2022-04-08 18:03 - version 1.1.9
PIP mode added, code by Google.
### 2022-04-08 16:38 - version 1.1.8
Button will hover after you click Hover Video.
### 2022-04-05 20:39 - version 1.1.7.3
minor bug fixed
### 2022-04-03 21:48 - version 1.1.7.2
minor bug fixed
### 2022-04-03 19:58 - version 1.1.7
minor bug fixed
### 2022-04-03 19:46 - version 1.1.6
popcat added on popup page.
### 2022-04-03 18:45 - version 1.1.5
Comments will no longer cover/be on the Youtube player.
### 2022-04-02 01:25
Video Hovering feature added.

This just adds `position:fixed` to youtube player, so it may look cursed.

But that's fine. That's what I intended. Because I just wanted to watch videos and comments at the same time.

... But I'll fix that.
### 2022-04-02 00:23
Minor bug fixed, minor design changed.
### 2022-03-26 01:50
Now youtube `shorts` link will be redirected to `watch`.

youtube.com/`shorts`/blahblah -> youtube.com/`watch`/blahblah

I just hate Youtube Shorts contents' layout.
### 2022-03-25 17:25
Now auto theatre mode added.

After you close the related videos, you'll be watching youtube in theatre mode. with closed related videos.

But of course, you can watch in theatre mode with opened related videos.

Just click 'open related videos and click theatre mode icon in youtube player manually.
### 2022-03-16 01:59
Now not only vertical mode, but also wide mode is supported.

And also minor bug fix.
### 2022-03-14 23:49
Button duplication issue has been solved.
### 2022-03-14 21:57
localstorage done, now even if you reload the browser, closed/open button value will be saved.
### 2022-03-14 16:08
Now collapse function works, but I need to make some to remain the collapsed status even after I reload the site.

Maybe I need to know how to deal with localStorage stuff.
</details>