Ext.define('SPT.controller.SPTWorkflowInit', {
    extend: 'Ext.app.Controller',

    stores: ['SPTWorkflows'],
    
    views: [
            'workflow.Workflow'
        ],

    init: function() {
        this.control({
            'viewport > panel': {
            	 renderTo: Ext.getBody()
            }
        });
    }
});