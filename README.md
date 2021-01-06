# cc-install
CarCommander Install

# Front-end Setup
Simply create a code block and drop in the entirety of the cc-form.html file

# Back-end Setup
1: Add car-commander.dev.js, car-commander.less, & remove-padding.js (add this file unless you want to manually style out the paddding and margin of the cc form yourself)
2: Embed this script provided by autolink in a test enviroment  
![autolink script](https://github.com/omnicommander-org/cc-install/autolink-script.png)  
3: Inspect the script in your test enviroment and search for this jQuery call:
![autolink script inspect](https://github.com/omnicommander-org/cc-install/autolink-script-inspect.png)  
4: Copy the relative we just found (/hartfordpolice/cbs/makesModels)  
5: In the car-commander.dev.js file, edit the XMLHttpRequest and paste the new path  
6: At the bottom of the car-commander.dev.js file update the url in the submitSearch() function   
7: Make sure Gabe has whitelisted the current site that cc is being installed on  
