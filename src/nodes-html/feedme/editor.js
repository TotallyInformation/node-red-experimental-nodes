/* eslint-disable strict */

// Isolate this code
(function () {
    'use strict'

    /** Module name must match this nodes html file @constant {string} moduleName */
    const moduleName  = 'feedme'
    /** Node's label @constant {string} paletteCategory */
    const nodeLabel  = moduleName
    /** Node's palette category @constant {string} paletteCategory */
    const paletteCategory  = 'Totally Information' // 'advanced-input'
    /** Node's background color @constant {string} paletteColor */
    const paletteColor  = '#C0DEED' // '#F6E0F8' //'#E6E0F8'

    /** Prep for edit
     * @param {*} node A node instance as seen from the Node-RED Editor
     */
    function onEditPrepare(node) {

    } // ----- end of onEditPrepare() ----- //

    RED.nodes.registerType(moduleName, {
        category: paletteCategory,
        color: paletteColor,
        defaults: {
            name: {value:""},
            url: {value:"", required:true},
            interval: { value:15, required:true, validate:function(v) {return (!isNaN(parseInt(v)) && (parseInt(v) <= 35790))} }
        },
        //align:'right',
        inputs: 1,
        // inputLabels: 'Manual trigger',
        outputs: 1,
        outputLabels: ['Feed output'],
        icon: 'feed.png',
        paletteLabel: function() {
            return this._("feedparse.feedparse")
        },
        label: function () { 
            return this.name || this.url || this._("feedparse.feedparse")
        },
        labelStyle: function() {
            return this.name?"node_label_italic":"";
        },

        /** Prepares the Editor panel */
        oneditprepare: function() { onEditPrepare(this) },

        /** Runs before save (Actually when Done button pressed) - oneditsave */
        /** Runs before cancel - oneditcancel */
        /** Handle window resizing for the editor - oneditresize */
        /** Show notification warning before allowing delete - oneditdelete */
        
    }) // ---- End of registerType() ---- //

}())
