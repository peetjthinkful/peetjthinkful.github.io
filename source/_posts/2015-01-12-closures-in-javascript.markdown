---

layout: post
title: "What is a Closure in Javascript"
date: 2015-01-07 10:59:00 +1000
comments: true
categories: [development,architecture,frontendweb,javascript,closures]

---
###Introduction
What is a closure in Javascript? This concept eluded me for ages until finally over time I understood what exactly it was and why it was useful. It is actually not that difficult to understand, it's just that often when something is difficult to describe, most people find it difficult to do just that - describe it simply! Hence I found myself reading many articles telling me that closures are really amazing but not quite explaining why sufficiently enough to satisfy my curiosity.

####Functions and Scope
Let's look at a simple function:

	function myFunc(){
		var myVar = 1;
		
		// Do something with myVar
		myVar++;
	}
	
Looking at this function, we can see that when it runs ie. when it is in scope, the variable `myVar` is also in scope and we can set it or interrogate it or whatever. When the function has completed, however, myVar simply cannot be accessed. It is as if it never existed.

One thing to note about functions is that it is possible to have a function within a function or if you like an 'inner' function. Take a look at the following example:

	function myFunc(){
		var myVar = 1;
		
		// Do something with myVar
		myVar++;
		
		function myInnerFunc(){
			// NB - We have access to the outer function scope!
			myVar--;
		}
	}
	
So you can probably see that the inner function `myInnerFunc` in the example above attempts to access the variable `myVar` which is declared in the outer function `myFunc`.

The attempt to access the variable `myVar` is successful in this case. Why? Because in Javascript an inner function has access to the variables declared in the outer function in which it resides.

With that in mind, what if we wrote the function like this:

	function myFunc(){
		var myVar = 1;
		
		// Do something with myVar
		myVar++;
		
		var myInnerFunc = function(val){
			// NB - We have access to the outer function scope!
			myVar = val;
			return myVar;
		}
		
		// Return an object interface
		return {
			callMyInnerFunc: myInnerFunc
		}
	}
	
This time we are returning `myVar` from `myInnerFunc`. The interesting thing here is that once the function `myFunc` has run, we should not be able to access `myVar` because it is now out of scope. However, if we copy the function into the Chrome console and then run it we get this:

	> obj = myFunc()
	Object {callMyInnerFunc: function}
	
	obj.callMyInnerFunc(3)
	3
	
Interesting eh? The inner function `myInnerFunc` was called, the result being that it returned the current value of `myVar` (after setting it) which should have been off limits to us!

Why wasn't it?

####Enter Closures
Simply put (because quite often it isn't 'simply put' !!) a closure allows us to (indirectly) access local variables that are no longer in scope.

Another way of putting it is that a function's scope is retained after it has been executed.

That means that we can potentially access variable data from the 'retained scope' of a function that we have already run.

Let's look at a couple of potentaially useful situations:

#####Encapsulation

Encapsulation _"allows selective hiding of properties and methods in an object by building an impenetrable wall to protect the code from accidental corruption"_ - [Wikipedia](http://bit.ly/1y38V5T)

The following example simulates encapsulation with a function that creates a 'Person' object. The user of the function is unable to access the local (hidden) variables `_dob` and `_name` but can get their values through the accessor functions `getTheDob` and `getTheName`. A _closure_ is created around these variables by the accessor functions and the return object interface gives the client code an entry point.

This gives us an obvious use for closures. The creation of Objects utilising private properties and methods. We allow the client code to use the interface that we want them to see and 'hide' the rest.

	function createPerson(options){
		
		/* Create some local variables for our person */
		var _dob = options && options.dob ? options.dob : "08/01/1947";
		var _name = options && options.name ? options.name : "David Jones";
		
		/* Create our accessor functions */
		var getDob = function(){
			return _dob;
		}
		
		var getName = function(){
			return _name;
		}		
		
		/* Specify our person interface that we will return to the user */
		return {
			getTheName: getName,
			getTheDob: getDob
		}
	}
	
#####Creating a function within a loop
A common Javascript "gotcha" is the 'looping problem'. This occurs where you create a function within a loop. Take this example where you may expect the loop counter variable to retain itself within the function even though it is changing within the loops context with each iteration:

	var myItems = [ e1, e2, e3, e4, e5, e6, e7, e8, e9, e10 ]; /* 10 DOM Elements */
	 
	for (var i = 0; i < myItems.length; ++i) {
	    myItems[i].onclick = function() {
	        console.log( 'You clicked element: ' + i );
	    };
	}	
	
By the time any of the elements are clicked on, i is now 9, which means the message that you will always get is "You clicked element: 9".

This is something that is easy to get caught out on and sometimes it can be difficult to find the source of the problem.

The problem can be solved by creating a function that is called on every iteration of the loop while passing `i`. The act of calling the function will create a new execution context where the value of `i` is retained and can be used in the returned function. Thus:

	function getClickHandler(n) {
	    return function() {
	        console.log( 'You clicked element: ' + n );
	    };
	}
	
	for (var i = 0; i < myItems.length; ++i) {
    	myItems[i].onclick = getClickHandler(i);
	}
	
It is worth noting that a common shortcut can be used to create and call the function at the same time. This is what is known as an Immediately-Invoked-Function-Expression:

	for (var i = 0; i < myItems.length; ++i) {
    	myItems[i].onclick = (function(n){
    		return function() {
	        	console.log( 'You clicked element: ' + n );
	    	};
	    })(i);
	}

This way tends to be used more often as it is more concise.

So there it is!

Hopefully this has given you a bit of a taste for closures, what they are and how to use them. I would like to reference the following posts as they helped me in the writing of this article:

[Closures in Javascript - James Padolsey](http://james.padolsey.com/javascript/closures-in-javascript/)

[Understand Javascript Closures with ease](http://javascriptissexy.com/understand-javascript-closures-with-ease/)

[Ben Alman](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)	