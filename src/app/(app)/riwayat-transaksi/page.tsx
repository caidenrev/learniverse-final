
'use client';

import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
  errorEmitter,
  FirestorePermissionError,
} from '@/firebase';
import {
  collection,
  doc,
  updateDoc,
  serverTimestamp,
  orderBy,
  query,
  limit
} from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, History, AlertCircle, RefreshCw, X } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">Tertunda</Badge>;
    case 'success':
      return <Badge className="bg-green-500 text-white hover:bg-green-600">Berhasil</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Dibatalkan</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function TransactionHistoryPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const transactionsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
        collection(firestore, 'users', user.uid, 'transactions'),
        orderBy('createdAt', 'desc'),
        limit(20)
    );
  }, [firestore, user]);

  const {
    data: transactions,
    isLoading,
    error,
  } = useCollection(transactionsQuery);

  const handleCancelTransaction = async (orderId: string) => {
    if (!firestore || !user) return;
    
    const transactionRef = doc(firestore, 'users', user.uid, 'transactions', orderId);
    
    try {
      await updateDoc(transactionRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
      });
      toast({
        title: 'Transaksi Dibatalkan',
        description: `Transaksi dengan ID ${orderId} telah dibatalkan.`,
      });
    } catch (e: any) {
        const permissionError = new FirestorePermissionError({
            path: transactionRef.path,
            operation: 'update',
            requestResourceData: { status: 'cancelled' },
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            title: 'Gagal Membatalkan',
            description: 'Tidak dapat memperbarui status transaksi. Coba lagi.',
            variant: 'destructive',
        });
    }
  };

  return (
    <div className="space-y-8">
      <div className="pt-4">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">
          Riwayat Transaksi
        </h1>
        <p className="mt-2 text-muted-foreground">
          Lihat semua riwayat transaksi dan pembayaran Anda di sini.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-6 w-6" />
            <span>Daftar Transaksi</span>
          </CardTitle>
          <CardDescription>
            Menampilkan 20 transaksi terakhir Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && error && (
            <div className="flex h-60 flex-col items-center justify-center gap-4 text-destructive">
              <AlertCircle className="h-10 w-10" />
              <p className="font-semibold">Gagal memuat transaksi</p>
              <p className="text-sm text-center">{error.message}</p>
            </div>
          )}
          {!isLoading && transactions && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Belum ada transaksi.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {format(tx.createdAt.toDate(), 'd MMM yyyy, HH:mm')}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(tx.createdAt.toDate(), {
                                addSuffix: true,
                                locale: id,
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(tx.amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(tx.status)}</TableCell>
                        <TableCell className="text-right">
                          {tx.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                               <Button variant="outline" size="sm" asChild>
                                <a href={tx.paymentUrl} target="_blank" rel="noopener noreferrer">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Lanjutkan
                                </a>
                               </Button>
                               <Button variant="ghost" size="sm" onClick={() => handleCancelTransaction(tx.id)}>
                                    <X className="mr-2 h-4 w-4" />
                                    Batal
                               </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
