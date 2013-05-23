$(document).ready(function() {
    $('.drafts').cycle({
		fx: 'shuffle', // choose your transition type, ex: fade, scrollUp, shuffle, etc...
                timeout: 0,
                next: '#next',
                prev: '#prev',
                speed: 250
	});
});

// saved buffer
var sbuffer = new Buffer('', 0);
var buffers = [sbuffer];
var current = 0;
var commits = 0;
var current_illusion = "esil";

function switch_illusion() {
    current_illusion = (current_illusion == "esil") ? "isar" : "esil";
    $('#' + current_illusion).focus();
}

function illusion() {
    return document.getElementById(current_illusion);
}

function Buffer(text, cursor) {
    this.text = text; this.cursor = cursor;
}

Buffer.prototype.set = function() {
    deft = illusion();
    deft.value = this.text;
    setCaret(deft, this.cursor);
}

Buffer.prototype.toString = function() {
    return this.cursor + ":" + this.text;
}

function getBuffer() {
    deft = illusion();
    return new Buffer(deft.value.replace(/ +/g, ' '), getCaret(deft));
}

function commit() {
    sbuffer = getBuffer();
    buffers = [sbuffer];
    current = 0;
    commits++;
}

function save() {
    buffer = getBuffer();
    buffers[current] = buffer;
}

function scratch() {
    save();
    current = buffers.length;
    switch_illusion();
    $('#next').trigger('click');
    buffers.push(sbuffer);
    sbuffer.set();
}

function right() {
    if (buffers.length > 1) {
        save();
        current = (current + 1) % buffers.length;
        switch_illusion();
        $('#next').trigger('click');
        buffers[current].set();
    }
}

function left() {
    if (buffers.length > 1) {
        save();
        current = current == 0 ? (buffers.length - 1) : current - 1;
        switch_illusion();
        $('#prev').trigger('click');
        buffers[current].set();
    }
}

function status() {
    var html = "Draft: <b>" + (current + 1) + "</b>" + "/" + buffers.length;
    html += " - Commit: <b>" + commits + "</b>"
    document.getElementById("buffers").innerHTML = html;
}

function bind(sc, f) {
    Mousetrap.bind(sc, function(e) {
        if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; }
        f();
        status();
    });
}

//bind('ctrl+h', function() { left(); });
bind('ctrl+l', function() { right(); });
bind('ctrl+h', function() { left(); });
//bind('ctrl+l', function() { right(); });

//bind('alt+left', function() { left(); });
//bind('alt+right', function() { right(); });
//bind('alt+up', function() { commit(); });
//bind('alt+down', function() { scratch(); });

bind('ctrl+s', function() { commit(); });
bind('ctrl+space', function() { scratch(); });
