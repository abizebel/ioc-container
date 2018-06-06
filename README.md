# ioc-container
 simple library that provides you a modular JavaScript 
 
![alt text](http://s9.picofile.com/file/8328479284/ioc_container_view.jpg)


[=== ONLINE DEMO ===](http://htmlpreview.github.io/?https://github.com/abizebel/ioc-container/blob/master/index.html)

<h3>How to use :</h3>

<p>Dfine a new module</p> 
<pre>
Ioc.define(moduleName', function(injectList){
   return {
      //your functions
   }
})
</pre>

<p>Use a defined module</p> 
<pre>
var module = Ioc.getModule('moduleName');    
</pre>

<p>Define a Service</p> 
<pre>
Ioc.service(serviceName', function(injectList){
   return {
      //your functions
   }
})</pre>


<p>Get injection modules</p> 
<pre>
Ioc.getInjects('moduleName')
</pre>
