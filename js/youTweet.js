var youTweet = {

    'config' : {

        /** Tweet Via Object */
        'tweetVia' : 'youtube',

        /** Tweet Icon to add next to comment actions buttons */
        'tweetBird' : chrome.extension.getURL( "img/tweetBird_16.png" ),

        /** Tweeet link call */
        'tweetAddress' : 'https://twitter.com/share?',

        /** Return tweet link */
        'getTweetLink' : function( params ) {
            return youTweet.config.tweetAddress + 'url=' + params.url + 
                    '&text=' + params.comment + '&via=' + params.via;
        },

        /** Return comment url */
        'getCommentUrl' : function( id ) {
            return 'http://www.youtube.com/comment?lc=' + id;
        },

        /** 
         *  Template for tweet action button.
         *  @return {jQuery object}
         */
        'tweetIconTemplate': function( iconUrl ) {
            var template = '<span class="yt-uix-button-group youtweet">';
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

        'scrollbars' : true,

        'getTweetWindowConfig' : function () {
            return 'height = ' + youTweet.config.height +
                   ' width = ' + youTweet.config.width +
                   ' scrollbars = ' + youTweet.config.scrollbars;
        }
        
    },

    'init' : function( config ) {

        // custom configuration
        if ( config && typeof( config ) == 'object' ) {
            $.extend( youTweet.config, config );
        }

        // turn all list into JavaScript arrays
        var commentList = youTweet.getCommentTexts();
        var commentIdList = youTweet.getCommentIds();
        var commentActionDivs = youTweet.getActionContainers();
        
        //console.log( commentList );
        //console.log( commentIdList.length );
        //console.log( commentActionDivs.length ); 

        if ( commentList.length != commentIdList.length
            || commentIdList.length != commentActionDivs.length
            || commentList.length != commentActionDivs.length ) {
            return;
        } else {
            youTweet.commentsLength = commentList.length;
        }

        /* Debug */ 
        //console.log( youTweet.commentsLength );
        //console.log( commentList );
        //console.log( commentIdList );
        //console.log( commentActionDivs ); 

        // bind data in the form { ... , 'id1': { 'content': 'abc', 'actionDiv' : '<div>abc</div>' }  , ... }
        youTweet.data = youTweet.combineData( commentIdList, commentList, commentActionDivs );
        
        // process data
        if ( youTweet.data ) {
            youTweet.addTweetIcons( youTweet.data, youTweet.generateActionFunc );
        }

    },

    /**
     *
     */
    'generateActionFunc' : function ( params ) {
        return function () {
            var link = youTweet.config.getTweetLink( params );
            window.open( link, "Twitter", youTweet.config.getTweetWindowConfig() );
        }
    },

    /**
     *  Function to add tweet icons into list of comments
     */
    'addTweetIcons' : function ( data, callback ) {
        $.each( data, function( id, value ) {
            var content = value.content;
            var actionDiv = value.actionDiv;
            
            var childNodesBySpan = $(actionDiv).children( 'span' );
            childNodesBySpan = $.makeArray( childNodesBySpan );
            if ( childNodesBySpan.length > 2 ) {
                return false;
            }
            var tweetIcon = youTweet.config.tweetIconTemplate( youTweet.config.tweetBird );
            var commentUrl = youTweet.config.getCommentUrl( id );
            commentUrl = youTweet.requestBitlyUrl( commentUrl );
            $(tweetIcon).children('button:first-child')
                        .bind( 'click', callback( { 
                                          'url' : commentUrl, 
                                          'comment' : value.content, 
                                          'via' : youTweet.config.tweetVia } ) );
            var reference = childNodesBySpan[0];
            actionDiv.insertBefore( tweetIcon[0], reference );
        });
        
    },

    /**
     *  Return the list of comment contents.
     *  @return {Array JavaScript} list of string texts
     */
    'getCommentTexts' : function () {
        var $commentTexts = $( '.comment-body .content' );
        var comments = $.makeArray( $commentTexts );
        var commentContents = [];
        for ( var i=0; i < comments.length; i++ ) {
            commentContents.push( comments[i].innerText );
        }
        return commentContents;
    },

    /**
     *  Return the list of comment ids.
     *  @return {Array JavaScript} list of string ids
     */
    'getCommentIds' : function () {
        var $commentList = $( '.comment' );
        var comments = $.makeArray( $commentList );
        var commentIds = [];
        for ( var i=0; i < comments.length; i++ ) {
            commentIds.push( comments[i].getAttribute( "data-id" ) );
        }
        return commentIds;
    },

    /**
     *  Return the list of action containers/div
     *  @return {Array JavaScript} list of divs
     */
    'getActionContainers' : function () {
        return $.makeArray( $( '.comment-actions' ) );
    },

    /**
     *  Return a master unordered combined data source
     *  @return {Object JavaScript} associative array containing
     *          list of  '49fdfa0' : { 'content' : '...', 'actionDiv' : '...' }
     */
    'combineData' : function ( ids, contents, divs ) {
        var combinedData = {};
        if ( !youTweet.commentsLength ) return combinedData;
        for ( var i=0; i < youTweet.commentsLength; i++ ) {
            combinedData[ ids[i] ] = { 'content' : contents[i],
                                       'actionDiv' : divs[i] };
        }
        return combinedData;
    },

    /**
     *  Return a bit link of a given URL.
     *  @return {String} shortened URL of youtube comment link.
     */
    'requestBitlyUrl' : function ( longUrl ) {
        var shortUrl = '';
        $.ajax( {
            async: false,
            url: youTweet.config.bitlyAddress,
            data: { 'apiKey' : youTweet.config.bitlyApiKey,
                    'login' : youTweet.config.bitlyLogin,
                    'longUrl' : longUrl },
            type: 'GET',
            success: function ( result ) {
                shortUrl = youTweet.config.bitlyGetShortUrl( result );
            },
            error: function () {
                shortUrl = longUrl;
            }
        });
        return shortUrl;
    }


    

};

setInterval( function() { 
  youTweet.init(); 
} , 1000 );

