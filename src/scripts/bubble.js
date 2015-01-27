/**
 * main4.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
if(0) {
    var $, document, Snap, classie, mina;
}

$(function() {
    (function() {
        var bodyEl = document.body;
        var content = document.querySelector(".content-wrap");
        var openbtn = document.getElementById("open-button");
        var closebtn = document.getElementById("close-button");
        var isOpen = false;
        var morphEl = document.getElementById("morph-shape");
        var s = new Snap(morphEl.querySelector("svg"));
        var path = s.select("path");
        var initialPath = path.attr("d");
        var steps = morphEl.getAttribute("data-morph-open").split(";");
        var stepsTotal = steps.length;
        var isAnimating = false;

        function init() {
            initEvents();
        }

        function initEvents() {
            openbtn.addEventListener("click", toggleMenu);
            if(closebtn) {
                closebtn.addEventListener("click", toggleMenu);
            }

            // close the menu element if the target it´s not the menu element or one of its descendants..
            content.addEventListener("click", function(ev) {
                var target = ev.target;
                if(isOpen && target !== openbtn) {
                    toggleMenu();
                }
            });
        }

        function toggleMenu() {
            if(isAnimating) return false;
            isAnimating = true;

            if(isOpen) {
                classie.remove(bodyEl, "show-menu");
                // animate path
                setTimeout(function() {
                    // reset path
                    path.attr("d", initialPath);
                    $(".left-menu-wrap").css("box-shadow", "none");
                    isAnimating = false;
                }, 300);
            } else {
                classie.add(bodyEl, "show-menu");
                // animate path
                var pos = 0;
                var nextStep = function(pos) {
                    if(pos > stepsTotal - 1) {
                        isAnimating = false;
                        $(".left-menu-wrap").css("box-shadow", "2px 0 5px #7A7E90");
                        return;
                    }

                    path.animate({
                            "path": steps[pos]
                        },
                        pos === 0 ? 400 : 500,
                        pos === 0 ? mina.easein : mina.elastic,
                        function() {
                            nextStep(pos);
                        });

                    pos++;
                };

                nextStep(pos);
            }

            isOpen = !isOpen;
        }

        init();
    })();
});
