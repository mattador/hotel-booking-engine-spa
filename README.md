Web Booking Engine - project
==================================================

Tags
----

Sabre API, Single Page Application, Travelodge, Python, AngularJS4

Architecture
============

A two tiered web application consisting of a SPA frontend built in AngularJS 2 (TypeScript) and a REST backend built in Flask (Python).

The application lives on https://reservations.travelodge.com.au.

Client side dependencies
------------------------
There are a couple of additional angular third party dependencies I've leveraged to extend es6 date manipulation and implement image swiping.

CSS considerations
------------------

I've disabled Angular's default simulated shadow DOM mode, at each component level, in order to utilise SCSS syntax as we would do normally with a web project.

I used Bourbon as the framework for building out the stylesheets with semantic HTML as I was not expecting the project to grow so big, so quickly. I think in hindsight that Bourbon may not have been the right choice for maintainability reasons. I'd recommend using Bootstrap for the second revision. 

Additionally, I have included the output CSS directly into the application entry point in index.html instead of inside the angular application itself. This allows proper .map references, which is hugely beneficial when debugging.  

```bash 
sass --watch scss/main.scss:css/main.css --style compressed
``` 

Ahead of Time compilation and tree shaking
------------------------------------------

I've spent the better part of 12 hours trying to get the third party dependency graph to play nicely with rollbar. Unfortunately, there are complications which I can't seem to work around. So, I have been using JIT with webpack for now.

This link provides a technical overview of the tree shaking/aot process: 
https://www.softwarearchitekt.at/post/2016/09/18/angular-2-aot-compiler-and-tree-shaking-with-webpack2-and-or-rollup-step-by-step.aspx

If that isn'enough to put you off trying, then take a look at Angular's cookbook: https://angular.io/docs/ts/latest/cookbook/aot-compiler.html

```bash
npm run build:prod
```
This builds the app to a folder called dist. To run the app "watched" developer mode instead use:

```bash
npm start
```
