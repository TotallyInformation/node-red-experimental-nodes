/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable jsdoc/newline-after-description, jsdoc/require-param */

/**
 * https://semaphoreci.com/community/tutorials/getting-started-with-gulp-js
 * https://gulpjs.com/plugins/
 * https://gulpjs.com/docs/en/api/concepts/
 * Plugins
 *  https://www.npmjs.com/package/gulp-include - source file inline replacements
 *  https://www.npmjs.com/package/gulp-uglify  - Minify
 *  https://www.npmjs.com/package/gulp-rename  - Rename source filename on output
 *  https://www.npmjs.com/package/gulp-once    - Only do things if files have changed
 *  https://www.npmjs.com/package/gulp-replace - String replacer
 *  https://www.npmjs.com/package/gulp-json-editor - Change data in a JSON file
 *  https://www.npmjs.com/package/gulp-debug
 *  https://github.com/jonschlinkert/gulp-htmlmin
 *  https://www.npmjs.com/package/gulp-prompt - get input from user on command line
 * 
 *  https://www.npmjs.com/package/gulp-concat
 *  https://www.npmjs.com/package/gulp-sourcemaps
 *  https://www.npmjs.com/package/gulp-prompt  - get input from user
 *  https://www.npmjs.com/package/gulp-if-else
 *  https://www.npmjs.com/package/gulp-minify-inline
 *  https://www.npmjs.com/package/gulp-tap - Easily tap into a pipeline. Could replace gulp-replace
 *  https://www.npmjs.com/package/webpack-stream - Use WebPack with gulp
 *  https://www.npmjs.com/package/tinyify - runs various optimizations
 * 
 *  ❌https://www.npmjs.com/package/gulp-changed - Does not work as expected
 */

'use strict'

const { src, dest, lastRun, series, watch, parallel, } = require('gulp')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const include = require('gulp-include')
const once = require('gulp-once')
//const prompt = require('gulp-prompt')
const gulpReplace = require('gulp-replace')
const debug = require('gulp-debug')
const htmlmin = require('gulp-htmlmin')
const jeditor = require('gulp-json-editor')
const prompt = require('gulp-prompt')

const execa = require('execa')

const fs = require('fs-extra')
const path = require('path')

//const { promisify } = require('util')
//const dotenv = require('dotenv')

const nodeDest = 'nodes'

// print output of commands into the terminal
const stdio = 'inherit'

// @ts-ignore
const { version } = JSON.parse(fs.readFileSync('package.json'))

//npm version 4.2.1 --no-git-tag-version --allow-same-version
const release = '1.0.0'

// console.log(`Current Version: ${version}. Requested Version: ${release}`)

/** 
 * TODO
 *  - Add text replace to ensure 2021 in (c) blocks is current year
 *  - In packfe, set the source version string to the current package.json version
 */

// Path for Editor html source code
// Don't use path.join here because this is used for globs and they don't use Windows paths
const nodeSrcRoot = 'src/nodes-html'
// Path for nodes
const nodesRoot = 'nodes'

const readline = require('readline')
/** Create a new node from the template */
function createNewNode(cb) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    rl.question('Enter the name of the new node to create: ', async function (nodeName) {
        console.log(`\nNew node will be called '${nodeName}'`)
        try {
            fs.copy('new-node-template/nodes/node-name', `nodes/${nodeName}`)
            console.log(`Template runtime copied to 'nodes/${nodeName}'`)
        } catch (e) {
            cb(e)
        }
        try {
            fs.copy('new-node-template/src/nodes-html/node-name', `src/nodes-html/${nodeName}`)
            console.log(`Template Editor source copied to 'src/nodes-html/${nodeName}'`)
        } catch (e) {
            cb(e)
        }
        
        rl.close()
    })
    rl.on('close', function () {
        console.log('New node created.\n')
        // setName(cb)
        cb()
    })
}

function setName(cb) {
    src([`${nodeSrcRoot}/*/editor.js`, `${nodeSrcRoot}/*/template.html`, `${nodeSrcRoot}/*/help.html`, `${nodeSrcRoot}/*/main.html`, `${nodesRoot}/*/customNode.js`],  )
        // .pipe(debug({title:'setname',minimal:false}))
        // Replace any instances of '¬¬¬' with actual node name (assumed to be the parent folder name)
        .pipe( gulpReplace('¬¬¬', function replaceNodeNamePlaceholder(match, p1, offset, string) {
            // https://github.com/gulpjs/vinyl#instance-properties
            const nodeName = this.file.relative.split(path.sep).shift()
            // if (match) console.log( 'gulpReplace: ', this.file.relative )
            return nodeName
        }) )
        .pipe(dest(nodeSrcRoot))
        // .pipe(debug({title:'setname2',minimal:false}))

    cb()
}

/** Uglify js (do before build, change main.html to include min.js instead of .js) */
function uglifyJs(cb) {
    src(`${nodeSrcRoot}/*/main.html`)
        .pipe(uglify())
        .pipe(rename('editor.min.js'))
        .pipe(dest(nodeSrcRoot))

    cb()
}


function buildMe(cb) {
    src(`${nodeSrcRoot}/*/main.html`, ) // { since: lastRun(buildMe) } )
        // .pipe(debug({title:'debug1',minimal:false}))
        .pipe( include() )
        // Rename output to $dirname/editor.html
        .pipe(rename(function(thispath) {
            // thispath.dirname = `${thispath.dirname}`
            thispath.basename = 'customNode'
            //thispath.extname = 'html'
        }))
        // Minimise HTML output
        // .pipe(htmlmin({ collapseWhitespace: true, removeComments: true, processScripts: ['text/html'], removeScriptTypeAttributes: true }))
        .pipe(dest('nodes/'))

    cb()
}

/** Watch for changes during development of nodes */
function watchme(cb) {
    watch(nodeSrcRoot, buildMe)
        // .on( 'change', (path, stats) => {
        //     console.log('watch:change', path, stats)
        // } )
        // .on( 'add', (path, event) => {
        //     console.log('watch:add', path, event)
        // } )
        // .on( 'unlink', (path) => {
        //     console.log('watch:unlink', path)
        // } )
        // .on( 'addDir', (path, event) => {
        //     console.log('watch:addDir', path, event)
        // } )
        // .on( 'unlinkDir', (path) => {
        //     console.log('watch:unlinkDir', path)
        // } )

    cb()
}


/** Set uibuilder version in package.json */
function setPackageVersion(cb) {
    if (version !== release) {
        // bump version without committing and tagging
        //await execa('npm', ['version', release, '--no-git-tag-version'], {stdio})
        src('./package.json')
            .pipe(jeditor({ 'version': release } ) )
            .pipe(dest('.') )
    } else {
        console.log('setPackageVersion: Requested version is same as current version - nothing will change')
    }
    cb()
}
/** Set uibuilder version in package-lock.json */
function setPackageLockVersion(cb) {
    if (version !== release) {
        src('./package-lock.json')
            .pipe(jeditor({ 'version': release } ) )
            .pipe(dest('.') )
    }
    cb()
}

/** Create a new GitHub tag for a release (only if release ver # different to last committed tag) */
async function createTag(cb) {
    //Get the last committed tag: git describe --tags --abbrev=0
    let lastTag
    try {
        lastTag = (await execa('git', ['describe', '--tags', '--abbrev=0'])).stdout
    } catch (e) {
        lastTag = ''
    }
    
    console.log(`Last committed tag: ${lastTag}`)

    // If the last committed tag is different to the required release ...
    if ( lastTag.replace('v','') !== release ) {
        //const commitMsg = `chore: release ${release}`
        //await execa('git', ['add', '.'], { stdio })
        //await execa('git', ['commit', '--message', commitMsg], { stdio })
        await execa('git', ['tag', `v${release}`], { stdio })
        await execa('git', ['push', '--follow-tags'], { stdio })
        await execa('git', ['push', 'origin', '--tags'], { stdio })
    } else {
        console.log('Requested release version is same as the latest tag - not creating tag')
    }
    cb()
}

exports.default   = series( buildMe ) // series(runLinter,parallel(generateCSS,generateHTML),runTests)
exports.build     = series(buildMe )
exports.watch     = watchme

exports.new       = series( createNewNode, setName, setName )  // run setname twice because 1st time doesn't do it
exports.setName   = setName

exports.createTag   = createTag
exports.setVersion  = series( setPackageVersion, setPackageLockVersion )
