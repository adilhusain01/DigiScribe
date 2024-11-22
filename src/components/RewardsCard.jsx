import { useDigiScribe } from '../contexts/DigiScribeContext';

const RewardsCard = () => {
  const { rewardPoints, claimRewards } = useDigiScribe();

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">Your Rewards</h3>
        <div className="mt-4">
          <p className="text-3xl font-bold text-indigo-600">{rewardPoints}</p>
          <p className="text-sm text-gray-500">Available Points</p>
        </div>
        <div className="mt-6">
          <button
            onClick={claimRewards}
            disabled={rewardPoints < 1000}
            className={`w-full px-4 py-2 rounded-md ${
              rewardPoints >= 1000
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
            }`}
          >
            Claim Rewards
          </button>
          <p className="mt-2 text-sm text-gray-500">
            Minimum 1000 points required to claim rewards
          </p>
        </div>
      </div>
    </div>
  );
};

export default RewardsCard