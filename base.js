"use strict";

var crypt;

(function () {

    // jQuery lite

    function $(id) {
        return document.getElementById(id);
    }

    // Underscore lite

    var _ = {
        'forEach': function (c, f) {
            for (var k in c) {
                if (c.hasOwnProperty(k)) {
                    f(c[k], k);
                }
            }
        }
    };

    // description handling

    var $description = $('description');
    $('openDescription').addEventListener('click', function(event) {
        $description.classList.toggle('active');
        event.preventDefault();
    });
    $('closeDescription').addEventListener('click', function(event) {
        $description.classList.remove('active');
        event.preventDefault();
    });

    // state handling

    var state = new function State() {
        this.encrypting = true;

        this.$plain = $('plain');
        this.$cipher = $('cipher');
        this.$key = $('key');

        this.$direction = $('direction');

        this.setEncrypting = function () {
            if (!this.encrypting) {
                this.$direction.classList.remove('flip');
                this.$direction.classList.add('flop');
                this.encrypting = true;
            }
        };

        this.setDecrypting = function () {
            if (this.encrypting) {
                this.$direction.classList.remove('flop');
                this.$direction.classList.add('flip');
                this.encrypting = false;
            }
        };

        this.$direction.addEventListener('click', function (event) {
            if (state.encrypting) {
                state.setDecrypting();
            } else {
                state.setEncrypting();
            }
            event.preventDefault();
        });
        this.$plain.addEventListener('keyup', function () {
            state.setEncrypting();
            update();
        });
        this.$cipher.addEventListener('keyup', function () {
            state.setDecrypting();
            update();
        });
        this.$key.addEventListener('keyup', update);
    };

    // options

    var opts = new function () {
        this.$deleteWhitespace = $('deleteWhitespace');
        this.$groupBy5s = $('groupBy5s');
        this.$deleteNonLetters = $('deleteNonLetters');
        this.$convertToUpcase = $('convertToUpcase');
        this.$skipNonLetterKeys = $('skipNonLetterKeys');
        _.forEach(this, function (opt) {
            opt.addEventListener('change', update);
        });
    };

    // character conversion

    var ACode = 'A'.charCodeAt(0);
    var aCode = 'a'.charCodeAt(0);

    function charToValue(ch) {
        if (ch >= 'A' && ch <= 'Z') {
            return ch.charCodeAt(0) - ACode;
        }
        if (ch >= 'a' && ch <= 'z') {
            return ch.charCodeAt(0) - aCode;
        }
        return -1;
    }

    function valueToChar(val, origCh) {
        val = (val + 26) % 26;
        if ((origCh >= 'A' && origCh <= 'Z') || opts.$convertToUpcase.checked) {
            return String.fromCharCode(ACode + val);
        }
        return String.fromCharCode(aCode + val);

    }

    // generic crypto handling

    function normalizeKey() {
        var result = [];
        var keyLength = state.$key.value.length;
        for (var i = 0; i < keyLength; ++i) {
            var val = charToValue(state.$key.value[i]);
            if (val >= 0 || !opts.$skipNonLetterKeys.checked) {
                result.push(val);
            }
        }
        return result;
    }

    function update() {
        var $from = state.encrypting ? state.$plain : state.$cipher;
        var $to = state.encrypting ? state.$cipher : state.$plain;

        var key = normalizeKey();
        var fromLength = $from.value.length;
        var k = 0;
        var j = 0;
        var result = '';
        for (var i = 0; i < fromLength; ++i) {
            var ch = $from.value[i];
            var val = charToValue(ch);
            if (val >= 0) {
                if (key.length > 0) {
                    if (state.encrypting) {
                        ch = valueToChar(crypt.encrypt(val, j++, key), ch);
                    } else {
                        ch = valueToChar(crypt.decrypt(val, j++, key), ch);
                    }
                } else {
                    ch = valueToChar(val, ch);
                }
            }
            if (ch <= ' ' && opts.$deleteWhitespace.checked) {
                continue;
            }
            if (val < 0 && opts.$deleteNonLetters.checked) {
                continue;
            }
            if (k && k % 5 == 0 && opts.$groupBy5s.checked) {
                result += ' ';
            }
            result += ch; ++k;
        }
        $to.value = result;
    }
})();
