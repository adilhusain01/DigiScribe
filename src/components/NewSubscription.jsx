import { useState } from 'react';
import { useDigiScribe } from '../contexts/DigiScribeContext';

const NewSubscription = () => {
  const { createSubscription } = useDigiScribe();
  const [formData, setFormData] = useState({
    serviceName: '',
    amount: '',
    frequency: '2592000', // 30 days in seconds
    paymentToken: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createSubscription(
      formData.serviceName,
      formData.amount,
      formData.frequency,
      formData.paymentToken
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Service Name
          </label>
          <input
            type="text"
            value={formData.serviceName}
            onChange={(e) =>
              setFormData({ ...formData, serviceName: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount (ETH)
          </label>
          <input
            type="number"
            step="0.000001"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Token Address
          </label>
          <input
            type="text"
            value={formData.paymentToken}
            onChange={(e) =>
              setFormData({ ...formData, paymentToken: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Frequency
          </label>
          <select
            value={formData.frequency}
            onChange={(e) =>
              setFormData({ ...formData, frequency: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="2592000">Monthly (30 days)</option>
            <option value="7776000">Quarterly (90 days)</option>
            <option value="31536000">Yearly (365 days)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create Subscription
        </button>
      </form>
    </div>
  );
};

export default NewSubscription