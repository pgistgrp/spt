Ext.require([
    //'Ext.form.*',
    //'Ext.layout.container.Column',
    //'Ext.tab.Panel'
    '*'
]);

Ext.onReady(function() {
    Ext.QuickTips.init();

    var bd = Ext.getBody();
 
   Ext.define('Keywords', {
    extend: 'Ext.data.Model',
    fields:['tags', 'potentialtags', {name:'successful', type:'boolean'}]
	});
	
	var keywordStore = Ext.create('Ext.data.Store', {
	id: 'keywordStore',
    model: 'Keywords',
    proxy: {
        type: 'jsonp',
        url : 'http://localhost:8080/dwr/jsonp/BCTAgent/prepareConcern/documentation',
        reader: {
            type: 'json',
			root: 'reply'
        }
    }
	});
	
	var feedbackText = "";
	
    var feedbackFormPanel = Ext.create('Ext.form.Panel',{
        collapsible: true,
        id: 'feedbackFormPanel',
        frame: true,
        title: 'CyberGIS Feedback',
        bodyPadding: 5,
        width: 340,
		renderTo: Ext.getBody(),
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 100
        },
        items: [{
            fieldLabel: 'Feedback',
            name: 'feedbackTextArea',
			itemId: 'feedbackTextArea',
            xtype: 'textareafield',
            grow: true,
            allowBlank: false}],
		buttons: [{
            text: 'Continue',
            handler: function() {
				var form = this.up('form').getForm();
				if(form.isValid()){
					
					var feedbackText = form.findField('feedbackTextArea').getValue();
					keywordStore.getProxy().url = 'http://localhost:8080/dwr/jsonp/BCTAgent/prepareConcern/' + feedbackText;
					
					keywordStore.load(function(records, operation, success) {
					console.log(records);
					console.log(keywordStore.data.length);
					
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
            
					var keywordGroup = Ext.create('Ext.form.CheckboxGroup',{
					id : 'keywordGroup',
					fieldLabel: 'Keywords/phrases',
					columns: 1,
					items : checkboxconfigs,
					});
				
					feedbackFormPanel.add(keywordGroup);
				});
					
				}}}]
				
        });


    
    
     bd.createChild({tag: 'BR'});
    
    var customPhraseForm = Ext.widget({
        xtype: 'form',
        layout: 'form',
        title: 'Custom keywords/phrases',
        collapsible: true,
        id: 'customPhraseForm',
        url: 'save-form.php',
        frame: true,
        bodyPadding: '5 5 0',
        width: 340,
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 100
        },
        items: [{
            fieldLabel: 'Add keyword/phrase',
            name: 'custom',
            xtype: 'textfield'
        }],

        buttons: [{
            text: 'Add Keyphrase'
        }]
    });

    customPhraseForm.render(document.body);
	
});
