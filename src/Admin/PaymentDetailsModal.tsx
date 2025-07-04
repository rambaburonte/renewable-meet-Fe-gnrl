import React from 'react';

interface PaymentDetailsModalProps {
  payment: any;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({ payment, isOpen, onClose }) => {
  if (!isOpen || !payment) return null;

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-400 bg-green-400/20';
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/20';
      case 'FAILED': return 'text-red-400 bg-red-400/20';
      case 'CANCELLED': return 'text-gray-400 bg-gray-400/20';
      case 'EXPIRED': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-green-600 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-green-400">
            💳 Payment Details #{payment.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Payment Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#2a2a2a] rounded-lg p-4">
              <h3 className="text-green-300 font-semibold mb-2">Payment Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                {payment.status}
              </span>
            </div>
            <div className="bg-[#2a2a2a] rounded-lg p-4">
              <h3 className="text-green-300 font-semibold mb-2">Stripe Status</h3>
              <span className="text-white">{payment.paymentStatus}</span>
            </div>
            <div className="bg-[#2a2a2a] rounded-lg p-4">
              <h3 className="text-green-300 font-semibold mb-2">Amount</h3>
              <span className="text-white text-lg font-bold">
                {formatCurrency(payment.amountTotalEuros, payment.currency)}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <h3 className="text-green-300 font-semibold mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Email</label>
                <p className="text-white">{payment.customerEmail}</p>
              </div>
              {payment.customerName && (
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Name</label>
                  <p className="text-white">{payment.customerName}</p>
                </div>
              )}
              {payment.customerInstitute && (
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Institute</label>
                  <p className="text-white">{payment.customerInstitute}</p>
                </div>
              )}
              {payment.customerCountry && (
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Country</label>
                  <p className="text-white">{payment.customerCountry}</p>
                </div>
              )}
              {payment.registrationType && (
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Registration Type</label>
                  <p className="text-white">{payment.registrationType}</p>
                </div>
              )}
              {payment.presentationType && (
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Presentation Type</label>
                  <p className="text-white">{payment.presentationType}</p>
                </div>
              )}
            </div>
          </div>

          {/* Stripe Information */}
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <h3 className="text-green-300 font-semibold mb-4">Stripe Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Session ID</label>
                <div className="flex items-center">
                  <p className="text-white font-mono text-sm break-all">{payment.sessionId}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(payment.sessionId);
                      alert('Session ID copied to clipboard');
                    }}
                    className="ml-2 text-green-400 hover:text-green-300"
                    title="Copy Session ID"
                  >
                    📋
                  </button>
                </div>
              </div>
              {payment.paymentIntentId && (
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Payment Intent ID</label>
                  <div className="flex items-center">
                    <p className="text-white font-mono text-sm break-all">{payment.paymentIntentId}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(payment.paymentIntentId);
                        alert('Payment Intent ID copied to clipboard');
                      }}
                      className="ml-2 text-blue-400 hover:text-blue-300"
                      title="Copy Payment Intent ID"
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}
              {payment.url && (
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Payment URL</label>
                  <div className="flex items-center">
                    <a 
                      href={payment.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm break-all"
                    >
                      {payment.url}
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(payment.url);
                        alert('Payment URL copied to clipboard');
                      }}
                      className="ml-2 text-blue-400 hover:text-blue-300"
                      title="Copy Payment URL"
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}
              {payment.productName && (
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Product Name</label>
                  <p className="text-white">{payment.productName}</p>
                </div>
              )}
              {payment.description && (
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-1">Description</label>
                  <p className="text-white">{payment.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <h3 className="text-green-300 font-semibold mb-4">Pricing Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {payment.pricingConfigId && (
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Pricing Config ID</label>
                  <p className="text-white">#{payment.pricingConfigId}</p>
                </div>
              )}
              {payment.pricingConfigTotalPrice && (
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Config Total Price</label>
                  <p className="text-white">
                    {formatCurrency(payment.pricingConfigTotalPrice, payment.currency)}
                  </p>
                </div>
              )}
              {payment.presentationPrice && (
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Presentation Price</label>
                  <p className="text-white">
                    {formatCurrency(payment.presentationPrice, payment.currency)}
                  </p>
                </div>
              )}
              {payment.processingFeePercent && (
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Processing Fee %</label>
                  <p className="text-white">{payment.processingFeePercent}%</p>
                </div>
              )}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Amount in Cents</label>
                <p className="text-white">{payment.amountTotalCents} cents</p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Currency</label>
                <p className="text-white">{payment.currency.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <h3 className="text-green-300 font-semibold mb-4">Timestamps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Created At (System)</label>
                <p className="text-white">{formatDate(payment.createdAt)}</p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Updated At</label>
                <p className="text-white">{formatDate(payment.updatedAt)}</p>
              </div>
              {payment.stripeCreatedAt && (
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Stripe Created At</label>
                  <p className="text-white">{formatDate(payment.stripeCreatedAt)}</p>
                </div>
              )}
              {payment.stripeExpiresAt && (
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Stripe Expires At</label>
                  <p className="text-white">{formatDate(payment.stripeExpiresAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Raw Data (for debugging) */}
          <details className="bg-[#2a2a2a] rounded-lg p-4">
            <summary className="text-green-300 font-semibold cursor-pointer">
              🛠️ Raw Payment Data (Debug)
            </summary>
            <pre className="mt-4 text-xs text-gray-300 overflow-x-auto">
              {JSON.stringify(payment, null, 2)}
            </pre>
          </details>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
