sap.ui.define([
    "cap/project1/controller/BaseController"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController) {
        "use strict";

        return BaseController.extend("cap.project1.controller.View1", {
            onInit: function () {
                //this._router = this.getRouter();
                
            },
            onAfterRendering: function () {
                this.GetServerData("1");
            },
            GetServerData: function (sQus_ID) {
                var whenOdataCall = this.callOdataService().getQuestions(this, sQus_ID); // odata function call with input field to get response from backend
                whenOdataCall.done(function (oResult) {
                    var oModel = this.getModel("QuestionModel");
                    var questions = [];
                    questions = oModel.oData.aItems;
                    this.getGlobalModel().setProperty("/mainviewModel", this.getModel("QuestionModel"));
                    console.log("Question Model", this.getModel("QuestionModel"));
                    console.log("Quations", questions);
                }.bind(this));
            },
        });
    });
