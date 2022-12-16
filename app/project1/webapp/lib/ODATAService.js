sap.ui.define(["sap/ui/base/Object",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel"

], function (Object, Device, JSONModel) {
	"use strict";

	return Object.extend("cap.project1.lib.ManageBusinessLogic", {
		// This class provides the service of sending approve/reject requests to the backend. Moreover, it deals with concurrency handling and success dialogs.
		// For this purpose, a singleton instance is created and attached to the application controller as public property oApprover.
		// This is used by the instances of SubControllerForApproval and by the S2-controller (for swipe approve).
		// Note that approvals that are caused by SubControllerForApproval make the app busy while approvals done by swiping do not.
		constructor: function (oApplication) {
	
		},
		
		//The Deferred object, introduced in jQuery 1.5, 
		//is a chainable utility object created by calling the jQuery.Deferred() method.
		oCallGetDeferred: function (sEntityName, oComponent, oFilterQuery) {
			var promise = jQuery.Deferred(),
			oDataModel = oComponent.getModel();
			sap.ui.core.BusyIndicator.show(0);
			
			$.get({
                url: `${sEntityName}`+`${oFilterQuery}` ,
                success: function(data) {
                    sap.ui.core.BusyIndicator.hide();
					promise.resolve(data);
                },
                error: function(error) {
                    sap.ui.core.BusyIndicator.hide();
					promise.reject(error);
				}.bind(this)
            });
	
			return promise;
		}
		
	});
});