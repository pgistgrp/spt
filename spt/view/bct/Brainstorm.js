Ext.define('SPT.view.bct.Brainstorm' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.brainstorm',
    
    requires: ['Ext.form.Panel'],

initComponent: function() {
 	 var feedbackText = "";
	
	 this.items = [
            {
                xtype: 'form',
                padding: '5 5 0 5',
                border: false,
        		collapsible: true,
        		itemId: 'feedbackForm',
        		frame: true,
        		height:400,
    			width: 350,
        		bodyPadding: 5,
        		fieldDefaults: {
            	msgTarget: 'side',
            	labelWidth: 100
        		},
        		items: [{
            		fieldLabel: 'Please provide your comments and select keywords/phrases or add a custom keyword/phrase below',
            		name: 'feedbackTextArea',
					itemId: 'feedbackTextArea',
            		xtype: 'textareafield',
            		height:200,
    				width: 350,
            		grow: true,
            		allowBlank: false}],
				buttons: [{
            	text: 'Continue',
            	action: 'getkeywords'
            	}]	
       		}]
       		
       	this.buttons = [{text: 'Submit',
            	action: 'submit',
            	itemId: 'submit'
            	},
            	{text: 'Cancel',
            	action: 'cancel',
            	itemId:'cancel'
            	}]

 this.callParent(arguments);
}
});