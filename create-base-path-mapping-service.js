"use strict";

class CreateBasePathMappingService {
	constructor(serverless, options) {
		this.serverless = serverless;
		this.options = options;
		this._provider = this.serverless.providers.aws;
		this._config = this.serverless.service.custom.basePathMappingConfig;

		if (!this._config || !this._config.domainName || !this._config.basePath) {
			throw new this.serverless.classes.Error("Please provide 'basePathMappingConfig' with 'domainName' and 'basePath' in your serverless.yml");
		}

		this._config.stage = this._config.stage || this.options.stage;
	}

	createBasePathMapping() {
		return this._getMappingInfo(this._config.basePath, this._config.domainName)
			.then(mappingInfo => {
				if (!mappingInfo || !mappingInfo.restApiId) {
					this.serverless.cli.log(`Creating base path mapping ${this._config.basePath} for domain name ${this._config.domainName}`);
					return this._createBasePathMapping();
				}

				this.serverless.cli.log(`Base path mapping ${this._config.basePath} for domain name ${this._config.domainName} already exist. It will NOT be recreated.`);
				return true;
			});
	}

	deleteBasePathMapping() {
		return this._getMappingInfo(this._config.basePath, this._config.domainName)
			.then(mappingInfo => {
				if (!mappingInfo || !mappingInfo.restApiId) {
					this.serverless.cli.log(`Base path mapping ${this._config.basePath} for domain name ${this._config.domainName} already removed.`);
					return true;
				}

				this.serverless.cli.log(`Removing base path mapping ${this._config.basePath} for domain name ${this._config.domainName}`);
				return this._deleteBasePathMapping();
			});
	}

	_getMappingInfo(basePath, domainName) {
		return this._provider.request("APIGateway", "getBasePathMappings", { domainName })
			.then(mappings => {
				if (!mappings || !mappings.items || !mappings.items.length) {
					return null;
				}

				return mappings.items.find(m => m.basePath === basePath);
			});
	}

	_createBasePathMapping() {
		return this._getRestApiInfo()
			.then(apiInfo => {
				return this._provider.request("APIGateway", "createBasePathMapping", {
					basePath: this._config.basePath,
					domainName: this._config.domainName,
					restApiId: apiInfo.id,
					stage: this._config.stage
				});
			});

	}

	_deleteBasePathMapping() {
		return this._getRestApiInfo()
			.then(apiInfo => {
				return this._provider.request("APIGateway", "deleteBasePathMapping", {
					basePath: this._config.basePath,
					domainName: this._config.domainName
				});
			});

	}

	_getRestApiInfo() {
		return this._provider.request("APIGateway", "getRestApis", {
				limit: 500
			})
			.then(apis => {
				return apis.items.find(a => a.name === this._provider.naming.getApiGatewayName());
			});
	}
}

module.exports = CreateBasePathMappingService;
