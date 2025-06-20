import { User, Project, Bid } from '@prisma/client';
export declare const sendBidAcceptedEmail: (seller: User, buyer: User, project: Project, bid: Bid) => Promise<void>;
export declare const sendProjectCompletedEmail: (buyer: User, seller: User, project: Project) => Promise<void>;
//# sourceMappingURL=mailer.d.ts.map