//upgrade from 4.1.1a to 4.1.1 seems to require this, otherwise getting an error!
Ext.Loader.setConfig({enabled:true});
Ext.Loader.setPath('Ext.ux', './extjs/src/ux/');

Ext.application({
	id: 'cg_pgist_app',
    name: 'SPT',
    appFolder: 'spt',
    appProperty: 'app',
    autoCreateViewport: false,
    
    controllers:[
    	'SPTLogin',
    	'SPTWorkflowInit',
    	'SPTBrainstorm',
    	//'SPTReview'
    ],
    
    
    launch: function() {
    	var defaultWorkflow = this.getDefaultWorkflow(); //check request for app parameter from Gateway
    	var workflowStore = this.getStore('SPTWorkflows');
    	var initController = this.getController('SPTWorkflowInit');
    	workflowStore.on({
	    	//afterload is a custom event, store.load doesn't allow combobox.store to be set
    		afterload: function(){initController.selectWorkflow(defaultWorkflow);}
    	});

    	Ext.create('Ext.container.Viewport', {
//    	Ext.create('Ext.window.Window', { //for CyberGIS
//            id: 'cg_pgist_win',
//            xtype: 'window',
//            title: 'Participatory Panel',
//            modal: true,
//            closeAction: 'hide',
//            y:100,
//            autoScroll: true,
            layout: 'vbox',
            items: [
               	{
                    region:'north',
                    xtype: 'workflow',
                    title: 'Discussion'
                    
                },
                {
                	region: 'south',
                	xtype:'brainstorm',
                	title:'Brainstorm'
                }
            ]
        });
    	
    	//need this to access Controllers from Views 
    	SPT[this.appProperty] = this;
    },
    
    getDefaultWorkflow: function(){
    	//try to get app context from request - 
    	var defaultWorkflow;
    	var appContext;
    	var queryString = window.location.search.substring(1);
    	var parameterName = 'app' + "=";
   	  	if ( queryString.length > 0 ) {
   	  		begin = queryString.indexOf ( parameterName );
   	  		if ( begin != -1 ) {
   	  			begin += parameterName.length;
   	  			end = queryString.indexOf ( "&" , begin );
   	  			if ( end == -1 ) {
   	  				end = queryString.length
   	  			}
   	  		appContext = unescape(queryString.substring(begin, end));
   	     }
   	  } else
   		  appContext = null;
   	  	
   	 if (appContext != null){
 		var mappingStore = this.getStore('SPTWorkflowMapping');
 		var wfIndex = mappingStore.find('key', appContext);
 		var mapping = mappingStore.getAt(wfIndex);
 		return defaultWorkflow = mapping.get('value');
 	} else
 		return defaultWorkflow = 'CyberGIS Gateway';
    	
    }
    
});
