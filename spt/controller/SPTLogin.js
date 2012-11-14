Ext.define('SPT.controller.SPTLogin', {
    extend: 'Ext.app.Controller',

    init: function() {
    	 Ext.define('LoginUser', {
    		 extend: 'Ext.data.Model',
    		 fields:[{name:'successful', type:'boolean'},{name:'error', type:'String'}]
    	 });
    			
    	 var username = 'roderimj';
    	 var token = 'cybergis_token_SngrQdcC6nlpTwDB'
    		    
    	 var loginStore = Ext.create('Ext.data.Store', {
    		 id: 'loginStore',
    		 model: 'LoginUser',
    		 proxy: {
    		    type: 'jsonp',
    		    url : 'http://http://pgistdev.geog.washington.edu:8080/dwr/jsonp/SystemAgent/loadUserByName/',
    		    reader: {
    		       type: 'json',
    		       root: 'reply'
    		    }
    		  }
    	 });
    			
    	loginStore.getProxy().url = 'http://pgistdev.geog.washington.edu:8080/dwr/jsonp/SystemAgent/loadUserByName/' + username +'/' + token + '/'+ 'cybergis';
    	loginStore.load(function(records, operation, success) {
			console.log(records);
		});
}

});