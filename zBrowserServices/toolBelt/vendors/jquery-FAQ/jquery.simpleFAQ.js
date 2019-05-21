/* Copyright (c) 2008 Jordan Kasper
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * Copyright notice and license must remain intact for legal use
 * Requires: jQuery 1.7+
 *           jQuery.quicksilver (or provide your own scoring function for searches)
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS 
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * For more usage documentation and examples, visit:
 *  https://github.com/jakerella/jquerySimpleFAQ
 *  
 */
;(function($) {

  /**
   * This method will add the FAQ UI to the selected element
   * 
   *  Typical usage:
   *   $('ul#faqs').simpleFAQ({
   *     // options
   *   });
   * 
   * @param  {object|string} o Options for the new FAQ object
   * @return {jQuery} The jQuery object for chain calling
   */
  $.fn.simpleFAQ = function(o) {
    var n = $(this);
    o = (o)?o:{};

    if (!o.node && n.length) {
      o.node = n;
    }

    o.node = $(o.node);
    o.node.each(function() {
      var sf = new $.jk.SimpleFAQ(o);
    });

    return n;
  };


  // CONSTRUCTOR
  if (!$.jk) { $.jk = {}; }
  $.jk.SimpleFAQ = function(o) {
    var t = this, n;

    o = (o)?o:{};

    // Audit options and merge with object
    $.extend(t, ((o)?o:{}));

    t.node = $( ((o.node)?o.node:null) );
    if (t.node && t.node.length === 1) {
      n = t.node;
    } else {
      t.node = null;
      // if we don't have a single node, nothing more we can do...
      return t;
    }

    // Are we building the FAQs from data?
    if ($.isArray(t.data)) {
      this.buildFaqsFromData();
    }

    // Add some classes and Cache FAQ nodes for use later
    n.addClass(t.ns+'_list');
    t.faqNodes = n.children(t.nodeType).addClass(t.ns+'_item');

    t.setupBasicActions();
    
    // Hide all answers by default (not through "hideAll" since we don't want events, sliding, etc)
    t.faqNodes.find('.'+t.answerClass).hide();
    // but show any FAQ referenced in URL hash
    t.showDefaultItem();

    if (t.allowSearch) {
      t.searchNode = $(t.searchNode);
      if (t.searchNode.length) { // do we have a search node?
        if (t.score === null && (typeof $.score == 'function')) {
          t.score = $.score;
        }
        if (typeof t.score == 'function') { // do we have a "score" function?
          
          t.addSearchUI();
          if (!t.showAllOnEmpty) { t.hideSearchResults(t.faqNodes); }

        } else {
          t.allowSearch = false;
          t.searchNode = null;
          t.score = null;
        }
      } else {
        t.allowSearch = false;
        t.searchNode = null;
      }
    }

    // set the class as node data and fire init event
    n.data(t.ns, t)
     .trigger('init.'+t.ns, [t]);
  };


  // PUBLIC PROPERTIES (Default options)
  // Assign default options to the class prototype
  $.extend($.jk.SimpleFAQ.prototype, {
    data: null,                // Array If provided, this data is used as the FAQ data with each array entry being an object with 'question', 'answer', and 'tags' properties, this will be used to build the list
    nodeType: 'li',            // String The type of node to look for (and use) for FAQs
    questionClass: 'question', // String The class that all questions will have (either you have to give them this class, or use the plugin to build the list)
    answerClass: 'answer',     // String The class that all answers will have (either you have to give them this class, or use the plugin to build the list)
    tagClass: 'tags',          // String The class for a node in the answer that contains tags specific to each answer. If this exists, it boosts the score for search terms that are in the tags
    showOnlyOne: false,        // Boolean If true, only one answer will be visible at a time
    changeHash: true,          // Boolean If true, the URL hash will be changed on each FAQ toggle, thus allowing for linking directly to a specific FAQ
    slideSpeed: 500,           // Number or String The speed to open and close FAQ answers. String values must be one of the three predefined speeds: "slow", "normal", or "fast"; numeric values are the number of milliseconds to run the animation (e.g. 1000).
    
    allowSearch: false,        // Boolean If true, adds a search box (must provide searchNode)
    score: null,               // Function If null, we'll look for the Quicksilver "score" function, if it doesn't exist, search will be disabled
    searchNode: null,          // String | Element Only required if allowSearch is true; it is the element used for search input. NOTE: we use the "keyup" event, so this should be something that will emit that event correctly! (can be a node, jQuery object, or selector)
    minSearchScore: 0.5,       // Number The minimum score a FAQ must have in order to appear in search results. Should be a number between 0 and 1 (Quicksilver score)
    sortSearch: false,         // Boolean Whether or not to sort search results
    showAllOnEmpty: true,      // Boolean Should the plugin show all FAQs when there is no search input?
    caseSensitive: false,      // boolean Whether or not the search is case sensitive
    keyTimeout: 400,           // Number Wait time before searching occurs
    partialTagScore: 0.1,      // Number What to increase the match score by when partial tags are matched (such as "sim" -> "simple")
    exactTagScore: 0.2,        // Number What to increase the match score by when an exact tag is matched (such as "simple" -> "simple")

    node: null,                // Node | String The node (or selector) to use for the FAQ UI. If not set, the current node selected by $(...).simpleFAQ(); will be used
    ns: 'simpleFAQ'            // String Used before all assigned classes and as an event namespace
  });


  // PUBLIC METHODS
  $.extend($.jk.SimpleFAQ.prototype, {
    
    setupBasicActions: function() {
      var t = this;
      t.node
        .on('mouseover', '.'+t.questionClass, function() {
          $(this).addClass(t.ns+'Hover');
        })
        .on('mouseout', '.'+t.questionClass, function() {
          $(this).removeClass(t.ns+'Hover');
        })
        .on('click.'+t.ns, '.'+t.questionClass, function(e) {
          var faq = $(this).parents('.'+t.ns+'_item');
          if (t.showOnlyOne) {
            // Hide all others
            t.hideAll(faq);
          }
          t.toggleFaq(faq);
        });
    },

    buildFaqsFromData: function() {
      var  t = this,
          fc = "";
      for (var i=0, l=t.data.length; i<l; ++i) {
        fc += "<"+t.nodeType+">"+
                "<p class='"+t.questionClass+"'>"+t.data[i].question+"</p>"+
                "<div class='"+t.answerClass+"'>"+
                  t.data[i].answer+
                "</div>"+
                "<p class='"+t.tagClass+"'>"+(t.data[i].tags || "")+"</p>"+
              "</"+t.nodeType+">";
      }
      t.node.append(fc);
    },

    toggleFaq: function(faq, cb) {
      var t = this;
      faq = (faq || $(t.faqNodes.get(0)));
      var ans = faq.find('.'+t.answerClass);
      cb = (cb || function() {});

      ans
        .slideToggle(t.slideSpeed, function() {
          if (ans.is(':visible')) {
            faq.addClass(t.ns+'Showing');
            t.node.trigger('show.'+t.ns, [faq[0]]);

            if (t.changeHash) {
              var h = faq.attr('id');
              if (h && h.length > 0) {
                document.location.hash = escape(h);
              }
            }

          } else {
            faq.removeClass(t.ns+'Showing');
            t.node.trigger('hide.'+t.ns, [faq[0]]);
          }
          cb();
        });
    },

    hideAll: function(except, cb) {
      var   t = this,
          cnt = 0,
          vis = null;
      except = (except || null);
      cb = (cb || function() {});

      vis = t.faqNodes.find('.'+t.answerClass+':visible');
      if (except) {
        vis = vis.not(except.find('.'+t.answerClass));
      }

      if (vis.length) {
        vis
          .slideUp(t.slideSpeed, function() {
            var p = $(this).parents('.'+t.ns+'_item').removeClass(t.ns+'Showing');
            t.node.trigger('hide.'+t.ns, [p[0]]);
            
            // only do callback once, when all answers are hidden
            cnt++;
            if (cnt >= vis.length) { cb(); }
          });
      } else {
        cb();
      }
    },

    showDefaultItem: function() {
      var  t = this,
          ch = document.location.hash,
          fn = null;
      if (ch && ch.length > 0) {
        fn = $(ch);
        if (fn.length && fn.is('.'+t.ns+'_item')) {
          t.toggleFaq(fn);
        }
      }
    },

    hideSearchResults: function(nodes) {
      var t = this;
      nodes
        .hide()
        .removeClass(t.ns+'Result '+t.ns+'Showing')
        .find('.'+t.answerClass)
          .hide();
    },

    addSearchUI: function() {
      var  t = this;
      if (!t.searchNode || !t.searchNode.length) { return; }
      
      t.__sto = null;
      t.searchNode
        .addClass(t.ns+'Search')
        .keyup(function(e) {
          clearTimeout(t.__sto);
          t.__sto = null;
          
          // add a slight delay to wait for more input
          t.__sto = setTimeout(function() {
            t.handleSearchKey(t.searchNode.val());
          }, t.keyTimeout);
        });
    },

    handleSearchKey: function(v) {
      var      t = this,
          scores = [];

      t.node.trigger('searchStart.'+t.ns);

      if (v.length < 1) {
        // remove classes, etc
        t.hideSearchResults(t.faqNodes);
        // show all (unopened) if desired
        if (t.showAllOnEmpty) { t.faqNodes.show(); }
        t.node.trigger('searchEnd.'+t.ns, [scores]);

        return scores;
      }

      // Score the input
      scores = t.doScoring(v);
      
      if (t.sortSearch) {
        scores.sort(function(a, b){ return b[0] - a[0]; });
        t.node.trigger('sort.'+t.ns, [scores]);
      }
      
      // Show the relevant questions by search score
      var resFaqs = [];
      for (var i=0, l=scores.length; i<l; ++i) {
        scores[i][1].show().addClass(t.ns+'Result');
        resFaqs.push(scores[i][1][0]);
        // if they want things sorted, then we append the FAQ to the parent node
        if (t.sortSearch) { t.node.append(scores[i][1]); }
      }

      // hide FAQs not in search results
      t.hideSearchResults(t.faqNodes.not(resFaqs));

      t.node.trigger('searchEnd.'+t.ns, [scores]);

      return scores;
    },

    doScoring: function(v) {
      var   t = this,
          res = [],
            w = [];
      
      if (!v || !v.length) { return res; }
      v = ""+((t.caseSensitive)?v:v.toLowerCase());
      w = (""+v).split(' ');

      t.faqNodes.each(function() {
        var     faq = $(this),
            faqText = "",
                  s = 0;

        faqText  = faq.find('.'+t.questionClass).text();
        // add a space between question and answer (all text is searched)
        faqText += " "+faq.find('.'+t.answerClass).text();
        faqText  = (t.caseSensitive)?faqText:faqText.toLowerCase();
        
        for (var i=0, l=w.length; i<l; ++i) {
          if (!w[i].length) { continue; } // ignore empty entries
          s +=  t.score(faqText, w[i]);
        }

        s += t.scoreTags(faq.find('.'+t.tagClass).text(), w);
        
        if (s > t.minSearchScore) {
          res.push([s, faq]);
        }
      });

      return res;
    },

    scoreTags: function(tags, w) {
      var   t = this,
            s = 0,
          tag = "",
            m = null;

      if (!tags.length) { return s; }
      if (!w || !w.splice || !w.length) { return s; }

      // handle case sensitivity and replace some punctuation with spaces for better matching
      tags = ((t.caseSensitive)?tags:tags.toLowerCase()).replace(/\s?(,|;)\s?/g, ' ');

      for (var i=0, l=w.length; i<l; ++i) {
        if (!w[i].length) { continue; } // ignore empty entries
        
        m = tags.match(new RegExp("[^\\s]*("+w[i]+")[^\\s]*"));

        if (m) {
          // we have a match, see if it's exact or partial
          if (m[0].length == m[1].length) {
            s += t.exactTagScore;
          } else {
            s += t.partialTagScore;
          }
        }
      }
      return s;
    }

  });

})(jQuery);
