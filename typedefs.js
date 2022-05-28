/* eslint-disable no-irregular-whitespace */
/** Define typedefs for linting and JSDoc/ts checks - does not actually contain live code
 * 
 * Copyright (c) 2017-2022 Julian Knight (Totally Information)
 * https://it.knightnet.org.uk, https://github.com/TotallyInformation/node-red-contrib-uibuilder
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

/** runtimeRED
  * @typedef {object} runtimeRED The core Node-RED runtime object
  * @property {expressApp} httpAdmin Reference to the ExpressJS app for Node-RED Admin including the Editor
  * @property {expressApp} httpNode Reference to the ExpressJS app for Node-RED user-facing nodes including http-in/-out and Dashboard
  * @property {object} server Node.js http(s) Server object
  * @property {runtimeLogging} log Logging.
  * @property {runtimeNodes} nodes Gives access to other active nodes in the flows.
  * @property {runtimeSettings} settings Static and Dynamic settings for Node-RED runtime
  * 
  * @property {Function} version Get the Node-RED version
  * @property {Function} require : [Function: requireModule],
  * @property {Function} comms : { publish: [Function: publish] },
  * @property {Function} library : { register: [Function: register] },
  * @property {Function} auth : { needsPermission: [Function: needsPermission] },
  * 
  * @property {object} events Event handler object
  * @property {Function} events.on Event Listener Function. Types: 'nodes-started', 'nodes-stopped'
  * @property {Function} events.once .
  * @property {Function} events.addListener .
  * 
  * @property {object} hooks .
  * @property {Function} hooks.has .
  * @property {Function} hooks.clear .
  * @property {Function} hooks.add .
  * @property {Function} hooks.remove .
  * @property {Function} hooks.trigger .
  * 
  * @property {object} util .
  * @property {Function} util.encodeobject : [Function: encodeobject],
  * @property {Function} util.ensurestring : [Function: ensurestring],
  * @property {Function} util.ensureBuffer : [Function: ensureBuffer],
  * @property {Function} util.cloneMessage : [Function: cloneMessage],
  * @property {Function} util.compareobjects : [Function: compareobjects],
  * @property {Function} util.generateId : [Function: generateId],
  * @property {Function} util.getMessageProperty : [Function: getMessageProperty],
  * @property {Function} util.setMessageProperty : [Function: setMessageProperty],
  * @property {Function} util.getobjectProperty : [Function: getobjectProperty],
  * @property {Function} util.setobjectProperty : [Function: setobjectProperty],
  * @property {Function} util.evaluateNodeProperty : [Function: evaluateNodeProperty],
  * @property {Function} util.normalisePropertyExpression : [Function: normalisePropertyExpression],
  * @property {Function} util.normaliseNodeTypeName : [Function: normaliseNodeTypeName],
  * @property {Function} util.prepareJSONataExpression : [Function: prepareJSONataExpression],
  * @property {Function} util.evaluateJSONataExpression : [Function: evaluateJSONataExpression],
  * @property {Function} util.parseContextStore : [Function: parseContextStore]
  */

/** runtimeNodeConfig
 * @typedef {object} runtimeNodeConfig Configuration of node instance. Will also have Editor panel's defined variables as properties.
 * @property {object=} id Internal. uid of node instance.
 * @property {object=} type Internal. Type of node instance.
 * @property {object=} x Internal
 * @property {object=} y Internal
 * @property {object=} z Internal
 * @property {object=} wires Internal. The wires attached to this node instance (uid's)
 */

/** runtimeNode
  * @typedef {object} runtimeNode Local copy of the node instance config + other info
  * @property {Function} send Send a Node-RED msg to an output port
  * @property {Function} done Dummy done Function for pre-Node-RED 1.0 servers
  * @property {Function} context get/set context data. Also .flow and .global contexts
  * @property {Function} on Event listeners for the node instance ('input', 'close')
  * @property {Function} removeListener Event handling
  * @property {Function} error Error log output, also logs to the Editor's debug panel
  * @property {Function} status Show a status message under the node in the Editor
  * @property {object=} credentials Optional secured credentials
  * @property {object=} name Internal.
  * @property {object=} id Internal. uid of node instance.
  * @property {object=} type Internal. Type of node instance.
  * @property {object=} z Internal. uid of ???
  * @property {[Array<string>]=} wires Internal. Array of Array of strings. The wires attached to this node instance (uid's)
  */

/** thisNode - template custom node - duplicate and change for actual node definitions
 * @typedef {object} thisNode Local copy of the node instance config + other info
 * @property {string} name only used for labelling the node in the flow
 * @property {string} topic Optional topic
 */

module.exports = {}
