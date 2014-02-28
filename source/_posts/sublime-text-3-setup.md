Sublime Text 3 Setup

###Install Sublime Text

###Install the package manager

###Install a few packages
	1. Soda (A new theme)
	2. Base 16 Color schemes
	3. All Autocomplete
	4. Emmet
	5. SideBarEnhancements
	6. TrailingSpaces
	7. Stylus

###Install the binary by adding a symlink
	export PATH=$PATH:~/bin
	export PATH=$PATH:~/bin/subl
	
	Surprisingly Sublime Text doesn’t come with a easily accessible binary, since this is probably the primary way developers will open the editor. That said, you can easily add support by creating a symlink:

ln -s "/Applications/Sublime Text 2.app/Contents/SharedSupport/bin/subl" /usr/bin/subl

###Add an alias	
	mysubl() { subl --project "$1"; }
	alias sublp='mysubl '

	mycd() { cd "$1"; ls -al; }
	alias cdl='mycd '
	
### Add Lots of preferences
Open Sublime’s preferences (Settings - User or ⌘,) and add:

{
  "tab_size": 2,
  "translate_tabs_to_spaces": true
}

Open TrailingSpace’s preferences (Preferences -> Package Settings -> TrailingSpaces -> Settings - User), and add:

{
  "trailing_spaces_include_current_line": false
}

Also add this to your global user preferences (⌘,):

 "trim_trailing_white_space_on_save": true
 
 reveal the currently opened file in the sidebar. You can add this to Sublime by opening the key bindings preferences (Preferences -> Key Bindings - User) and adding:

[
  {"keys": ["ctrl+super+r"], "command": "reveal_in_side_bar"}
]

One suggestion from Jason Barry is to use ‘Paste and Indent’ for ⌘V instead of the standard ‘Paste’. This adjusts your indentation to automatically match the context it’s pasted in. To do this, put the following in your Key Bindings - User file:

[
  { "keys": ["super+v"], "command": "paste_and_indent" }, 
  { "keys": ["super+shift+v"], "command": "paste" } 
]

###References
####Setting up Sublime Text 2
http://blog.alexmaccaw.com/sublime-text
http://gilbert.pellegrom.me/my-sublime-text-setup/
http://web-design-weekly.com/blog/2013/08/24/sublime-text-settings-i-use/
http://architects.dzone.com/articles/my-sublime-text-setup
http://drewbarontini.com/setup/sublime-text/
http://blog.generalassemb.ly/sublime-text-3-tips-tricks-shortcuts/
