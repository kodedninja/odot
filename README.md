# odot
odot is a really simple checklist command line tool. It's pretty dumb, but I'll work on it. It makes todoing very comfortable through short commands.

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
    stats|s             Print your stats
    clear|0             Clear your list
    idea|? [item...]    Adds an idea to the list
    yes|y [item...]     Adds an idea to the todo list
    no|n [item...]      Removes an idea from the list

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
<br><br>
```
odot s
```
Print your stats
<br><br>
```
odot ? This is an idea
```
Adds "This is an idea" to the list
<br><br>
```
odot yes This is an idea
```
Adds "This is an idea" to the list from idea list
<br><br>
```
odot no This is an idea
```
Removed "This is an idea" from idea list
