// saved buffer
var sbuffer = new Buffer('', 0);
var buffers = [sbuffer];
var deft = document.getElementById("deft");
var current = 0;
var commits = 0;

var text = "";
var cursor_pos = 0;
var change_type = "";
var changes = 0;
var x = 0;
var y = 0;

track_changes = function() {
    now_text = deft.value;
    now_cursor_pos = getCaret(deft);

    if (now_text == text) {
        change_type = "no change";
    } else if (now_text.length > text.length) {
        if ((x = (now_text.length - text.length)) == (y = (now_cursor_pos - cursor_pos))) {
            change_type = "simple insert";
        } else {
            change_type = "complex insert";
        }
    } else if (now_text.length < text.length) {
        if ((now_text.length - text.length) == (now_cursor_pos - cursor_pos)) {
            change_type = "simple delete";
        } else {
            change_type = "complex delete";
        }
    } else {
        change_type = "substitution";
    }

    changes++;
    text = now_text;
    cursor_pos = getCaret(deft);
    status();
};


deft.onmouseup = track_changes;

deft.onkeyup = track_changes;

//deft.oninput = track_changes;

function Buffer(text, cursor) {
    this.text = text; this.cursor = cursor;
}

Buffer.prototype.set = function() {
    deft.value = this.text;
    setCaret(deft, this.cursor);
}

Buffer.prototype.toString = function() {
    return this.cursor + ":" + this.text;
}

function getBuffer() {
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
    buffers.push(sbuffer);
    sbuffer.set();
}

function right() {
    save();
    current = (current + 1) % buffers.length;
    buffers[current].set();
}

function left() {
    save();
    current = current == 0 ? (buffers.length - 1) : current - 1;
    buffers[current].set();
}

function status() {
    status2();
}

function status1() {
    var html = "Draft: <b>" + (current + 1) + "</b>" + "/" + buffers.length;
    html += " - Commit: <b>" + commits + "</b>";
    document.getElementById("buffers").innerHTML = html;
}

function status2() {
    html = "cursorpos: " + cursor_pos + " change: " + change_type + " x: " + x + " y: " + y;
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
bind('ctrl+j', function() { right(); });
bind('ctrl+k', function() { left(); });
//bind('ctrl+l', function() { right(); });

//bind('alt+left', function() { left(); });
//bind('alt+right', function() { right(); });
//bind('alt+up', function() { commit(); });
//bind('alt+down', function() { scratch(); });

bind('ctrl+space', function() { commit(); });
bind('space space', function() { scratch(); });
