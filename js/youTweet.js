var getCommentActionDivs = function () {

    var commentActionDivs = window.document.getElementsByClassName( "comment-actions" );
    return commentActionDivs;

}

var addTweetBirds = function ( commentActionDivs ) {
   
    for ( var i=0; i < commentActionDivs.length; i++ ) {
        var actionDiv = commentActionDivs[i];
        var childNodesBySpan = find( actionDiv, "span" );
        if ( childNodesBySpan.length > 2 ) {
            break;
        };
        var tweetTag = createActionChild();
        actionDiv.insertBefore( tweetTag, childNodesBySpan[0] );
    }

}

var createActionChild = function () {
    var tweetTag = document.createElement( "span" );
    var tweetButton = document.createElement( "button" );
    var tweetWrapper = document.createElement( "span" );
    var tweetImg = document.createElement( "img" );

    tweetTag.className = "yt-uix-button-group";
    tweetButton.className = "start end comment-action yt-uix-button yt-uix-button-default yt-uix-button-empty yt-uix-tooltip youtweet";
    tweetButton.setAttribute( "data-tooltip-show-delay", "300" );
    tweetButton.setAttribute( "role", "button" );
    tweetButton.setAttribute( "data-tooltip-text", "Tweet" );
    tweetWrapper.className = "yt-uix-button-icon-wrapper";
    tweetImg.className = "yt-uix-button-icon";
    tweetImg.setAttribute( "src", chrome.extension.getURL( "img/tweetBird_16.png" ) );
    tweetImg.setAttribute( "alt", "tweet" );

    tweetTag.appendChild( tweetButton );
    tweetButton.appendChild( tweetWrapper ); 
    tweetWrapper.appendChild( tweetImg );

    tweetButton.onclick = addYouTweetAction;

    return tweetTag;
}

var addYouTweetAction = function () {
    comment = getCommentContent();
    commentURL = getCommentURL();
    window.open("https://twitter.com/intent/tweet?url=" + commentURL +
        "&text=" + comment + "&via=youtube", "Twitter", "status = 1, height = 650, width = 1024, scrollbars = true");
}

var getCommentContent = function () {
    return "WHat up";
}

var getCommentURL = function () {
    return "http://khanhdao.com";
}

var bitlyXMLHttp = new XMLHttpRequest();
var bitlyApiKey = R_944dcbf509276cc94d300a404abd733f;
var bitlyLogin = o_46pb2m0kk6;
var bitLink = function ( commentURL ) {
    bitlyXMLHttp.open( "GET", "https://api-ssl.bitly.com/v3/shorten?apiKey=" + bitlyApiKey + "&login=" + bitlyLogin + 
                        "&longUrl=" + commentURL, true );
    bitlyXMLHttp.onreadystatechange = function () {
        if ( XMLHttp.readyState != 4 )  { return; }
        var result = JSON.parse( XMLHttp.reponseText );
    };
    bitlyXMLHttp.send( null );
    
}

// find descendants by tag
var find = function ( parentNode, tag ) {

    var childNodesByTag = new Array();
    var childNodes = parentNode.childNodes;
    for ( var i=0; i < childNodes.length; i++ ) {
        var childNodeTag = childNodes[i].tagName;
        if ( childNodeTag && childNodeTag.toLowerCase() == tag ) {
            childNodesByTag.push( childNodes[i] );
        }
    }
    return childNodesByTag;
}

setInterval( function () {
    var commentActionDivs = getCommentActionDivs();
    addTweetBirds( commentActionDivs );
}, 500 );

var commentActionDivs = getCommentActionDivs();
addTweetBirds( commentActionDivs );

