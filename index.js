#!/usr/bin/env node
'use strict';

const colors = require("colors");
const fs = require('fs');

const program = require("commander");
const _version_ = require("./package.json").version;
const Odot = require('./src/odot.js');

var json;

var odot = new Odot();

program
    .version(_version_)
    .usage('<command> <item>');

program
    .command("list").alias("=")
    .description("List your current list")
    .action(function() {
        odot.equals();
});

program
    .command("add [item...]").alias("+")
    .description("Add an item to your list")
    .action(function(item) {
        item = Odot.makeText(item);
        odot.plus(item);
});

program
    .command("remove [item...]").alias("-")
    .description("Remove an item to your list")
    .action(function(item) {
        item = Odot.makeText(item);
        odot.minus(item);
});

program
    .command("filter").alias("*")
    .description("Remove finished items from your list")
    .action(function() {
        odot.filter();
});

program
    .command("check [item...]").alias("!")
    .description("Check an item on your list")
    .action(function(item) {
        item = Odot.makeText(item);
        odot.check(item);
});

program
    .command("stats").alias("s")
    .description("Print your stats")
    .action(function() {
        odot.stats();
});

program
    .command("clear").alias("0")
    .description("Clear your list")
    .action(function() {
        odot.zero();
});

program
    .command("idea [item...]").alias("?")
    .description("Adds an idea to the list")
    .action(function(item) {
        item = Odot.makeText(item);
        odot.question(item);
    });

// remote
program
    .command("connect <secret>").alias("c")
    .description("Connect to remote")
    .action(function(secret) {
        odot.connect(secret);
});

program
    .command("push")
    .description("Push to remote")
    .action(function() {
        odot.push();
});

program
    .command("pull")
    .description("Pull from remote")
    .action(function() {
        odot.pull();
});

program.parse(process.argv);

// Output help by default
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
