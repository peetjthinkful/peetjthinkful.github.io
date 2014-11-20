---

layout: post
title: "Principles of development #2 - Decoupling"
date: 2014-11-21 12:15:20 +1000
comments: true
categories: [development,architecture,frontendweb]

---

I was once asked in an interview by a very smart architect to describe the most important aspects of a good architecture. I replied that it should be simple and decoupled. Fortunately he agreed with me although I didn't end up working for the company!

I believe that if you have these 2 things going for you then you are off to a great start. Often, other facets of a good architecture follow from these two principles. For example 'extensibility' - the ease of adding new and extra functionality to your existing system. A decoupled system will certainly enable you to add new parts with minimal fuss.

The key here is dependency. In a decoupled system, each 'component' works without needing the other components in the system ie. a given component is not dependent on any other. If it were, then we wouldn't even be able to load and initialise it without loading some other component first.

So, how does such a system work. Well one way of making this work is by implementing some kind of message layer. Components talk to each other by passing and receiving  messages. Let's look at an example to round things off.

Let's imagine that our system is made up of a mapping component (MP1) and a graphing component (G1). The job of MP1 is to display a map of Australia revealing the 50 hottest places last summer. These show up as 'hot spots' on the map when it is rendered. MP1 then 'publishes' a message to the message layer. The message itself contains an identifier and a payload. The identifier is just a name - let's call it 'HOTSPOT_DATA_MSG'. The payload contains some structured data obviously related to the top 50 hotspots.

Meanwhile, G1 has informed the message layer that it would like to know about any message with the name HOTSPOT_DATA_MSG - in other words it 'subscribes' to a message with a particular name. Whenever such a message is sent, G1 receives it and displays a nice graph of the temperatures of the 50 hottest places in Australia.

You will notice that there is a single dependency in this kind of a system. every component is dependent on the messaging layer component which itself exists just to send and receive messages between components like a kind of telephone exchange operator. This enables components to both co-exist without depending on each other. The only dependencies are the core aspects of the system.


![alt text](/images/component-messaging.png "Component Messaging")

__Decoupling Components__