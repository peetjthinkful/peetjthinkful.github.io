---

layout: post
title: "Principles of development #3 - Structure"
date: 2014-11-27 12:15:20 +1000
comments: true
categories: [development,architecture,frontendweb,beginner,jquery]

---
###Level: Beginner
If you have followed along so far, you will know that a good frontend architecture should consist of a set of interconnected components that embrace a decoupled and simple design. In this post we are looking at structure. Each component or set of components should follow a certain structure that should be meaningful and easy to follow (simple enough). Make sure that everything contained within your code is there for a reason. This will help structure and simplify.

Note that this applies whether you are using a 'framework' or not. Framework code can still be messy, complex and hard to follow. I know this because I have worked with code bases that although built on a framework are very difficult to follow and debug. Learn to structure your code _without_ using a framework first and then move on to the complexity of frameworks!.

###Structured HTML
For most websites, unless you are doing a complex single page application (in which case you probably won't be reading this!), the structure is going to be very similar. The page will start with a header with some navigation followed by the main body of content and finally a footer. Believe me - after looking at thousands of pages over the years I have found this to be true. In effect, your page will look like this:

	<html>
		<head>
			<title>My Page Like Everyone Elses</title>
			<!-- Insert stylesheets here -->
			<link rel="stylesheet" href="my.css"/>
		</head>
		<body>
			<header>
				<nav><!-- Insert navigation here --></nav>
			</header>
			<div id="wrapper">
				<!-- Main body of content here -->
			</div>
			<footer>
				<!-- Insert footer here -->
			</footer>
			
			<!-- Insert scripts here -->
			<script src="my.js"></script>
		</body>
	</html>
	

###Structured CSS
CSS is kind of like walking through mud - it's messy and it sticks to you! Some people seem to love it and there is a swath of websites dedicated to it. For myself, I can pretty much style any site you throw at me to look how I want, but the CSS is not always pretty!

An obvious path to structured CSS is to use technologies that pre-compile it for you such as LESS and SASS, however we will not be looking at either one of these tools. At the end of the day they introduce yet another thing to do and ensure that it works correctly! If the technology fails or errors occur then you need to know how to handle/fix these. Remember there is no such thing as a silver bullet no matter how great the technology is. If you introduce more technologies into your stack then expect more issues! Pessimistic ? Maybe!

1. Include a CSS Reset
		
	You will find that a CSS reset normalizes browser differences so it is important to use one if you are developing for several browsers. The one that I have seen come up time and again is [Eric Meyer's reset](http://meyerweb.com/eric/tools/css/reset/ "Eric Meyer CSS Reset")
2. Use as few CSS files as possible

	This is just common sense really. If you can get away with a single CSS file then just use one file but if it gets too long (say a few thousand lines) you will need to split it up into locical units. It isn't an issue if at production you are concatenating your CSS file together into one file but otherwise having many CSS files will slow down your page load time due to several more requests than necessary.
	
3. Put global element styles at the top

	Put simply, place styles for any HTML elements at the top of your CSS file. These are all your global styles. This makes things easier to maintain.

4. Use Ids

	Ids are faster. If your HTML element warrants an ID, then give it one - then use it in your CSS to style it.

5. Beware of Classitis

	There is often a tendency especially by novice developers to create hundreds of classes when styling your HTML. This makes your code hard to maintain, therefore only create a class when you need one ie. ensure you have a reason for doing so. Classes should be reused across several elements when used properly, otherwise you probably don't need one.



###Structured Javascript
This is an interesting one because you could get so many opinions here. I am going to make this particular post jQuery specific because most projects out there use it and because I use it on pretty much everything I build. The principle stays the same - it just has to be adapted. Oh and remember that we aren't assuming any frameworks like Backbone, Angular or Embers.

I find that I need the same kinds of functions over and over again so I have a simple way of writing my javascript. Firstly the file structure. I normally would have the following files in a project:

	jquery.js
	main.js
	utils.js
	
Obviously this is going to be a smallish project where we only have a couple of javascript files. `utils.js` contains any generic utility functions that we require. Our application code will sit in `main.js`

####Inside main.js
Our main goal here is to prevent writing _spaghetti_ code which is often the case with jQuery beginners unsurprisingly given the nature of jQuery. Once you get over things like thinking you are clever after chaining a dozen operations together, it's pretty good. We could point out many ideas based on js structure but we are only going to cover a few key ones. Others such as variable naming conventions are covered by many other articles around the web.

#####Keep the document.ready() function very simple
	
		$( document ).ready(function() {
    		init();
		});

	All we have in our example above is an initialisation function. You may want to pass in an options object as well:
	
		init({ "version": "1.0" })
		
#####Use an `init()` function to setup your program's initial application state.

Put your initialisation code in one place. Initialisation code should setup the initial state of the program, ie. all necessary variables created and set to the correct values. Why do we do this? The organisational benefits are obvious. It is clean and clear and will be easy for anyone on your team to pick up and understand when you are off sick.

Tip: When you are developing, think of others and not just yourself. Your code will end up being clearer and more accessible to members of your team.

#####Setup your bindings in one place

I've always found it best to set up all of my event handlers in one function such as initBindings(). This invariably means that I can easily trace a user's path through the application because I know exactly where the code is going to start. If your application is only a few hundred lines it probably doesn't really matter, however it is good to get into a structured mindset right away because you may find that your code ends up being 50,000 lines long. In this case it will still be just as easy to trace through your code if you have structured it this way.

#####Breakup event handlers into discrete functions

So once inside an event handler the tendency for beginners is to write lots of confusing jQuery with huge chains of calls. You need to check those items in the chain that have a chance of returning 'null' - in other words don't write huge lists of chained calls - make 2 or 3 chained calls the maximum and agree on a standard with your team. I know it's tempting to do this...

	a().b().c().d().e().f();
	
...but I don't believe it is a great practice.

__Tip:__ Don't chain a lot of jQuery calls together. Any one of those calls may return 'null' or 'undefined', in which case your program will immediately break! 

So - back to the point! Consider what you want to do in the event handler from an application point of view. For example, you may have an event handler on the click of a button that creates a new widget. Create your event handler a bit like this:

	$('#btnNewWidget').on('click', function(event){
		/* Lets create a new widget! */
		createNewWidget(this, event);
	});
	
It beats a lot of confusing jQuery doesn't it. The advantage here is that it is obvious to you what is going on in the program flow even if you have to come back to this code in 6 months because of some maintenance that you need to do. You (and your team mates for that matter) will instantly know what is going on purely because of the way you named the function.

#####If you must use global variables, call them out!

Hmm... did I actually say that? Yes I did. You will find that when you start writing Javascript, you will probably (unless you are from another programming background....but even then!) start creating lots of global variables everywhere! So here is the advice. Until you know about namespaces and/or modules you will be doing this because it is far too easy to do in Javascript. Just face it and do it and learn with the language. Ok I'm nearly at the advice. Here it is... minimise the amount of globals and prefix them with something like 'underscore' eg:

	__aGlobalVarIAm
	
Note that I 'double' underscored it just for emphasis. Note also the camel casing and the Dr Seuss like var (you can ignore the last one!)

###Summary
For me it comes down to 2 things: Writing maintainable code and making the user happy. You will know if your code is maintainable after several months on the same project because invariably you will have to enhance it when your users actually realise what they really want to do. As for making your users happy, that is an altogether different thing, but if you structure your code and structure your project & deliverables, you have a chance of success!


![Writing Maintainable Code](/images/maintainable-code-dilbert.gif "Writing Maintainable Code")

__Image of the day__