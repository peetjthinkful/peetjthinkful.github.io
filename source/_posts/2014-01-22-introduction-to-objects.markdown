---
layout: post
title: "Introduction to Objects"
date: 2014-01-22 00:23:10 +1100
comments: true
categories: 
---
**During a mentor session with one of my students, we started talking about how she might approach the Shopping List project. The obvious and simplest approach was (from an implementation point of view) to hold a bunch of String objects inside an array. However, on reflection we felt that this could perhaps be too simplistic. For example, let's say that one of the project requirements was to be able to cross out items on the list instead of deleting the item. It would be pretty hard to represent this if all we had was an Array of String objects.**

Enter the Object. As we discussed the problem, we realised that if we could perhaps have a slightly more complex representation of the item in the list (after all each item is a real thing, has certain properties and is certainly more than a just a string of letters!), then perhaps we could give the item a certain state which would mean that it is deleted but not removed from the list - ie. crossed out.

It seemed to me to be the perfect place to start introducing objects in our mentor sessions. Let's take a look at how we might model a shopping list in Javascript.

Let's say that we have 3 items in our shopping list: Bread, Apples and Whiskey. It would be very simple to implement this as a Javascript Array like so:

###Example 1 - A Shopping List as an Array of Strings

	var myShoppingList = [];
	myShoppingList.push("Bread");
	myShoppingList.push("Apples");
	myShoppingList.push("Whiskey");

Done! Its simple but one might say it is too 'simplistic', ie. you might find for example that you want to model some behaviour but this implementation won't support it. For example if I wanted to be able to delete items from the list I would be ok - just get rid of the String object from the Array.

However, if I wanted to merely cross out items, so I could retain the item in the list but have it notionally deleted - I might want to cross off items as I put them in my cart - then it would be pretty tricky to implement this behaviour with an Array of Strings. Of course it could be done and in numerous ways, however I believe that these 'solutions' would not be as intuitive and robust and a solution that employed an Array of Objects rather than Strings.

###Example 2 - Introducing the Object way
	
	var myShoppingList = [];
	myShoppingList.push({ itemName: "Bread", itemPrice: 3.60, isDeleted: false});
	myShoppingList.push({ itemName: "Apples", itemPrice: 1.60, isDeleted: false});
	myShoppingList.push({ itemName: "Whiskey", itemPrice: 100.95, isDeleted: false});
	
The example above adds 3 objects to the `myShoppingList` Array. Note that the objects themselves are *object literals* created with the `{}` or curly brace syntax. Let's take one of the objects and break it down, before explaining why we gave it the attributes we did. So - I want a bottle of Whiskey for Christmas, so I added it to my shopping list:

	{ 
		itemName: "Whiskey", 
		itemPrice: 100.95, 
		isDeleted: false
	}
	
Let us (sort of) digress for a moment. It's pretty clear that I have given my bottle of whiskey 3 properties: a name, a price and an `isDeleted` property. The name and the price are pretty obvious but the `isDeleted` property means that I can still have the bottle of whiskey in the list but have it notionally crossed off the list. You could access the whiskey from the Array as follows:

var myWhiskeyBottle = myShoppingList[0];

You could further access any of the properties thus:

	var nameOfWhiskey = myWhiskeyBottle.name;
	var priceOfWhiskey = myWhiskeyBottle.price;
	var stateOfWhiskey = myWhiskeyBottle.isDeleted;
	
	console.log(nameOfWhiskey);
	console.log(priceOfWhiskey);
	console.log(stateOfWhiskey);

You will notice that I gave the whiskey an `isDeleted` value of `false`. So the scenario is as follows: 

I'm in the Bottle shop and I put my favourite bottle in my trolley. I cross it off my list. Effectively it has been deleted from the list but my requirements dictate that I should still see it on the list with a line through it. So I simply set the `isDeleted` property to `true`.

My Array looks like this:

	myShoppingList[0].isDeleted = false;
	myShoppingList[1].isDeleted = false;
	myShoppingList[2].isDeleted = true;

My Shopping list looks like this:

* Bread,
* Apples,
* ~~Whiskey~~
	
The `isDeleted` property has given us the ability to provide a richer interface. This is just with a few object literals with a few simple properties. It is worth noting at this point that if we were building a production system we would find another more robust & reusable way to create the objects themselves - however the point is here to get a sense of their usefulness in this and other non-trivial situations.

Hopefully I have shown the value of starting to use objects in your code where you are trying to model even the simplest of things. Don't worry about starting with a simple object literal. You can get more complex as you begin to understand more about Javascript and system design.

If you have any comments or questions regarding the above please don't hesitate to contact me.
 
**Email: pjanuarius@thinkful.com** 

**Twitter: @peetj**
