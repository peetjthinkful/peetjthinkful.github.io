---
layout: post
title: "Backups, backups and more backups"
date: 2014-11-08 18:07:00 +1000
comments: true
categories: IT
---

You would've thought that I had learnt my lesson when it comes to backing up my files. I think I  must have helped dozens of friends over the years who had lost a critical file and hadn't made a backup. Well I managed to do exactly the same thing at work the other day. 

I was working in [Sublime Text 3](http://www.sublimetext.com/) on Windows and managed to lose a mornings work - Doh! I quickly realised that I had no local history and hadn't committed to any repository for a while. Hmmmm... what to do! Well nothing actually, I just had to write all the code again !!!

I did, however find a nice local history plugin for Sublime Text which is really the point of this post. No more troubles!

[Local History](https://github.com/vishr/local-history) is a Sublime Text (2 & 3) plugin for maintaining local history of files. [backup | open | compare | incremental diff].

It helps if you have the [package installer](https://sublime.wbond.net/) for ST. In this case just type 'Local History' at the install package prompt and there you go.

Once installed, I just configured the user settings to have a `history_retention` of 90 days:

	{
      "history_retention": 90, // in days
	}

Seems to work really well!

Another backup solution that I have signed up for is [ZipCloud](https://www.zipcloud.com/planprice-information). I've included a link to the pricing page as it is difficult to find. You only get a few Gig if you get the free plan so I upgraded to the Premium Plan and am paying about 7 USD per month.

The reason I needed it is that I am upgrading my Mac to Yosemite and don't really have an adequate backup solution. After running the backup client for about 2 weeks (yes really!), I finally backed up everything. It was quite impressive as I just had to pause it everytime I needed to - other than that I ran it constantly.

It is finally done and I can now upgrade. Yay!


![Backups by ahajokes.com](../images/backup.gif "Backups, backups")


