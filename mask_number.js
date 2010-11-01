(function() {
    if(typeof(Prototype) == "undefined")
        throw "MaskNumber requires Prototype to be loaded.";

    if(Prototype.Version < '1.6.1')
        throw "MaskNumber requires Prototype 1.6.1 or greater.";

    MaskNumber = Class.create({
        initialize: function(selector, opts) {  
            this.elements = $$(selector);
            this.mask(opts);	 
        },
        mask: function (opts) {
            opts = Object.extend({
                delim: '.',
                numDec: 2,
                max: 256,
            }, opts || {});

            if( opts.delim && opts.numDec > 0 ){
                opts.delim = $A(opts.delim).first();
                opts.numDec = ( opts.numDec < opts.max  ? opts.numDec : opts.max - 1);
                opts.min = opts.numDec + 1;
            } else {
                opts.delim = "";
                opts.numDec = 0;
                opts.min = ( opts.min ? opts.min : 0 );
            }

            this.elements.each(function(el) {
                var input = $(el);
                input.setAttribute('maxlength', opts.max);

                if (!input.readAttribute("readonly")){
                    input.observe("blur", function(event){
                        var input = Event.element(event);
                        var text = $A($(input).value).reject(function(c, i){ 
                            var regexp = new RegExp("[^\\d"+(opts.delim != '' ? "\\"+opts.delim+"]" : ']' ));
                            return regexp.test(c);
                        }).join('');
                        var size = text.length;
                        var min = opts.min + ( opts.delim != '' ? 1 : 0);

                        if(size < min){ input.setValue(''); }
                    })
                    .observe("keydown", function(event){
                        var input = Event.element(event);
                        var key = event.keyCode;
                        var text = $A($(input).getValue()).reject(function(c, i){
                            var regexp = new RegExp(/[^\d]/);
                            return regexp.test(c);
                        }).join('');
                        var size = text.length;

                        if(opts.max < size ){
                            event.stop();
                            return false;
                        }

                        size += (size < opts.max && key != 8 ? 1 : 0 ) - (key == 8 ? 1 : 0 );

                        if ( key == 8 || key == 88 || key == 46 || key == 13 || 48 <= key && key <= 57 || 96 <= key && key <= 105 ){
                            if ( opts.min <= size && size < opts.max && opts.numDec < opts.max ){
                                input.setValue(text.substr( 0, size - opts.numDec ) + opts.delim + text.substr( size - opts.numDec, size ));
                            }
                        } else {
                            event.stop();
                        }
                    });
                }
            });
            return this;
        }
    });

    Object.extend(MaskNumber,{    
        apply: function () {
            new MaskNumber('input.mask_number');
        }
    });

    $(document).observe('dom:loaded', MaskNumber.apply.bind(MaskNumber));
})();
