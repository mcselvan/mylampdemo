/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "cap/project1/model/models",
        "cap/project1/controller/Application"
    ],
    function (UIComponent, Device, models, Application) {
        "use strict";

        return UIComponent.extend("cap.project1.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                //this.setModel(models.createDeviceModel(), "device");

            //*****My Code********************************
			//********************************************
			// call the base component's init function
			 var oApplication = new Application(this);
			 oApplication.init();
			//********************************************
			//My Code End
			//*********************************************
            }
        });
    }
);