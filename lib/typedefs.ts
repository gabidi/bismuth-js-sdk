export type IBlockNumber = number;
export type IDiffculty = String;
export type ITxn = string;
export type IAddress = string;
export type IPrivateKey = string;
export type IPublicKey = string;
export type INodesCount = number;
export type INodesList = string[]; // ips
export type IThreadsCount = number;
export type IUptime = number;
export type IPeersConsensus = number;
export type IPeersConsensusPct = number;
export type INodeVersion = string; // 4.2.8
export type IServerTimestamp = number;
export type IBalance = number;
export type ICredits = number;
export type IDebits = number;
export type IFees = number;
export type IRewards = number;
export type IBalanceNotInMemPool = number;
export type ITxnId = string;
export type ITxnAmount = number;
export type ITxnType = "token:transfer";
export type INetworkHashRate = number;
export type IDifficultyDropLevel = number;
export type IBlockGenerationTime = number;
export type IBlockPreviousDifficulty = IDiffculty;
export type IDifficultyAdjustment = IDiffculty;
export type IBlockAvgGenerationTime = number; // over 1440 blocks

export type IWebNodeDifficultyPayload = [
  IDiffculty,
  IDifficultyDropLevel,
  IBlockGenerationTime,
  IBlockPreviousDifficulty,
  IBlockAvgGenerationTime,
  INetworkHashRate,
  IDifficultyAdjustment,
  IBlockNumber
];
export type IWebNodeStatus = [
  IAddress,
  INodesCount,
  INodesList,
  IThreadsCount,
  IUptime,
  IPeersConsensus,
  IPeersConsensusPct,
  INodeVersion,
  IWebNodeDifficultyPayload,
  IServerTimestamp
];
export type IWebNodeBlockLast = [
  IBlockNumber,
  IServerTimestamp,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];
export type IWebNodeGetBalance = [
  IBalance,
  ICredits,
  IDebits,
  IFees,
  IRewards,
  IBalanceNotInMemPool
];

export type IWebNodeAddressTxn = [
  IBlockNumber,
  IServerTimestamp,
  IAddress,
  IAddress,
  number, // no idea.
  IPublicKey,
  IPublicKey,
  ITxnId,
  ITxnAmount,
  ITxnType,
  string // wtf is egg:50 ?
];
