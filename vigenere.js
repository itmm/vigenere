"use strict";

window.addEventListener('load', function() {
   function $(id) { return document.getElementById(id); }

   var $encrypt = $('encrypt');
   var $decrypt = $('decrypt');
   var encrypting = true;

   function setEncrypting() {
       if (! encrypting) {
           $decrypt.classList.remove('active');
           $encrypt.classList.add('active');
           encrypting = true;
       }
   }

   function setDecrypting() {
       if (encrypting) {
           $encrypt.classList.remove('active');
           $decrypt.classList.add('active');
           encrypting = false;
       }
   }

   $encrypt.addEventListener('click', function(event) {
       setDecrypting();
       event.preventDefault();
   });

   $decrypt.addEventListener('click', function(event) {
       setEncrypting();
       event.preventDefault();
   });

   var $plain = $('plain');
   var $encrypted = $('encrypted');
   var $key = $('key');

   var ACode = 'A'.charCodeAt(0);
   var aCode = 'a'.charCodeAt(0);

   function char_to_value(ch) {
       if ((ch >= 'A') && (ch <= 'Z')) { return ch.charCodeAt(0) - ACode; }
       if ((ch >= 'a') && (ch <= 'z')) { return ch.charCodeAt(0) - aCode; }
       return -1;
   }

   function value_to_char(val, origCh) {
       val = (val + 26) % 26;
       if ((origCh >= 'A') && (origCh <= 'Z')) {
           return String.fromCharCode(ACode + val);
       }
       return String.fromCharCode(aCode + val);

   }

   function perform($from, $to, factor) {
       var keyLength = $key.value.length;
       if (keyLength <= 0) { $to.value = ''; return; }

       var fromLength = $from.value.length;
       var j = 0;
       var result = '';
       for (var i = 0; i < fromLength; ++i) {
           var ch = $from.value[i];
           var val = char_to_value(ch);
           if (val >= 0) {
               var key = char_to_value($key.value[j++ % keyLength]);
               if (key >= 0) {
                   ch = value_to_char(val + key * factor, ch);
               }
           }
           result += ch;
       }
       $to.value = result;
   }

   function update() {
       if (encrypting) {
           perform($plain, $encrypted, 1);
       } else {
           perform($encrypted, $plain, -1);
       }
   }

   $plain.addEventListener('keyup', function() {
       setEncrypting();
       update();
   });
   $encrypted.addEventListener('keyup', function() {
       setDecrypting();
       update();
   });
   $key.addEventListener('keyup', function() {
       update();
   });
});
