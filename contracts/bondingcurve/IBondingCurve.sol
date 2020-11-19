pragma solidity ^0.6.0;

interface IBondingCurve {

	function purchase(uint256 amountIn, address to) external payable returns (uint256 amountOut);

	function getAmountOut(uint256 amountIn) external view returns (uint256 amountOut); 

	function scale() external view returns (uint256 _scale);

	function setScale(uint256 _scale) external;

}

