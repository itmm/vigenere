"use strict";

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

    // state handling

    var state = new function State() {
        this.encrypting = true;

        this.$plain = $('plain');
        this.$cipher = $('cipher');
        this.$key = $('key');

        this.$direction = $('direction');

        this.$alphabets = [];

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

        var $alphaContainer = $('alphabets');
        for (var $child = $alphaContainer.firstChild; $child; $child = $child.nextSibling) {
            if ($child.className == 'alphabet') {
                (function(self, $ref) {
                    var $input = $ref.getElementsByTagName('input')[0];
                    self.$alphabets.push($input);
                    $input.addEventListener('keyup', update);
                    $ref.getElementsByTagName('button')[0].addEventListener('click', function (event) {
                        $alphaContainer.removeChild($ref);
                        self.$alphabets.splice(self.$alphabets.indexOf($input), 1);
                        update();
                        event.preventDefault();
                    });
                })(this, $child);
            }
        }
        $('add-alphabet').addEventListener('click', function(event) {
            var $container = document.createElement('div');
            $container.classList.add('alphabet');
            var $input = document.createElement('input');
            $input.setAttribute('type', 'text');
            $input.addEventListener('keyup', update);
            state.$alphabets.push($input);
            $container.appendChild($input);
            var $remove = document.createElement('button');
            $remove.appendChild(document.createTextNode('×'));
            $remove.addEventListener('click', function(event) {
                $alphaContainer.removeChild($container);
                state.$alphabets.splice(state.$alphabets.indexOf($input), 1);
                update();
                event.preventDefault();
            });
            $container.appendChild($remove);
            $alphaContainer.insertBefore($container, $('add-alphabet'));
            update();
            event.preventDefault();
        });
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

    var crypt = new Crypt(algo, state, opts);

    function update() {
        var $from = state.encrypting ? state.$plain : state.$cipher;
        var $to = state.encrypting ? state.$cipher : state.$plain;

        $to.value = crypt.process($from.value, state.encrypting);
    }
