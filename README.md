Toy project no.1, Chrome extension

# Youtube Helper
Sometimes you may want to remove or disable some related videos and see comments first. This does that.

[Chrome Web Store link](https://chrome.google.com/webstore/detail/pnllijckhhmdphamnkihmigimjegedle/)

<!-- The version may differ, I recommend you download it via [Github Releases page.](https://github.com/Binz1mp/Youtube-Related-Videos-Remover/releases) -->


## Showcase (Youtube Video)
[![Showcase (Youtube Video)](https://user-images.githubusercontent.com/96367152/162658122-39d7dc99-a2e0-40ff-9b0e-8ca06a9924a9.png)](https://www.youtube.com/watch?v=BxXAmUqmynY)

Click this logo to watch showcase. (if you want)

## Features in text
1. Toggle collapse Youtube related videos.
2. Automatically redirects Youtube Shorts to normal Youtube player's layout.
3. Hover Youtube player so that you can scroll down while you watching video.
4. Popcat on extension's popup page. (and also click sound!)
5. PIP button

## Features with image
#### Toggle collapse Youtube related videos.
<details>
  <summary>Click to expand!</summary>

![001](https://user-images.githubusercontent.com/96367152/162660380-1952b31a-a940-4ce8-85f7-f568df41a0fd.png)
</details>

#### Hover Youtube player so that you can scroll down watching video.
<details>
  <summary>Click to expand!</summary>

![002](https://user-images.githubusercontent.com/96367152/162660384-a6adff37-fd38-4d79-add3-384a68d96cae.png)
</details>

#### PIP button
<details>
  <summary>Click to expand!</summary>

![003](https://user-images.githubusercontent.com/96367152/162660386-0876bbdc-60d3-4245-af96-d3f40f01735f.png)
</details>

## Devlog (KST, UTC+09:00)
<details>
  <summary>Click to expand!</summary>

### 2022-04-13 14:30 - version 1.1.9.2
Project name changed, Youtuve Related Videos Remover -> Youtube Helper.

Thanks for recommendation!
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
