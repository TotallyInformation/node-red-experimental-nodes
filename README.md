# node-red-experimental-nodes
An occasionally changing set of experiments for Node-RED

## Requirements for Node-RED custom nodes

Note that any experimental nodes in this repository follow these rules. So you can use them and the `new-node-template` as exemplars.

### MUST

Your nodes won't work if you don't do these.

* The node's runtime MUST have the same name as the node's Editor html (e.g. `customNode.js` and `customNode.html`).
* The html file's `data-template-name`, `data-help-name`, and `RED.nodes.registerType` first parameter MUST all have the same name.
* The runtime js file's `RED.nodes.registerType` MUST have the same name as above.
* The name above MUST match the name in the node-red section of the `package.json` file.

### SHOULD

These will make your node's easier to debug and manage.

* The node's file names SHOULD be the same as the node name (as defined in the html, js and package.json files) OR, as in the case of this module, they should be in a sub-folder named the same.
* You SHOULD explicitly name all functions. This makes debugging _much_ easier.
* You SHOULD use JSLINT to check the structure of your code. Choose a style and stick to it. It makes later reading, change and debugging vastly easier.

#### Coding the HTML file

* For the html file, you SHOULD isolate the JavaScript code using an IIFE (`(function () { ... }())`). This prevents inadvertent variable name clashes with other nodes.
* You SHOULD offload the `on...` functions. e.g. `oneditprepare: function() { onEditPrepare(this) },`. Makes debugging and management easier & saves confusion over what `this` points to.
* You SHOULD put complex code into functions outside the `RED.nodes.registerType()`. Keep code in managable, smallish functions, this is much easier to manage.
* You can and SHOULD create common varables outside the `RED.nodes.registerType()`.

#### Coding the runtime JavaScript file

* You SHOULD deconstruct the complex, normally interlocking functions required in your node's runtime. While this is more complex for simple nodes, it is a massive time and energy-saver as the node gets more complex. It also helps you understand how the nodes actually work and which bits get called when and why.