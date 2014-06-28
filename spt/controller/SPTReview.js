Ext.define('SPT.controller.SPTReview', {
    extend: 'Ext.app.Controller',
    
    stores: ['SPTReviewComment', 'SPTReviewComments', 'SPTReviewCommentVote'],
    
    models: ['SPTReviewComments'],
    
    views: ['drt.Review'],
        
    refs: [
           {ref: 'drtCommentForm', selector: 'review #drtCommentForm'},
           {ref: 'commentTextArea', selector: 'review #commentTextArea'},
           {ref: 'commentTitle', selector: 'review #commentTitle'},
           {ref: 'reviewPanel', selector: 'review'}
        ],

    init: function() {
        this.control({
            
            'review button[action=submit]': {
                click: this.saveComment
            },
            
            'review button[action=cancel]': {
                click: this.cancelComment
            },
            
            'review #commentView': {
                beforeactivate: this.getReviewComments
            }
        });
    },
    
    getSelectWorkflowMsg: function(){
    	return Ext.Msg.show({
            title: 'SPT Help',
            msg: 'Please select a discussion topic',
            buttons: Ext.Msg.OK
        });	
    },
    
    saveComment: function(button){
        	
        	var wfInfo = this.getController('SPTWorkflowInit').getCurrentWorkflowInfo();
        	if (wfInfo == null){
        		this.getSelectWorkflowMsg();
        	}else{
        		var commentStore = this.getSPTReviewCommentStore();
        		var originalUrl = commentStore.getProxy().url;
        		var encodedTitle = escape(this.getCommentTitle().getValue());
        		var encodedFeedback = escape(this.getCommentTextArea().getValue());
		        
        		commentStore.getProxy().url = commentStore.getProxy().url
        			+ '/'+ wfInfo.getWorkflowId()
        			+ '/'+ wfInfo.getContextId()
        			+ '/'+ wfInfo.getActivityId()
        			+ '/'+ encodedTitle
		        	+ '/'+ encodedFeedback; 
		        	
        		commentStore.load(function(records, operation, success) {
		        		console.log("review comment saved");
		        	});
		        	
        		commentStore.getProxy().url = originalUrl;
		        	
	        	this.resetForm();
	        	this.getReviewComments();
        	}	
    },
    
    cancelComment: function(button){
    	this.resetForm();
    },
    
    resetForm: function(){
    	var commentForm = this.getDrtCommentForm();
    	commentForm.getForm().reset();
    },
    
    getReviewComments: function(){
    	var wfInfo = this.getController('SPTWorkflowInit').getCurrentWorkflowInfo();
    	if (wfInfo == null){
    		this.getSelectWorkflowMsg();
    	}else{
    		var commentsStore = this.getSPTReviewCommentsStore();
    		
    		var originalUrl = commentsStore.getProxy().url;
    		
    		commentsStore.getProxy().url = commentsStore.getProxy().url
    			+ '/'+ wfInfo.getWorkflowId()
    			+ '/'+ wfInfo.getContextId()
    			+ '/'+ wfInfo.getActivityId();
        	
    		commentsStore.load(function(records, operation, success) {
        		console.log(records);
        	});
        	
    		commentsStore.getProxy().url = originalUrl;
    	}
    }
});