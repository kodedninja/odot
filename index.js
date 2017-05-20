#!/usr/bin/env node
'use strict';

const colors = require("colors");
const fs = require('fs');

const program = require("commander");
const _version_ = require("./package.json").version;

var json;

var loadList = function(callback) {
    var string = fs.readFile(".checklist.odot", "utf-8", function(err, data) {
        if (err) {
            json = {items: []}
            fs.writeFileSync(".checklist.odot", JSON.stringify(json));
            callback(json);
        } else {
            json = JSON.parse(data);
            callback(json);
        }
    });
}

program
    .version(_version_)
    .usage('<command> <item>');

program
    .command("list").alias("=")
    .description("List your current list")
    .action(function() {
        loadList(function (json) {
            if (json.items.length == 0) console.log("Your list is empty, yet.");
            else printList(json);
        });
});

program
    .command("add [item...]").alias("+")
    .description("Add an item to your list")
    .action(function(item) {
        item = makeText(item);
        loadList(function(json) {
            json.items.push({"name": item, "done": false});
            printList(json);
            fs.writeFileSync(".checklist.odot", JSON.stringify(json));
        });
});

program
    .command("remove [item...]").alias("-")
    .description("Remove an item to your list")
    .action(function(item) {
        item = makeText(item);
        loadList(function(json) {
            var p = 0;
            if (isNaN(item)) {
                json.items.forEach(function(element) {
                    if (element.name == item) {
                        json.items.splice(p, 1);
                        return;
                    }
                    p++;
                }, this);
            } else {
                var count = 0;
                json.items.forEach(function(element) {
                    count++;
                    if (count == item) {
                        json.items.splice(count - 1, 1);
                        return;
                    }
                }, this);
            }

            printList(json);
            fs.writeFileSync(".checklist.odot", JSON.stringify(json));
        });
});

program
    .command("check [item...]").alias("!")
    .description("Check an item on your list")
    .action(function(item) {
        item = makeText(item);
        loadList(function(json) {

            if (isNaN(item)) {
                json.items.forEach(function(element) {
                    if (element.name == item) {
                        element.done = true;
                        return;
                    }
                }, this);
            } else {
                var counter = 0;
                json.items.forEach(function(element) {
                    counter++;
                    if (counter == item) {
                        element.done = true;
                        return;
                    }
                }, this);
            }

            printList(json);
            fs.writeFileSync(".checklist.odot", JSON.stringify(json));
        });
});

program
    .command("clear").alias("0")
    .description("Clear your list")
    .action(function() {
        console.log(colors.grey("Bye, bye! *o*"));
        fs.unlink(".checklist.odot", function(err) {});
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

function printList(json) {
    json.items.forEach(function(element) {
        if (element.done) console.log(colors.green('✓ ' + element.name));
        else console.log(colors.red.bold('✗ ' + element.name));
    }, this);
}

function makeText(arr) {
    var res = "";
    arr.forEach(function (e) {
        res += e + " ";
    });
    return res;
}
