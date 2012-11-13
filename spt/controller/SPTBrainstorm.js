Ext.define('SPT.controller.SPTBrainstorm', {
    extend: 'Ext.app.Controller',
    
    stores: ['SPTKeywords', 'SPTConcerns', 'SPTWorkflows'],
    
    models: ['SPTKeyword', 'SPTConcern'],
    
    views: ['bct.Brainstorm'],
        
    refs: [
           {ref: 'brainstormView', selector: 'brainstorm'},
           {ref: 'feedbackForm', selector: 'brainstorm #feedbackForm'},
           {ref: 'feedbackTextArea', selector: 'brainstorm #feedbackTextArea'}
        ],

    init: function() {
        this.control({
            'viewport > panel': {
            	 renderTo: Ext.getBody()
            },
            
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
            }
        });
    },
    
    getKeywords: function(button) {
        
		var keywordStore = this.getSPTKeywordsStore();
		var feedbackForm = this.getFeedbackForm();
    	
    	if(feedbackForm.getForm().isValid()){
			
			var feedbackText = this.getFeedbackTextArea().getValue();
			
			keywordStore.getProxy().url = 'http://localhost:8080/dwr/jsonp/BCTAgent/prepareConcern/' + feedbackText;
			
			keywordStore.load(function(records, operation, success) {
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
				
				button.hidden = true;
        
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
				
			});
    	}
    },
    
    addManualTag: function(button) {
    	var feedbackForm = this.getFeedbackForm();
    	var manualTag = feedbackForm.getComponent('manualTag').getValue();
    	if(manualTag != ""){
    		newTag = this.getSPTKeywordModel().create({tags: manualTag, potentialtags: '', successful: true});
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
    
    saveConcern: function(button){
    	var feedbackForm = this.getFeedbackForm();
    	var keywordGroup = feedbackForm.getComponent('keywordGroup');
    	var selectedTags = keywordGroup.getChecked();
        
    	if(selectedTags.length <2){
    		alert('Please select at least 2 keywords');
        }else{
        	var concernStore = this.getSPTConcernsStore();
        	//var workflow = this.getSPTWorkflowsStore().getAt(0);
        	
        	var selectedTagsString = '';
        	for (i=0; i<selectedTags.length; i++){
        		selectedTagsString += selectedTags[i].getName()+ ',';  
        	}
        	
        	concernStore.getProxy().url = 'http://localhost:8080/dwr/jsonp/BCTAgent/saveConcern/' 
        		+ this.getFeedbackTextArea().getValue() 
        		+ '/'+ selectedTagsString 
        		+ '/'+ '3039'
        		;  
        	
        	concernStore.load(function(records, operation, success) {
        		console.log(records.length);
        		//in the future save to concern store 
        	});
        	
        	this.resetForm();
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
    }
});