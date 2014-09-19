The project repo is located at: ssh://git.marketshare.com:7999/des/ms360uiux.git "develop" branch

Please note, the repo does not include any dependencies. The build depenecies are managed by "node.js" and the application dependencies are managed by "Bower" which is part of Yeoman. This means you both Node and Yeoman need to be installed to be able to install the 360 "One View" application.

Please note, the build system is Unix based and does not work well with the DOS command line. I would suggest using the GIT Bash shell.

Steps to recreate the project:
<ol>
	<li>Install Node - http://nodejs.org/download/ </li>
	<li>Use npm to install Yeoman. <code>npm install -g yo</code> See http://yeoman.io/ for more details</li>
	<li>Clone the git repo</li>
	<li>From the project root download the build dependencies by running <code>npm install</code> from the command line</li>
	<li>From the project root download the application dependencies by running <code>bower install</code>from the command line</li>
	<li>From the project root start the local server by running <code>grunt serve</code> from the command line</li>
	<li>After the page opens in the browser, navigate to http://127.0.0.1:9001/#/projects</li>
</ol>

At this point, everything you need to run the application is located in the /app directory however it will not run by launching the index.html file. It needs to be run from port 9001. 

From the project root run "grunt build" to do a production build. 