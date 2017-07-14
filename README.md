# odot
odot is a really simple checklist command line tool. It's pretty dumb, but I'll work on it.

### Installation
```
$ npm install -g odotlist
```

### Usage
```
Usage: odot <command> <item>


  Commands:

    list|=              List your current list
    add|+ <item>        Add an item to your list
    remove|- <item>     Remove an item to your list
    filter|*            Remove finished items from your list
    check|! <item>      Check an item on your list
    clear|0             Clear your list

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```
Commands ```-``` and ```!``` also work with numbers (ex.: ```odot ! 1``` will check the first item on the list) or without any paremeters.

#### Examples
```
odot + Make examples
```
Adds "Make examples" to your list
<br><br>
```
odot ! Make examples
```
or
```
odot ! 1
```
Checks "Make examples"
<br><br>
```
odot - Make examples
```
Removes "Make examples" from the list
<br><br>
```
odot =
```
Prints the list
<br><br>
```
odot *
```
Remove finished items from your list
