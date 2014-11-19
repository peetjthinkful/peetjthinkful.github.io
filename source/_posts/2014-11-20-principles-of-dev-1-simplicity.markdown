---
layout: post
title: "Principles of development #1 - Simplicity"
date: 2014-11-20 12:15:20 +1000
comments: true
categories: Development
---

One of the most important factors to keep in mind when developing any non-trivial application is maintenence. If an issue arises or additional functionality needs to be built then a simplified design & architecture will go a long way to help you either fix the issue or build the new functionality. 

Simplification of the architecture means less connection points between different areas of the application which in turns means less potential for bugs.

Any project with more than a single developer will invariably mean that one day you will have to hand over your code (probably many thousands of lines of Javascript or something similar!) to your team mate while you go off skiing for a week. Well let's hope your design is as simple as you can make it because otherwise he or she will give you the cold shoulder when you get back!!

Seriously though, simplicity means a reusable and extensible system. Not to mention that such things are more fun to work on than over-engineered monstrosities. I personally have worked with components that were so complex in their design that I was at a total loss when any adjustments had to be made. I have subsequently worked with components that have the same functionality but were incredibly simple to use and work with. Sometimes developers are too clever for their own good!

Next time you have to design and code something, think of your team mates as well as your users...and keep it simple!