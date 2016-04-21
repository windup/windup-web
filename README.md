
Setting up the development environment
======================================

Requirements
-------------
 
0) Git.

1) JDK 8
 
2) Maven 3.2.5+, 3.3.x recommended

Environment setup
-----------------
 
3) [Install NodeJS Package Manager (npm)](https://nodejs.org/en/download/package-manager/)
    * For example, on Debian-based systems, use `sudo apt-get install npm`

4) Update NPM to npm's version of NPM because the version you got through your package manager [may cause you problems](https://github.com/nodejs/nan/issues/414):

    sudo npm install -g npm

5) Install some installation dependencies using `npm`:

    sudo npm install -g bower
    sudo npm install -g typings
    sudo npm install -g typescript

6) Install the Javascript UI libraries, using `npm`:

    cd windup-web/ui
    npm install
    cd -
    
   Alternatively, these parts may be installed 'manually':
   
    sudo npm install -g patternfly # JBoss PatternFly, a UI components library
    sudo npm install -g grunt-cli  # Grunt
    sudo npm install -g tsc        # TypeScript compiler
   
   This list is not complete, feel free to add the missing items.

7) You'll know you have everything you need when you can build the parent project: `mvn clean install`
 
