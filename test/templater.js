var test = require('tape'),
    Enti = require('enti'),
    doc = require('doc-js')
    createFastn = require('./createFastn');

test('value data', function(t){

    t.plan(1);

    var fastn = createFastn();

    var template = fastn('templater', {
            data: {foo:'bar'},
            template: function(model){
                return fastn.binding('item.foo');
            }
        });

    template.render();

    doc.ready(function(){

        document.body.appendChild(template.element);

        t.equal(document.body.innerText, 'bar');

        template.element.remove();
        template.destroy();
    });


});


test('bound data', function(t){

    t.plan(1);

    var fastn = createFastn();

    var template = fastn('templater', {
            data: fastn.binding('data|*'),
            template: function(model){
                return fastn.binding('item.foo');
            }
        });

    template.attach({
        data: {
            foo: 'bar'
        }
    });
    template.render();

    doc.ready(function(){

        document.body.appendChild(template.element);

        t.equal(document.body.innerText, 'bar');

        template.element.remove();
        template.destroy();

    });

});


test('bound data changing', function(t){

    t.plan(2);

    var fastn = createFastn();

    var template = fastn('templater', {
            data: fastn.binding('data|*'),
            template: function(model){
                return fastn.binding('item.foo');
            }
        }),
        model = new Enti({
            data: {
                foo: 'bar'
            }
        });

    template.attach(model);
    template.render();

    doc.ready(function(){

        document.body.appendChild(template.element);

        t.equal(document.body.innerText, 'bar');

        model.set('data.foo', 'baz');

        t.equal(document.body.innerText, 'baz');

        template.element.remove();
        template.destroy();

    });

});

test('null data', function(t){

    t.plan(1);

    var fastn = createFastn();

    var template = fastn('templater', {
            data: null,
            template: function(model){}
        });

    template.render();

    doc.ready(function(){

        document.body.appendChild(template.element);

        t.equal(document.body.innerText, '');

        template.element.remove();
        template.destroy();

    });

});

test('undefined template', function(t){

    t.plan(1);

    var fastn = createFastn();

    var template = fastn('templater', {
            data: null,
            template: function(model){}
        });

    template.render();

    doc.ready(function(){

        document.body.appendChild(template.element);

        t.equal(document.body.innerText, '');

        template.element.remove();
        template.destroy();

    });

});

test('reuse template', function(t){

    t.plan(1);

    var fastn = createFastn();

    var template = fastn('templater', {
            data: 'foo',
            template: function(model, scope, lastTemplate){
                if(lastTemplate){
                    return lastTemplate;
                }
                t.pass();
                return fastn('text');
            }
        });

    template.render();

    template.data('bar');

});

test('reuse template same element', function(t){

    t.plan(3);

    var fastn = createFastn();

    var template = fastn('templater', {
            data: 'foo',
            template: function(model, scope, lastTemplate){
                if(lastTemplate){
                    return lastTemplate;
                }
                return fastn.binding('item');
            }
        });

    template.render();

    doc.ready(function(){

        document.body.appendChild(template.element);

        t.equal(document.body.innerText, 'foo');

        var lastNode = document.body.childNodes[1];

        // Don't re-render or re-insert the template if it is already rendered or inserted
        document.body.replaceChild = function(){
            t.fail();
        };

        template.data('bar');

        t.equal(document.body.innerText, 'bar');

        t.equal(lastNode, document.body.childNodes[1]);

        template.element.remove();
        template.destroy();

    });


});

test.only('reattach templater with attachTemplates = false', function(t){

    t.plan(3);

    var fastn = createFastn();

    var data = {foo: {bar: 1}},
        template = fastn('templater', {
            data: fastn.binding('nothing'),
            attachTemplates: false,
            template: function(model, scope, lastTemplate){
                return fastn.binding('bar');
            }
        })
        .attach(data)
        .binding('foo');

    template.render();

    doc.ready(function(){

        document.body.appendChild(template.element);

        t.equal(document.body.innerText, '1');

        fastn.Model.set(data, 'foo', {
            bar: 2
        });

        t.equal(document.body.innerText, '2');

        fastn.Model.set(data, 'foo', {
            bar: 3
        });

        t.equal(document.body.innerText, '3');

        template.element.remove();
        template.destroy();

    });


});