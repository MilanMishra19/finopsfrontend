import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

interface AccountDetails {
  accountId: string;
  accountNumber: string;
  name: string;
  dob: string;
  city: string;
  kycStatus: string;
  riskScore: number;
  totalTxns: number;
  fraudTxns: number;
}

interface Transaction {
  txnId: string;
  timeStamp: string;
  amount: number;
  location: string;
  deviceId: string;
  method: string;
  isFraud: string;
  isFlagged: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    const contentType = res.headers.get('content-type');
    if (contentType?.includes('text/html')) {
      throw new Error('HTML returned instead of JSON. Backend may be redirecting.');
    }
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch: ${url}`);
  }

  return res.json();
};

export default async function Page({ params }: { params: { id: string } }) {
  const accountId = params.id;

  if (!accountId) notFound();

  const [accountDetails, fraudTransactions]: [AccountDetails | null, Transaction[]] = await Promise.all([
    fetcher(`${BACKEND_URL}/api/accounts/${accountId}`),
    fetcher(`${BACKEND_URL}/api/transactions/fraud/${accountId}`),
  ]);

  if (!accountDetails) notFound();

  const totalFraudAmount = fraudTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  const avgFraudAmount = fraudTransactions.length > 0 ? totalFraudAmount / fraudTransactions.length : 0;
  const maxFraudTxn = Math.max(...fraudTransactions.map((t) => t.amount), 0);

  return (
    <div className="relative max-h-8xl w-full rounded pb-3 px-4">
      <div className="flex flex-col bg-white/60 justify-between gap-3">
        {/* Header */}
        <div className="flex flex-row items-center gap-20">
          <div className="p-2">
            <div className="bg-white rounded flex flex-col gap-0.5 items-center p-2">
              <Image height={100} width={100} src="/user.svg" alt="user-image" className="object-cover rounded-full h-20 w-20" />
              <h1 className="text-sm font-bold text-black/70 tracking-widest">Account Id</h1>
              <span className="text-xs font-bold text-black/50 tracking-widest">{accountDetails.accountId}</span>
            </div>
          </div>
          <div className="p-2">
            <h1 className="text-md font-bold tracking-widest uppercase">Account Holder Name</h1>
            <span className="text-md font-light tracking-widest uppercase">{accountDetails.name}</span>
          </div>
          <div className="p-2">
            <h1 className="text-md font-bold tracking-widest uppercase">Account Number</h1>
            <span className="text-md font-light tracking-widest uppercase">{accountDetails.accountNumber}</span>
          </div>
        </div>

        {/* Overview Grid */}
        <div className="flex flex-row items-center justify-between gap-5 border-b-2 border-white">
          {[
            { label: 'Date of Birth', value: accountDetails.dob },
            { label: 'City', value: accountDetails.city },
            { label: 'KYC Status', value: accountDetails.kycStatus },
            { label: 'Risk Score', value: accountDetails.riskScore },
            { label: 'Total Txns', value: accountDetails.totalTxns },
            { label: 'Fraud Txns', value: accountDetails.fraudTxns },
          ].map(({ label, value }) => (
            <div key={label} className="p-2 border border-black">
              <h1 className="text-md font-bold tracking-widest uppercase">{label}</h1>
              <span className="text-md font-light tracking-widest uppercase">{value}</span>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="flex flex-row justify-between px-4 py-2 bg-black text-white rounded shadow">
          <div>
            <h2 className="font-bold tracking-wider text-sm uppercase">Avg Fraud Expenditure</h2>
            <p className="text-lg font-semibold">₹{avgFraudAmount.toFixed(2)}</p>
          </div>
          <div>
            <h2 className="font-bold tracking-wider text-sm uppercase">Total Fraud Txn Amount</h2>
            <p className="text-lg font-semibold">₹{totalFraudAmount.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <h2 className="font-bold tracking-wider text-sm uppercase">Highest Fraud Txn</h2>
            <p className="text-lg font-semibold">₹{maxFraudTxn.toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* Table Header */}
        <div className="flex flex-row px-4 justify-between p-2 bg-black">
          <h1 className="text-white tracking-widest">
            FRAUD TRANSACTIONS FOR <span className="font-bold">{accountDetails.name}</span>
          </h1>
          <Link href="/dashboard/accounts">
            <h1 className="text-blue-500 tracking-widest text-sm">Back to Accounts Overview <span className="text-xl">&#8599;</span></h1>
          </Link>
        </div>

        {/* Table Content */}
        <table className="min-w-full divide-y divide-gray-200 rounded">
          <thead>
            <tr className="bg-black">
              {["Time", "Amount", "Location", "Device Id", "Method", "Fraud", "Flagged"].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-gray-200">
            {fraudTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-white/70 p-4">
                  No fraud transactions found for this account.
                </td>
              </tr>
            ) : (
              fraudTransactions.map((t) => (
                <tr key={t.txnId} className="hover:bg-gray-500">
                  <td className="px-6 py-4 text-sm text-white/40 whitespace-nowrap">{new Date(t.timeStamp).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-white/90 whitespace-nowrap">₹{t.amount.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4 text-sm text-white whitespace-nowrap">{t.location}</td>
                  <td className="px-6 py-4 text-sm text-white whitespace-nowrap">{t.deviceId}</td>
                  <td className="px-6 py-4 text-sm text-white whitespace-nowrap">{t.method}</td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      t.isFraud === 'true' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'
                    }`}>
                      {t.isFraud === 'true' ? 'Fraud' : 'Legit'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      t.isFlagged === 'true' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'
                    }`}>
                      {t.isFlagged === 'true' ? 'Flagged' : 'Clear'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
