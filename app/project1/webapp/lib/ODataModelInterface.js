sap.ui.define(["sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"cap/project1/model/utilities",
	"cap/project1/controller/errorHandling",
	"cap/project1/lib/ODATAService",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"

], function (Object, JSONModel, utilities, errorHandling, ODATAService, Filter, FilterOperator, MessageToast) {
	"use strict";

	return Object.extend("cap.project1.lib.ODataModelInterface", {
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
			this._iOpenCallsCount = 0;
			this._mRunningSwipes = {};
			this._bOneWaitingSuccess = false;
			this._bMessageOpen = false;

			//CREAT OBJECT FOR ODATA SERVICE
			//GET GLOBAL VARIABLE VALUES FROM BASE CONTROLLER/GLOBAL MODEL

			this._oODATAService = new ODATAService(this);
			this._oRfModel = new JSONModel();
		},
		ModelPopulate: function (oView) {
			var promise = jQuery.Deferred();
			//GET VIEW ENTITY SET NAME FROM CONFIQURATION JSON MODEL
			var sEntitySet = oView.getEntitySet();

			//CALL ODATA SERVICE
			var oWhenCallReadIsDone = this._oODATAService.oCallReadDeferred(sEntitySet, oView, "");

			//Handle response from oData Call
			oWhenCallReadIsDone.done(function (oResult, oFailed) {
				var oRfData;
				oRfData = oResult.results;
				oRfData = {
					aItems: oRfData
				};

				this.errorHandlingDelegate(oView, oRfData, true);

				promise.resolve(this._oRfModel);

			}.bind(this));
			return promise;

		},
		filterCountModelPopulate: function (oView, oFilterFields) {
			var promise = jQuery.Deferred();
			//GET VIEW ENTITY SET NAME FROM CONFIQURATION JSON MODEL
			var sEntitySet = oView.getEntitySet();
			var mFilterFields = oFilterFields;
			//GET FILTER FIELDS FROM CONFIGURATION JSON MODEL
			if (!mFilterFields) {
				mFilterFields = oView.getFilterFields();
			}
			//SETUP FILTER STRING
			var aFilterValues = this.setFilter(mFilterFields);
			//CALL ODATA SERVICE
			var oWhenCallReadIsDone = this._oODATAService.oCallReadCountDeferred(sEntitySet, oView, aFilterValues);

			//Handle response from oData Call
			oWhenCallReadIsDone.done(function (oResult, oFailed) {
				//var oRfData;
				//oRfData = oResult.results;

				promise.resolve(oResult);

			});
			return promise;

		},
		filterModelPopulate: function (oView, oFilterQuery) {
			var promise = jQuery.Deferred();
			//GET VIEW ENTITY SET NAME FROM CONFIQURATION JSON MODEL
			var sEntitySet = oView.getEntitySet();
			
			//CALL ODATA SERVICE
			var oWhenCallReadIsDone = this._oODATAService.oCallGetDeferred(sEntitySet, oView, oFilterQuery);

			//Handle response from oData Call
			oWhenCallReadIsDone.done(function (oResult, oFailed) {
				var oRfData;
				oRfData = oResult.value;
				oRfData = {
					aItems: oRfData
				};

				this.errorHandlingDelegate(oView, oRfData, true);

				promise.resolve(this._oRfModel);

			}.bind(this));
			return promise;

		},
		buildMessage: function (oView, oResult) {
			var oGlobalModel = oView.getModel("globalProperties");
			if (!oResult) {
				oGlobalModel.setProperty("/messageType", "S");
				var sMessage = oView.geti18n(oView.getUpdateToast());
				oGlobalModel.setProperty("/message", sMessage);
			} else {
				oGlobalModel.setProperty("/messageType", "E");
			}

		},

		setGlobalModel: function (oView, oRfData, setModelFlag, mModelName) {
			var oGlobalModel = oView.getModel("globalProperties");

			if (oRfData.aItems.length !== 0) {

				//SET MODEL TO CURRENT VIEW
				var sModelName = mModelName;
				if (sModelName.length !== 0 && setModelFlag === true) {
					this._oRfModel.setData(oRfData);
					//oView.setModelData(oRfData);
					sap.ui.getCore().setModel(this._oRfModel, sModelName);
					//oView.setModel(this._oRfModel, mModelName);
				}
			}
		},

		errorHandlingDelegate: function (oView, oRfData, setModelFlag) {
			var oGlobalModel = oView.getModel("globalProperties");

			////if (oRfData.aItems.length !== 0) {

			//SET MODEL TO CURRENT VIEW
			var sModelName = oView.getModelName();
			if (sModelName.length !== 0 && setModelFlag === true) {
				// this._oRfModel.setData(oRfData);
				// //oView.setModelData(oRfData);
				// oView.setModel(this._oRfModel, oView.getModelName());
				this._oRfModel = new JSONModel();
				this._oRfModel.setData(oRfData);
				oView.setModelData(oRfData);
				// console.log("error handling model name", oView.getModelName());
				// console.log("error handling model", oView.getModel());
				// console.log("oview in error hadling", oView);
				oView.setModel(this._oRfModel, oView.getModelName());
			}
			//Before call errorhandling delegates
			//Set Response Message and message Type to trigger message box
			if (oRfData.aItems[0]) {
				oGlobalModel.setProperty("/message", oRfData.aItems[0].Msgtext);
				oGlobalModel.setProperty("/messageType", oRfData.aItems[0].Msgtyp);
			}

			///	}
			/*else {
				//Set Response Message and message Type to trigger message box
				oGlobalModel.setProperty("/message", "Invalid Input");
				oGlobalModel.setProperty("/messageType", "E");

			}*/
			// delegate error handling
			errorHandling.register(oView.getApplication(), oView.getComponent());
		},

		// ************* Srini code to get selected items from table begins ************
		selectedItems: function (oView, controlId) {
			return oView.byId(controlId).getSelectedItems();
		}
		

	});
});
// ************* Srini code to get confirm items ends ************