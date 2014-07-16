Ext.define('SPT.controller.SPTBrainstorm', {
    extend: 'Ext.app.Controller',
    
    stores: ['SPTKeywords', 'SPTKeywordSummary', 'SPTConcern', 'SPTConcerns', 'SPTConcernReplies', 'SPTConcernReply', 'SPTDelete', 'SPTVote', 'SPTCommentVote'],
    
    models: ['SPTKeywords', 'SPTConcerns', 'SPTConcernReplies'],
    
    views: ['bct.Brainstorm'],
        
    refs: [
           {ref: 'feedbackForm', selector: 'brainstorm #feedbackForm'},
           {ref: 'feedbackTextArea', selector: 'brainstorm #feedbackTextArea'},
           {ref: 'brainstormPanel', selector: 'brainstorm'}
        ],

    init: function() {
    	
    	this.getSPTKeywordSummaryStore().addListener('datachanged', this.selectKeyword, this);
    	
        this.control({
            
            'brainstorm button[action=getkeywords]': {
                click: this.getKeywords
            },
            
            'brainstorm button[action=addkeyword]': {
                click: this.addManualTag
            },
            
            'brainstorm button[action=submit]': {
                click: this.saveConcern
            },
            
            'brainstorm button[action=cancel]': {
                click: this.cancelConcern
            },
            
            'brainstorm #feedbackView': {
                beforeactivate: this.showConcerns
            },
            
//            'brainstorm #keywordSummaryView': {
//                beforeactivate: this.showDRT
//            }
        });
    },
    
    getKeywords: function(button) {
        
		var keywordStore = this.getSPTKeywordsStore();
		var feedbackForm = this.getFeedbackForm();
    	
    	if(feedbackForm.getForm().isValid()){
			
			var feedbackText = escape(this.getFeedbackTextArea().getValue());
			
			var originalUrl = keywordStore.getProxy().url; //workaround: temp variable for storing proxy url without param
			keywordStore.getProxy().url = keywordStore.getProxy().url + feedbackText;
			
			keywordStore.load({
	            callback: this.onKeywordLoad,           
	            scope: this
	        });
				
			button.hidden = true;
		};
			
		keywordStore.getProxy().url = originalUrl; //reset url to remove parameter
    },
    
    onKeywordLoad: function(records){
    	var checkboxconfigs = [];
    	for ( var i = 0; i < records.length; i++) {
			for(var j = 0; j < records[i].data.tags.length; j++){
				checkboxconfigs.push({
					name : records[i].data.tags[j],
					inputValue : records[i].data.tags[j],
					boxLabel : records[i].data.tags[j],
					xtype : 'checkbox'
				});
			}
		}
		
		this.createKeywordGUI(checkboxconfigs, false);
    },
    
    
    addManualTag: function(button) {
    	var feedbackForm = this.getFeedbackForm();
    	var manualTag = feedbackForm.getComponent('manualTag').getValue();
    	if(manualTag != ""){
    		newTag = this.getSPTKeywordsModel().create({tags: manualTag, potentialtags: '', successful: true});
    		this.getSPTKeywordsStore().add(newTag);
    		keywordGroup = feedbackForm.getComponent('keywordGroup');
        	keywordGroup.add({
        		name : manualTag,
				inputValue : manualTag,
				boxLabel : manualTag,
				xtype : 'checkbox',
				checked: true
			});
    	}
    	
    },
    
    createKeywordGUI: function(checkboxconfigs){
    	var feedbackForm = this.getFeedbackForm();
    	
    	var keywordGroup = Ext.create('Ext.form.CheckboxGroup',{
			itemId : 'keywordGroup',
			fieldLabel: 'Keywords/phrases',
			columns: 1,
			items : checkboxconfigs
		});

		var manualTag = Ext.create('Ext.form.field.Text',{
			itemId : 'manualTag'
		});
		
		var addManualButton = Ext.create('Ext.Button',{
			text : 'Add Keyphrase',
			action: 'addkeyword',
			itemId: 'manualBtn'
		});

		feedbackForm.add(keywordGroup);
		feedbackForm.add(manualTag);
		feedbackForm.add(addManualButton);
		
		var submitButton = Ext.create('Ext.Button',{
			text : 'Submit',
			action: 'submit',
			itemId: 'submitBtn'
		});
		var cancelButton = Ext.create('Ext.Button',{
			text : 'Cancel',
			action: 'cancel',
			itemId: 'cancelBtn'
		});
		
		feedbackForm.add(submitButton);
		feedbackForm.add(cancelButton);
    },
    
    
    getSelectWorkflowMsg: function(){
    	return Ext.Msg.show({
            title: 'SPT Help',
            msg: 'Please select a discussion topic',
            buttons: Ext.Msg.OK
        });	
    },
    
    saveConcern: function(button){
    	var feedbackForm = this.getFeedbackForm();
    	var keywordGroup = feedbackForm.getComponent('keywordGroup');
    	var selectedTags = keywordGroup.getChecked();
        
    	if(selectedTags.length <2){
    		  Ext.Msg.show({
                  title: 'SPT Help',
                  msg: 'Please select at least 2 keywords',
                  buttons: Ext.Msg.OK
              });
        }else{
        	var concernStore = this.getSPTConcernStore();
        	
        	//get keywords
        	var selectedTagsString = '';
        	for (i=0; i<selectedTags.length; i++){
        		selectedTagsString += selectedTags[i].getName()+ ',';  
        	}
        	//add filter to keywords if provided in request
        	var filter = this.getQueryParameter('filter');
        	if(filter != null){      
        		selectedTagsString += filter;
        	}
        	
        	var wfInfo = this.getController('SPTWorkflowInit').getCurrentWorkflowInfo();
        	if (wfInfo == null){
        		this.getSelectWorkflowMsg();
        	}else{
        		var originalUrl = concernStore.getProxy().url;
        		var encodedFeedback = escape(this.getFeedbackTextArea().getValue());
        		var concernId = feedbackForm.getComponent('concernId').getValue();
        		
        		//check to see if new feedback 
        		if(concernId == 'new'){
		        	concernStore.getProxy().url = concernStore.getProxy().url
		        		+ encodedFeedback
		        		+ '/'+ selectedTagsString 
		        		+ '/'+ wfInfo.getWorkflowId()
		        		+ '/'+ wfInfo.getContextId()
		        		+ '/'+ wfInfo.getActivityId(); 
		        	
		        	concernStore.load(function(records, operation, success) {
		        		console.log("concern saved");
		        	});
		        	
		        	concernStore.getProxy().url = originalUrl;
        		}else{//in edit mode
        			concernStore.getProxy().url = 'http://pgistdev.geog.washington.edu:8080/dwr/jsonp/BCTAgent/editConcern/'
        			+ concernId
        			+ '/'+ encodedFeedback
        			+ '/'+ selectedTagsString;
        			
        			concernStore.load(function(records, operation, success) {
		        		console.log("concern edited");
		        	});
        		}
	        	this.resetForm();
	        	this.getController('SPTWorkflowInit').getConcerns();
        	}	
        }
    },
    
    cancelConcern: function(button){
    	this.resetForm();
    },
    
    resetForm: function(){
    	var feedbackForm = this.getFeedbackForm();
    	
    	feedbackForm.getForm().reset();
    	
    	feedbackForm.remove('keywordGroup');
		feedbackForm.remove('manualTag');
		feedbackForm.remove('manualBtn');
		
		feedbackForm.remove('submitBtn');
		feedbackForm.remove('cancelBtn');
		var continueBtn = feedbackForm.queryById('continueBtn');
		continueBtn.setVisible(true);
    },
    
  
    showConcerns: function(grid){
    	var wfInfo = this.getController('SPTWorkflowInit').getCurrentWorkflowInfo();
    	
    	if (wfInfo == null){
    		this.getSelectWorkflowMsg();
    	}
    },
    
    getQueryParameter: function(parameter){
    	  var queryString = window.location.search.substring(1);
    	  var parameterName = 'filter' + "=";
    	  if ( queryString.length > 0 ) {
    	    begin = queryString.indexOf ( parameterName );
    	    if ( begin != -1 ) {
    	      begin += parameterName.length;
    	      end = queryString.indexOf ( "&" , begin );
    	        if ( end == -1 ) {
    	        	end = queryString.length
    	        }
    	      return unescape(queryString.substring(begin, end));
    	     }
    	  } else
    		  return null;
    },
    
    //DRT = Discuss and Review Tool
    showDRT: function (view){
    	var owner = view.ownerCt;
    	var viewport = owner.ownerCt;
    	viewport.child('#reviewPanel').show();
    },
    
    selectKeyword: function(){
    	var bp = this.getBrainstormPanel();
    	bp.down('#keywordSummaryGrid').getSelectionModel().select(0);
    }
    	  	
    	  	
});