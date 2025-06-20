import { Bid } from '@/types';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

interface BidCardProps {
  bid: Bid;
  onAccept?: (bidId: string) => void;
  showAcceptButton?: boolean;
  className?: string;
}

export default function BidCard({ 
  bid, 
  onAccept, 
  showAcceptButton = false, 
  className = '' 
}: BidCardProps) {
  return (
    <div className={`card-neu ${bid.accepted ? 'ring-2 ring-green-400' : ''} ${className}`}>
      {bid.accepted && (
        <div className="mb-3">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            ✓ Accepted
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-slate-800">{bid.seller.name}</h4>
          <p className="text-sm text-neu-gray">{bid.seller.email}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary-500">{formatCurrency(bid.amount)}</p>
          <p className="text-sm text-neu-gray">{bid.etaDays} days</p>
        </div>
      </div>
      
      <p className="text-body mb-4">{bid.message}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-neu-gray">
          {formatRelativeTime(bid.createdAt)}
        </span>
        
        {showAcceptButton && !bid.accepted && onAccept && (
          <button
            onClick={() => onAccept(bid.id)}
            className="btn-primary text-sm"
          >
            Accept Bid
          </button>
        )}
      </div>
    </div>
  );
} 