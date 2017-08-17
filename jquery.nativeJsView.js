/*! jquery.nativeJsView.js v0.9 */
/*
 * This is a view template that uses native javascript code in HTML.
 * Requires jQuery 1.x or later.
 * See https://github.com/devSonicgirl/nativeJsView
 *
 * Copyright 2017, devSonicgirl
 * Released under the MIT License.
 */
(function($) {
    'use strict';

    var nativejsview = function(dom_object) {
        this.init = nativejsview.prototype.init;
        this.init(dom_object);
    }

    nativejsview.prototype = {
        constructor: nativejsview,
        dom: '',
        js_id: null,
        script_vars: '',
        script_body: '',

        init: function(dom_object) {

            var tpl_obj = dom_object;
            if (!$(tpl_obj).attr('id')) {
                $(tpl_obj).attr('id', "jv_" + new Date().getTime() + (parseInt(Math.random() * 100)).toString());
            }
            this.js_id = $(tpl_obj).attr('id');
            this.dom = $(tpl_obj).html();


        },

        setjs: function(command, type) {
            if (command) {
                if (type == 'vars') this.script_vars = this.script_vars.concat(command, '\n');
                else if (type == 'body') this.script_body = this.script_body.concat(command, '\n');
            }
        },

        vars_define: function(tpl_data) {
            var this_object = this;
            var script_type = 'vars';
            this.script_vars = '';

            $.each(tpl_data, function(name, value) {
                switch (typeof value) {
                    case 'string':
                        this_object.setjs("var " + name + " = \"" + value.replace(/\"/g, '\\"') + "\"", script_type);
                        break;
                    case 'number':
                        this_object.setjs("var " + name + " = " + value, script_type);
                        break;
                    case 'boolean':
                        this_object.setjs("var " + name + " = " + value, script_type);
                        break;
                    case 'object':
                        this_object.setjs("var " + name + " = " + JSON.stringify(value), script_type);
                        break;
                    case 'function':
                        break;
                    default:

                }
            });
        },

        render: function() {
            var render_var = "jv_render_" + new Date().getTime();
            var script_type = 'body';
            var dom = this.dom;
            //console.log(dom);
            dom = dom.trim();
            dom = dom.replace(/\n/gm, '');
            dom = dom.replace(/>\s+</gm, '><');
            //dom = dom.replace(/>\s*(.*?)\s*</g, ">$1<");

            dom = dom.replace(/\&amp;/g, '\\&');
            dom = dom.replace(/\&gt;/g, '>');
            dom = dom.replace(/\&lt;/g, '<');

            dom = dom.replace(/\"/g, '\\"');

            dom = dom.replace(/<!-{2,}=(.*?)-{2,}>/g, function(s, s1) {
                s1 = s1.replace(/\\"/g, '"');
                return "\")\n".concat("put_html(", s1.trim(), ")\n", "put_html(\"");
            });

            dom = dom.replace(/<!-{2,}_(.*?)-{2,}>/g, function(s, s1) {
                s1 = s1.replace(/\\"/g, '"');
                return "\")\n".concat(s1.trim(), "\n", "put_html(\"");
            });


            this.setjs("var ".concat(render_var, " = ''"), script_type);
            this.setjs("function put_html(html) { ".concat(render_var, "=", render_var, ".concat(html)", "}"), script_type);

            this.setjs("put_html(\"".concat(dom, "\")"), script_type);
            this.setjs("$('#".concat(this.js_id, "').html(", render_var, ")"), script_type);
        },

        call: function() {
            var script_all = this.script_vars.concat(this.script_body);
            try {
                new Function(script_all)();
            } catch (e) {
                console.log("%cjv-error" + "%c " + e, "background-color:#ff0000; color:#ffffff;", "color:#000000");
                $("#" + this.js_id).html('');
            }

        },

        refresh: function(tpl_data) {
            this.vars_define(tpl_data);
            this.call();
        }
    }
    nativejsview.prototype.constructor = nativejsview;


    $.fn.nativeJsView = function(tpl_data) {
        var js_tpl = new nativejsview(this);
        js_tpl.vars_define(tpl_data);
        js_tpl.render();
        js_tpl.call();

        return js_tpl;
    }



})(jQuery);