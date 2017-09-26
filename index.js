"use strict";

const CreateBasePathMappingService = require("./create-base-path-mapping-service");

class BasePathMappingPlugin {
	constructor(serverless, options) {
		this.serverless = serverless;
		this.options = options;

		this.hooks = {
			"after:deploy:deploy": this._afterDeploy.bind(this),
			"before:remove:remove": this._beforeRemove.bind(this)
		};
	}

	_afterDeploy() {
		const createBasePathMappingService = new CreateBasePathMappingService(this.serverless, this.options);
		return createBasePathMappingService.createBasePathMapping();
	}

	_beforeRemove() {
		const createBasePathMappingService = new CreateBasePathMappingService(this.serverless, this.options);
		return createBasePathMappingService.deleteBasePathMapping();
	}
}

module.exports = BasePathMappingPlugin;
