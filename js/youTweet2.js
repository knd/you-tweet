var youTweet = {

    'config' : {

        /** List of div containers around comments */
        'containers' : $( 'li .comment' ),

        'commentTexts' : $( '.comment-text' ),

        /** Get the list of comment ids for tweets */
        'commentIds' : ( function () {
            var $commentList = $( '.comment' );
            var comments = $.makeArray( $commentList );
            var commentIds = [];
            for ( var i=0; i < comments.length; i++ ) {
                commentIds.push( comments[i].getAttribute( "data-id" ) );
            }
            return commentIds;
        } )(),

        /** List of div containers around action buttons */
        'actionContainers' : $( '.comment-actions' ),

        /** Tweet Icon to add next to comment actions buttons */
        'tweetBird' : chrome.extension.getURL( "img/tweetBird_16.png" ),

        /** 
         *  Template for tweet action button.
         *  @return {jQuery object}
         */
        'tweetIconTemplate': function( iconUrl ) {
            var template = '<span class="yt-uix-button-group">';
            template +=       '<button class="start end comment-action';
            template +=       ' yt-uix-button yt-uix-button-default';
            template +=       ' yt-uix-button-empty yt-uix-tooltip';
            template +=       ' youtweet" data-tooltip-show-delay="300"';
            template +=       ' role="button" data-tooltip-text="Tweet">';
            template +=           '<span class="yt-uix-button-icon-wrapper">';
            template +=               '<img class="yt-uix-button-icon" src="' + iconUrl + '" alt="tweet">';
            template +=           '</span>';
            template +=       '</button>';
            template +=     '</span>';
            return $(template);
        },

        /** Information to request bit link with jquery ajax call */
        'bitlyApiKey' : 'R_944dcbf509276cc94d300a404abd733f',

        'bitlyLogin' : 'o_46pb2m0kk6',

        'bitlyAddress' : 'https://api-ssl.bitly.com/v3/shorten',

        /**
         *  Function call back to extract bitly from return 
         *  data on success ajax call.
         */
        'bitlyGetShortUrl' : function( result ) {
            return result.data.url;
        },

        /** Information about window popup for tweet */
        'height' : '650',

        'width' : '1024',

        'scrollbars' : true


        
    },

    'init' : function( config ) {

        // custom configuration
        if ( config && typeof( config ) == 'object' ) {
            $.extend( youTweet.config, config );
        }
    },

    /**
     *  Function to add tweet icons into list of comments
     */
    'addTweetIcons' : function () {

    }

};

youTweet.init();
console.log( youTweet );

