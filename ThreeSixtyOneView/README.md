The project repo is located at: ssh://git.marketshare.com:7999/des/ms360uiux.git "develop" branch

Please note, the repo does not include any dependencies. The build depenecies are managed by "node.js" and the application dependencies are managed by "Bower" which is part of Yeoman. This means you both Node and Yeoman need to be installed to be able to install the 360 "One View" application.

Please note, the build system is Unix based and does not work well with the DOS command line. I would suggest using the GIT Bash shell.

Steps to recreate the project:
1) Node download - http://nodejs.org/download/ 
2) use npm to install Yeoman. See http://yeoman.io/
3) clone the git repo
4) from the project root download the build dependencies by running "npm install" from the command line
5) from the project root download the application dependencies by running "bower install" from the command line
6) from the project root start the local server by running "grunt serve" from the command line
7) after the page opens in the browser, navigate to http://127.0.0.1:9001/#/projects

At this point, everything you need to run the application is located in the /app directory however it will not run by launching the index.html file. It needs to be run from port 9001. 

8) from the project root run "grunt serve:dist" to do a production build. Please note - this fails because some third party libraries do not minify correctly. I worked on fixing this however the REST API service has failed and I am no longer getting any data.

Because I can not trouble shoot the issues around doing a production build because the REST service is down, I would suggest, for now, to use the files in /app.