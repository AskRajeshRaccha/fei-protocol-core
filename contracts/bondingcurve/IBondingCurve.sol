pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "../external/Decimal.sol";

interface IBondingCurve {

	// State changing Api

	/// @notice purchase FEI for underlying tokens
	/// @param amountIn amount of underlying tokens input
	/// @param to address to receive FEI
	/// @return amountOut amount of FEI received
	function purchase(uint256 amountIn, address to) external payable returns (uint256 amountOut);
	
	// Governor only state changing api

	/// @notice sets the bonding curve price buffer
	function setBuffer(uint256 _buffer) external;

	/// @notice sets the bonding curve Scale target
	function setScale(uint256 _scale) external;

	/// @notice sets the allocation of incoming PCV
	function setAllocation(address[] calldata pcvDeposits, uint256[] calldata ratios) external;

	// Getters

	/// @notice return current instantaneous bonding curve price 
	/// @return price reported as FEI per X with X being the underlying asset
	function getCurrentPrice() external view returns(Decimal.D256 memory);

	/// @notice return the average price of a transaction along bonding curve
	/// @param amountIn the amount of underlying used to purchase
	/// @return price reported as FEI per X with X being the underlying asset
	function getAveragePrice(uint256 amountIn) external view returns (Decimal.D256 memory);

	/// @notice return amount of FEI received after a bonding curve purchase
	/// @param amountIn the amount of underlying used to purchase
	/// @return amountOut the amount of FEI received
	function getAmountOut(uint256 amountIn) external view returns (uint256 amountOut); 

	/// @notice the Scale target at which bonding curve price fixes
	function scale() external view returns (uint256);

	/// @notice a boolean signalling whether Scale has been reached
	function atScale() external view returns (bool);

	/// @notice the buffer applied on top of the peg purchase price once at Scale
	function buffer() external view returns(uint256);

	/// @notice the total amount of FEI purchased on bonding curve. FEI_b from the whitepaper
	function totalPurchased() external view returns(uint256);

}

