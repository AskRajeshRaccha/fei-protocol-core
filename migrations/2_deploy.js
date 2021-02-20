const CoreOrchestrator = artifacts.require("CoreOrchestrator");
const BondingCurveOrchestrator = artifacts.require("BondingCurveOrchestrator");
const IncentiveOrchestrator = artifacts.require("IncentiveOrchestrator");
const ControllerOrchestrator = artifacts.require("ControllerOrchestrator");
const IDOOrchestrator = artifacts.require("IDOOrchestrator");
const GenesisOrchestrator = artifacts.require("GenesisOrchestrator");
const GovernanceOrchestrator = artifacts.require("GovernanceOrchestrator");
const PCVDepositOrchestrator = artifacts.require("PCVDepositOrchestrator");
const RouterOrchestrator = artifacts.require("RouterOrchestrator");
const StakingOrchestrator = artifacts.require("StakingOrchestrator");
const PairOrchestrator = artifacts.require("PairOrchestrator");


module.exports = function(deployer, network, accounts) {
  	var pcvo, bc, incentive, controller, ido, genesis, gov, core, routerOrchestrator, stakingOrchestrator, pairOrchestrator;

	deployer.then(function() {
	  	return deployer.deploy(ControllerOrchestrator);
	}).then(function(instance) {
		controller = instance;
	  	return deployer.deploy(BondingCurveOrchestrator);
	}).then(function(instance) {
	  	bc = instance;
	  	return deployer.deploy(GenesisOrchestrator);
	}).then(function(instance) {
		genesis = instance
	  	return deployer.deploy(GovernanceOrchestrator);
	}).then(function(instance) {
	  	gov = instance;
	  	return deployer.deploy(IDOOrchestrator);
	}).then(function(instance) {
		ido = instance;
	 	return deployer.deploy(IncentiveOrchestrator);
	}).then(function(instance) {
		incentive = instance;
	 	return deployer.deploy(RouterOrchestrator);
	}).then(function(instance) {
		routerOrchestrator = instance;
	 	return deployer.deploy(PCVDepositOrchestrator);
	}).then(function(instance) {
		pcvo = instance;
	 	return deployer.deploy(PairOrchestrator);
	}).then(function(instance) {
		pairOrchestrator = instance;
	 	return deployer.deploy(StakingOrchestrator);
	}).then(function(instance) {
		stakingOrchestrator = instance;
	 	return deployer.deploy(CoreOrchestrator,
	 		pcvo.address, 
	 		bc.address, 
	 		incentive.address, 
	 		controller.address, 
	 		ido.address, 
	 		genesis.address, 
	 		gov.address,
			routerOrchestrator.address,
			stakingOrchestrator.address, 
			pairOrchestrator.address,
	 		accounts[0],
	 		{gas: 8000000}
	 	);
	}).then(function(instance) {
		core = instance;
	 	return bc.transferOwnership(core.address);
	}).then(function(instance) {
	 	return incentive.transferOwnership(core.address);
	}).then(function(instance) {
	 	return ido.transferOwnership(core.address);
	}).then(function(instance) {
	 	return genesis.transferOwnership(core.address);
	}).then(function(instance) {
	 	return gov.transferOwnership(core.address);
	}).then(function(instance) {
	 	return controller.transferOwnership(core.address);
	}).then(function(instance) {
	 	return pcvo.transferOwnership(core.address);
	}).then(function(instance) {
	 	return routerOrchestrator.transferOwnership(core.address);
	}).then(function(instance) {
		return stakingOrchestrator.transferOwnership(core.address);
	}).then(function(instance) {
		return pairOrchestrator.transferOwnership(core.address);
	}).then(function(instance) {
	 	return core.initCore();
	}).then(function(instance) {
	 	return core.initPairs();
	}).then(function(instance) {
	 	return core.initPCVDeposit();
	}).then(function(instance) {
	 	return core.initBondingCurve();
	}).then(function(instance) {
	 	return core.initIncentive();
	}).then(function(instance) {
	 	return core.initController();
	}).then(function(instance) {
		 return core.initIDO();
	}).then(function(instance) {
		return core.initStaking();
    }).then(function(instance) {
	 	return core.initGovernance();
	}).then(function(instance) {
	 	return core.initRouter();
	}).then(function(instance) {
		return core.initGenesis();
   });
}