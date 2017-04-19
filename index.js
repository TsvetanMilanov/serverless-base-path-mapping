"use strict";

const CreateBasePathMappingService = require("./create-base-path-mapping-service");

class BasePathMappingPlugin {
	constructor(serverless, options) {
		this.serverless = serverless;
		this.options = options;

		this.hooks = {
			"after:deploy:deploy": this._beforeDeploy.bind(this)
		};
	}

	_beforeDeploy() {
		const createBasePathMappingService = new CreateBasePathMappingService(this.serverless, this.options);
		return createBasePathMappingService.createBasePathMapping();
	}
}

module.exports = BasePathMappingPlugin;
