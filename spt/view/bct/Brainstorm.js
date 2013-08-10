Ext.define('SPT.view.bct.Brainstorm' ,{
    extend: 'Ext.tab.Panel',
    alias: 'widget.brainstorm',
    
    requires: ['Ext.form.Panel', 'Ext.grid.*', 'Ext.ux.grid.plugin.RowExpander'],
    

initComponent: function() {

	 this.items = [
            {
                title: 'Provide Feedback',
            	xtype: 'form',
                padding: '5 5 0 5',
                border: false,
        		collapsible: true,
        		itemId: 'feedbackForm',
        		frame: true,
        		height:275,
    			width: 350,
    			overflowY: 'auto',
        		bodyPadding: 5,
        		fieldDefaults: {
            	msgTarget: 'side',
            	labelWidth: 110
        		},
        		items: [{
            		fieldLabel: 'Please provide your comments and select at least 2 keywords/phrases or add custom keywords/phrases below',
            		name: 'feedbackTextArea',
					itemId: 'feedbackTextArea',
            		xtype: 'textareafield',
            		height:200,
    				width: 305,
            		grow: true,
            		allowBlank: false}],
				buttons: [{
            	text: 'Continue',
            	action: 'getkeywords',
            	itemId: 'continueBtn'
            	}]
       		},
       		{
       			title: 'View Feedback',
       			xtype: 'grid',
       			selType: 'cellmodel',
       			itemId: 'feedbackView',
       			store: Ext.data.StoreManager.lookup('SPTConcerns'),
       			height: 275,
       		    width: 350,
       		    columns: [
       		        { text: 'Contributor', flex:1, dataIndex: 'author'}, 
       		        { text: 'Date', colwidth: 5, dataIndex: 'createTime', xtype: 'datecolumn',   format:'m/d/y h:iA'},
       		        { text: 'Keywords', flex:2, dataIndex: 'id', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
       		        	var keywords = new Array();
       		        	var tagsStore = record.tags();
       		        	for ( var i = 0; i < tagsStore.getCount(); i++) {
       						var tag = tagsStore.getAt(i);
       		        		var keyword = tag.get('keyword');
       		        		keywords[i] = keyword;
       					}
       		        	return keywords.toString();
       		        }}
       		    ],
       		    plugins: [{
       	            ptype: 'dvp_rowexpander',
       	            pluginId: 'xpander',
       	            rowBodyTpl : new Ext.XTemplate(
       	             	'<p><b>Feedback:</b> {content}</p>')
       		    }]
       		}
       		]

 this.callParent(arguments);
}
});