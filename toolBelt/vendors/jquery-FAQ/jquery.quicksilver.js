// qs_score - Quicksilver Score
// 
// A port of the Quicksilver string ranking algorithm
// 
// Examples changed to fit jQuery model (JSK):
// $.score("hello world", "axl") //=> 0.0
// $.score("hello world", "ow") //=> 0.6
// $.score("hello world", "hello world") //=> 1.0
//
// Tested in Firefox 2 and Safari 3
//
// The Quicksilver code is available here
// http://code.google.com/p/blacktree-alchemy/
// http://blacktree-alchemy.googlecode.com/svn/trunk/Crucible/Code/NSString+BLTRRanking.m
//
// The MIT License
// 
// Copyright (c) 2008 Lachie Cox
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* Ported to jQuery style by Jordan Kasper
 * Requires: jQuery 1.0.x
 */

;(function($) {
  
  // JSK - Added base string argument
  $.score = function(base, abbreviation, offset) {
    
    offset = offset || 0 // TODO: I think this is unused... remove
    
    if(abbreviation.length == 0) return 0.9
    if(abbreviation.length > base.length) return 0.0
    
    for (var i = abbreviation.length; i > 0; i--) {
      var sub_abbreviation = abbreviation.substring(0,i)
      var index = base.indexOf(sub_abbreviation)
      
      
      if(index < 0) continue;
      if(index + abbreviation.length > base.length + offset) continue;
      
      var next_string       = base.substring(index+sub_abbreviation.length)
      var next_abbreviation = null
      
      if(i >= abbreviation.length)
        next_abbreviation = ''
      else
        next_abbreviation = abbreviation.substring(i)
      
      // Changed to fit new (jQuery) format (JSK)
      var remaining_score   = $.score(next_string, next_abbreviation,offset+index)
      
      if (remaining_score > 0) {
        var score = base.length-next_string.length;
        
        if(index != 0) {
          var j = 0;
          
          var c = base.charCodeAt(index-1)
          if(c==32 || c == 9) {
            for(var j=(index-2); j >= 0; j--) {
              c = base.charCodeAt(j)
              score -= ((c == 32 || c == 9) ? 1 : 0.15)
            }
            
            // XXX maybe not port this heuristic
            // 
            //          } else if ([[NSCharacterSet uppercaseLetterCharacterSet] characterIsMember:[self characterAtIndex:matchedRange.location]]) {
            //            for (j = matchedRange.location-1; j >= (int) searchRange.location; j--) {
            //              if ([[NSCharacterSet uppercaseLetterCharacterSet] characterIsMember:[self characterAtIndex:j]])
            //                score--;
            //              else
            //                score -= 0.15;
            //            }
          } else {
            score -= index
          }
        }
        
        score += remaining_score * next_string.length
        score /= base.length;
        return score
      }
    }
    return 0.0
  }
})(jQuery);