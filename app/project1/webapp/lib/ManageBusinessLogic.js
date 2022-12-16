sap.ui.define(["sap/ui/core/mvc/Controller",
	"cap/project1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"cap/project1/model/utilities",
	"cap/project1/controller/errorHandling",
	"cap/project1/lib/ODataModelInterface",
	"sap/m/MessageToast"

], function (Controller, BaseController, JSONModel, MessageBox, utilities, errorHandling, ODataModelInterface, MessageToast) {
	"use strict";

	return BaseController.extend("cap.project1.lib.ManageBusinessLogic", {
		// This class provides the service of sending approve/reject requests to the backend. Moreover, it deals with concurrency handling and success dialogs.
		// For this purpose, a singleton instance is created and attached to the application controller as public property oApprover.
		// This is used by the instances of SubControllerForApproval and by the S2-controller (for swipe approve).
		// Note that approvals that are caused by SubControllerForApproval make the app busy while approvals done by swiping do not.
		// This cla"ss has the following properties:
		// - _oList"Selector: helper class to interact with the master list (fixed)
		// - iOpenCallsCount: number of running approve/reject calls. This attribute is needed because swipe approvals may cause parallel calls.
		// - _mRunni"ngSwipes: maps the IDs of those POs for which a swipe approve is still in process onto true
		// - _bOneWaitingSuccess: true, if at least one approve/reject operation was successfully performed since the last refresh of the master list 
		constructor: function (oApplication) {
			this._ODataModelInterface = new ODataModelInterface(this);

		},
		
		getQuestions: function (oView, sQus_ID) {
			var promise = jQuery.Deferred();
			var oFilterQry = "?$filter=ID eq "+sQus_ID;
			var oWhenOdataCall = this._ODataModelInterface.filterModelPopulate(oView, oFilterQry);
			oWhenOdataCall.done(function (oResult) {
				promise.resolve(oResult);
			}.bind(this));

			return promise;

		},
		

	});
});