const colors = require('colors');
const fs = require('fs');

function Odot() {
	this.data = this.load();
}

Odot.prototype.load = function() {
	try {
		var string = fs.readFileSync('.checklist.odot', {encoding: 'utf-8'});
		return JSON.parse(string);
	} catch (e) {
		return {items: [], stats: Odot.newStats()};
	}
}

Odot.prototype.save = function() {
	fs.writeFileSync(".checklist.odot", JSON.stringify(this.data));
}

Odot.prototype.print = function() {
	let json = this.data;
	for (var i = 0; i < json.items.length; i++) {
		if (json.items[i].done) console.log(colors.green('✓ (' + (i + 1) + ') ' + json.items[i].name));
		else console.log(colors.red.bold('✗ (' + (i + 1) + ') ' + json.items[i].name));
	}
}

Odot.prototype.currentStats = function() {
	var res = {finished: 0, unfinished: 0};
	this.data.items.forEach(function (element) {
		 if (element.done) res.finished++;
		 else res.unfinished++;
	});
	return res;
}

// Functions

Odot.prototype.equals = function() {
	if (this.data.items.length == 0) console.log("Your list is empty, yet.");
	else this.print();
}

Odot.prototype.plus = function(item) {
	this.data.items.push({"name": item, "done": false});
	this.print();
	this.save();
}

Odot.prototype.minus = function(item) {
	if (!this.data.stats) this.data.stats = Odot.newStats();
	let p = 0;
	if (item == '') item = this.data.items.length;
	if (isNaN(item)) {
		this.data.items.forEach(function(element) {
			if (element.name == item) {
				if (!element.done) this.data.stats.unfinished++;
				this.data.items.splice(p, 1);
				return;
			}
			p++;
		}, this);
	} else {
		let i = parseInt(item) - 1;
		if (!this.data.items[i].done) this.data.stats.unfinished++;
		this.data.items.splice(i, 1);
	}
	this.print();
	this.save();
}

Odot.prototype.filter = function() {
	var res = [];
	this.data.items.forEach(function (element) {
		 if (!element.done) res.push(element);
	});

	this.data.items = res;

	this.print();
	this.save();
}

Odot.prototype.check = function(item) {
	if (!this.data.stats) this.data.stats = Odot.newStats();
	if (item == '') {
		// Find first unchecked
		let counter = 1;
		this.data.items.forEach(function(element) {
			if (element.done == false) {
				item = counter;
				return;
			}
			counter++;
		}, this);
	}
	// Is the selector the number or the text of item
	if (isNaN(item)) {
		this.data.items.forEach(function(element) {
			if (element.name == item && !element.done) {
				element.done = true;
				this.data.stats.done++;
				return;
			}
		}, this);
	} else {
		let i = parseInt(item) - 1;
		if (!this.data.items[i].done) {
			this.data.items[i].done = true;
			this.data.stats.done++;
		}
	}

	this.print();
	this.save();
}

Odot.prototype.zero = function() {
	console.log(colors.grey("Bye, bye! *o*"));
	fs.unlink(".checklist.odot", function(err) {});
}

Odot.prototype.stats = function() {
	var cs = this.currentStats();
	console.log("Currently:")
	console.log(colors.green('\t✓ Finished: ' + cs.finished));
	console.log(colors.grey('\t- Unfinished: ' + cs.unfinished));

	console.log("All:")
	console.log(colors.green('\t✓ Finished: ' + this.data.stats.done));
	console.log(colors.grey('\t- Unfinished: ' + (this.data.stats.unfinished + cs.unfinished)));
}

// Helpers

Odot.newStats = function() {
	return {done: 0, unfinished: 0};
}

Odot.printList = function(json) {
	for (var i = 0; i < json.items.length; i++) {
		if (json.items[i].done) console.log(colors.green('✓ (' + (i + 1) + ') ' + json.items[i].name));
		else console.log(colors.red.bold('✗ (' + (i + 1) + ') ' + json.items[i].name));
	}
}

Odot.makeText = function(arr) {
    var res = "";
    arr.forEach(function (e) {
        res += e + " ";
    });
    return res;
}

module.exports = Odot;