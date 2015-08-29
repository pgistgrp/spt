//Application is the parent container for the other views and replaces app.js

Ext.define('SPT.view.Application', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.application',
	autoHeight: true,
	itemId: 'applicationPanel',
	minHeight: 600,
	requires: [
	'Ext.util.Cookies',
	'Ext.window.Window',
	'SPT.view.workflow.Workflow',
	'SPT.view.bct.Brainstorm', 
	'SPT.store.SPTUser'
	],
	
initComponent: function () { 
	
	var loginStore = Ext.create('SPT.store.SPTUser');
	loginStore.addListener('load',this.openApp, this);
	
	this.login(loginStore);

},

login: function(loginStore) {
	
	 var username; 
	 var token = null;
	 
	 //Check to see if CSFUser
	 var cookie = Ext.util.Cookies.get('csfuser');
	 if (cookie != null){
		username = cookie;
	 	loginStore.getProxy().url =  loginStore.getProxy().url + username +'/' + token + '/'+ 'csf';
	 }else{
		//username = CG.global.Env.authuser;
	    //token = CG.global.Env.token;
		//apihost = window.location.host;
		username = 'roderimj';
   	token = 'cybergis_token_Aqxd696aFH3ZcX1l';
   	apihost = encodeURIComponent('sandbox.cigi.illinois.edu:443');
   	loginStore.getProxy().url =  loginStore.getProxy().url + username +'/' + token + '/'+ apihost + '/' + 'cybergis';
	 }
			
	loginStore.load(function(records, operation, success) {
		console.log('load user');
		var record = loginStore.getAt(0);
		if(! record.get('successful')){
			  Ext.Msg.show({
                 title: 'Login failed',
                 msg: record.get('error'),
                 buttons: Ext.Msg.OK
             });	
		}else{
			record.set('username', username);
		};
	});
},

openApp: function(){
	//need to pass appPanel to children bc the child views treat the window and not appPanel as parent
	//tried all other variations from child with no luck: ownerCt traversal, up, getCmp, getComponent, findParentByType
	var me = this; 
	
	var win = Ext.create('Ext.window.Window', {
		id: 'cg_pgist_win',
		xtype: 'window',
		title: 'Participatory Panel',
		modal: true,
		closeAction: 'hide',
		y:100,
		autoScroll: true,
		layout: 'vbox',
		items: [
         {
              region:'north',
              xtype: 'workflow',
              title: 'Discussion',
              parent: me
              
          },
          {
          	region: 'south',
          	xtype:'brainstorm',
          	title:'Brainstorm',
          	parent: me
          } 
      ]
  });
	
	    win.show();
	
},

getCurrentWorkflowInfo: function(){
	//get current workflow
	var workflowStore = Ext.data.StoreManager.lookup('workflowStore');
	var workflowRecord = workflowStore.getAt(0);
	var openWorkflowsStore = workflowRecord.openWorkflows();
	var index = openWorkflowsStore.find('selected', true);
	
	if(index == -1)
		return null;
	
	var currentWorkflow = openWorkflowsStore.getAt(index);
	var wfId = currentWorkflow.get('id');
	
	//get BCT contextid and activityid, TODO: fix assumption that brainstorm is only method
	var activeWorkflowStore = Ext.data.StoreManager.lookup('activeWorkflowStore');
	
	var bctIndex = activeWorkflowStore.find('workflowId', wfId);
	var brainstormMethod = activeWorkflowStore.getAt(bctIndex);
	var cxtId = brainstormMethod.get('contextId');
	var brainstormGamesStore = brainstormMethod.pgameActivityList();
	var actId = brainstormGamesStore.getAt(0).get('activityId');
	
	Ext.define('WorkflowInfo', {
	     config: {
	         workflowId: wfId,
	         contextId: cxtId,
	         activityId: actId,
	     },
	     constructor: function(cfg) {
	         this.initConfig(cfg);
	     }
	}); 

	return new WorkflowInfo();
}


});