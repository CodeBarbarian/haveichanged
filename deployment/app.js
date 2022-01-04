/**
 * This file is only a proof of concept on an idea on how to make it work. 
 * The file will probably change a lot.
 * 
 * What do I want to improve on this: 
 *      * Templating on responses
 *      * Socket.io for live view
 *      * Maybe even add a master/node(s) architecture on this
 */

/**
 * We need access to the filesystem, md5 hashing library and express framework
 */
const fs = require('fs');
const md5 = require('md5');
const express = require('express');
const { exit } = require('process');
const gaze = require('gaze');

/**
 * We want date and time in our console window
 */
require('log-timestamp');

/**
 * Load configuration file
 */
var config = require('./data/config.json');


/**
 * Initialise express
 */
var app = express();

/**
 * Let us make sure the file exists and so on, before we do anything else
 */
const WatchedFile = config.path
var hasFileChanged = false;


if (fs.existsSync(WatchedFile)) {
    /**
     * Application start
     */
    console.log(`Watching for file changes on ${WatchedFile}`);


    let md5Previous = null;
    
    /**
     * Using filesystem to watch for the file
     */
    fs.watch(WatchedFile, (event, filename) => {
        /**
         * If we are able to retreive the filename from WatchedFile in the callback of fs.watch
         *  1. Generate a md5 hash of the contents of the file (Hate md5 but works for this)
         *  2. Strictly check if the hashes compare
         *  3. Profit
         */
        if (filename) {
            // Generating the hash
            const md5Current = md5(fs.readFileSync(WatchedFile));
            
            // Checking if the hashes are the same or not 
            if (md5Current === md5Previous) {
                return ;
            }
            
            // Set the previous hash to the current hash
            md5Previous = md5Current;
    
            // Log to the console that the file has been changed
            console.log(`${filename} file changed`);
            
            // Set the hasFileChanged to true to be used further down in the script. I might just use sockets for this to be honest
            hasFileChanged = true;
        }
    });
} else {
    console.log(`${WatchedFile}`)
    hasFileChanged = "File does not exist, or I am unable to read it! Test"
    console.log(hasFileChanged)
}

/**
 * Web Portion of this... This needs changing, getting to it... Slowly today for some reason.
 * Should be changed to using socket.io to get a "live view".
 */
app.get("/", (req, res, next) => {
    if (typeof hasFileChanged === "boolean") {
        if (hasFileChanged) {
            res.json(["File has changed"]);
        } else {
            res.json(["File has not changed"])
        }
    } else {
        res.json([hasFileChanged])
    }
});

/**
 * Let us start the server and listen on the port provided by the configuration file
 */
app.listen(config.webport, () => {
    console.log(`Server running on port ${config.webport}`);
});
