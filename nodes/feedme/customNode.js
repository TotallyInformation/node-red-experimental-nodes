/** Template Node-RED node runtime
 * 
 * Copyright (c) 2022 Julian Knight (Totally Information)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict'

/** --- Type Defs - should help with coding ---
 * @typedef {import('../../typedefs').runtimeRED} runtimeRED
 * @typedef {import('../../typedefs').runtimeNodeConfig} runtimeNodeConfig
 * @typedef {import('../../typedefs').runtimeNode} runtimeNode
 * @typedef {import('../../typedefs').thisNode} thisNode <= Change this to be specific to this node
 * @typedef {import('../../typedefs').feedmeNode} feedmeNode <= Change this to be specific to this node
 */

//#region ----- Module level variables ---- //

const FeedParser = require("feedparser");
const request = require("request");
const url = require('url');

/** Main (module) variables - acts as a configuration object
 *  that can easily be passed around.
 */
const mod = {
    /** @type {runtimeRED} Reference to the master RED instance */
    RED: undefined,
    /** @type {string} Custom Node Name - has to match with html file and package.json `red` section */
    nodeName: 'feedme', // Note that '¬¬¬' will be replaced with actual node-name. Do not forget to also add to package.json
}

//#endregion ----- Module level variables ---- //

//#region ----- Module-level support functions ----- //

/** Get the feed
 * @param {runtimeNode & feedmeNode} node The Node-RED node instance config object
 */
function getFeed(node) {
    const req = request(node.url, {timeout:10000, pool:false});
    //req.setMaxListeners(50);
    req.setHeader('user-agent', 'Mozilla/5.0 (Node-RED)');
    req.setHeader('accept', 'application/rss+xml,text/html,application/xhtml+xml,application/xml');

    var feedparser = new FeedParser({})

    req.on('error', function(err) { node.error(err); });

    req.on('response', function(res) {
        if (res.statusCode != 200) { node.warn(mod.RED._("feedparse.errors.badstatuscode")+" "+res.statusCode) }
        else { res.pipe(feedparser) }
    });

    feedparser.on('error', function(error) { node.error(error) })

    feedparser.on('readable', function () {
        let stream = this, article
        while (article = stream.read()) {  // jshint ignore:line
            if (!(article.guid in node.seen) || ( node.seen[article.guid] !== 0 && node.seen[article.guid] != article.date.getTime())) {
                node.seen[article.guid] = article.date?article.date.getTime():0;
                var msg = {
                    topic: article.origlink || article.link,
                    payload: article.description,
                    article: article
                };
                node.send(msg)
            }
        }
    });

    feedparser.on('meta', function (meta) {})
    feedparser.on('end', function () {})
}

/** 3) Run whenever a node instance receives a new input msg
 * NOTE: `this` context is still the parent (nodeInstance).
 * See https://nodered.org/blog/2019/09/20/node-done 
 * @param {object} msg The msg object received.
 * @param {Function} send Per msg send function, node-red v1+
 * @param {Function} done Per msg finish function, node-red v1+
 */
function inputMsgHandler(msg, send, done) { // eslint-disable-line no-unused-vars
    // As a module-level named function, it will inherit `mod` and other module-level variables

    // If you need it - or just use mod.RED if you prefer:
    //const RED = mod.RED

    getFeed(this)

    // We are done
    done()

} // ----- end of inputMsgHandler ----- //

/** 2) This is run when an actual instance of our node is committed to a flow
 * type {function(this:runtimeNode&senderNode, runtimeNodeConfig & senderNode):void}
 * @param {runtimeNodeConfig & feedmeNode} config The Node-RED node instance config object
 * @this {runtimeNode & feedmeNode}
 */
function nodeInstance(config) {
    // As a module-level named function, it will inherit `mod` and other module-level variables

    // If you need it - which you will here - or just use mod.RED if you prefer:
    const RED = mod.RED

    // Create the node instance - `this` can only be referenced AFTER here
    RED.nodes.createNode(this, config)

    /** Transfer config items from the Editor panel to the runtime */
    this.name = config.name || ''
    this.topic = config.topic || ''
    this.url = config.url
    this.interval = config.interval

    this.interval_id = null
    this.seen = {}

    if (this.interval > 35790) {
        this.warn(RED._("feedparse.errors.invalidinterval"))
    }
    this.interval = (parseInt(this.interval)||15) * 60000;
    
    const parsedUrl = url.parse(this.url)

    if (!(parsedUrl.host || (parsedUrl.hostname && parsedUrl.port)) && !parsedUrl.isUnix) {
        this.error( RED._("feedparse.errors.invalidurl") )
    } else {
        this.interval_id = setInterval(function() { getFeed(this) }, this.interval)
        getFeed(this)
    }

    /** Handle incoming msg's - note that the handler fn inherits `this` */
    this.on('input', inputMsgHandler)

    /** Put things here if you need to do anything when a node instance is removed
     * Or if Node-RED is shutting down.
     * Note the use of an arrow function, ensures that the function keeps the
     * same `this` context and so has access to all of the node instance properties.
     */
    this.on('close', (removed, done) => {
        //console.log('>>>=[IN 4]=>>> [nodeInstance:close] Closing. Removed?: ', removed)

        if (this.interval_id != null) {
            clearInterval(this.interval_id);
        }

        done()
    })

    /** Properties of `this`
     * Methods: updateWires(wires), context(), on(event,callback), emit(event,...args), removeListener(name,listener), removeAllListeners(name), close(removed)
     *          send(msg), receive(msg), log(msg), warn(msg), error(logMessage,msg), debug(msg), trace(msg), metric(eventname, msg, metricValue), status(status)
     * Other: credentials, id, type, z, wires, x, y
     * + any props added manually from config, typically at least name and topic
     */
}

//#endregion ----- Module-level support functions ----- //

/** 1) Complete module definition for our Node. This is where things actually start.
 * @param {runtimeRED} RED The Node-RED runtime object
 */
function ModuleDefinition(RED) {
    // As a module-level named function, it will inherit `mod` and other module-level variables

    // Save a reference to the RED runtime for convenience
    mod.RED = RED

    /** Register a new instance of the specified node type (2) */
    RED.nodes.registerType(mod.nodeName, nodeInstance)
}

// Export the module definition (1), this is consumed by Node-RED on startup.
module.exports = ModuleDefinition

//EOF

function FeedParseNode(n) {
    RED.nodes.createNode(this,n);

    this.url = n.url;

    

}
