const colors = require('colors');
const fs = require('fs');
const shortid = require('shortid');
const remote = require('./remote');

function Odot() {
	this.data = this.load();
}

Odot.prototype.load = function() {
	try {
		var string = fs.readFileSync('.odot', {encoding: 'utf-8'});
		return JSON.parse(string);
	} catch (e) {
		return {items: [], ideas: [], stats: Odot.newStats(), remote: {}};
	}
}

Odot.prototype.save = function() {
	fs.writeFileSync(".odot", JSON.stringify(this.data, null, '\t'));
}

Odot.prototype.print = function() {
	var json = this.data;
	for (var i = 0; i < json.items.length; i++) {
		if (json.items[i].done) console.log(colors.green('✓ (' + (i + 1) + ') ' + json.items[i].name));
		else console.log(colors.red.bold('✗ (' + (i + 1) + ') ' + json.items[i].name));
	}

	if (json.ideas.length) {
		console.log('\nIdeas:');

		for (var i = 0; i < json.ideas.length; i++) {
			console.log(colors.blue('(' + (i + 1) + ') ' + json.ideas[i].name));
		}
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
	var p = 0;
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
		var i = parseInt(item) - 1;
		if (this.data.items[i] && !this.data.items[i].done) this.data.stats.unfinished++;
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
		var counter = 1;
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
		var i = parseInt(item) - 1;
		if (this.data.items[i] && !this.data.items[i].done) {
			this.data.items[i].done = true;
			this.data.stats.done++;
		}
	}

	this.print();
	this.save();
}

Odot.prototype.zero = function() {
	console.log(colors.grey("Bye, bye! *o*"));
	fs.unlink(".odot", function(err) {});
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

Odot.prototype.question = function(item) {
	this.data.ideas.push({"name": item});
	this.print();
	this.save();
}

Odot.prototype.yes = function(item) {
	// Is the selector the number or the text of item
	if (isNaN(item)) {
		this.data.ideas.forEach(function(element) {
			if (element.name == item) {
				var name = element.name;
				this.data.ideas.splice(this.data.ideas.indexOf(element), 1);
				this.plus(name);
				return;
			}
		}, this);
	} else {
		var i = parseInt(item) - 1;
		var name = this.data.ideas[i].name;
		this.data.ideas.splice(i, 1);
		this.plus(name);
	}
}

Odot.prototype.no = function(item) {
	if (isNaN(item)) {
		this.data.ideas.forEach(function(element) {
			if (element.name == item) {
				this.data.ideas.splice(this.data.ideas.indexOf(element), 1);
				return;
			}
		}, this);
	} else {
		var i = parseInt(item) - 1;
		this.data.ideas.splice(i, 1);
	}
	this.print();
	this.save();
}

// Remote

Odot.prototype.connect = function(secret) {
	this.data.remote.secret = secret;
	console.log("Connected to remote " + secret);
	this.save();
}

Odot.prototype.disconnect = function() {
	delete this.data.remote;
}

Odot.prototype.push = function () {
	var t = this;
	remote.push(this.data, function(res) {
		if (res.data == 'created') {
			console.log("A remote list was created at " + t.data.remote.secret);
			t.save();
		} else console.log('Remote list updated at ' + t.data.remote.secret);
	});
}

Odot.prototype.pull = function() {
	var t = this;
	remote.pull(t.data, function(res) {
		console.log("Local list updated from " + t.data.remote.secret);
		t.data = res.data.data;
		t.save();
	});
}

// Helpers

Odot.newStats = function() {
	return {done: 0, unfinished: 0};
}

Odot.makeText = function(arr) {
    var res = "";
    arr.forEach(function (e) {
        res += e + " ";
    });
    return res;
}

module.exports = Odot;
