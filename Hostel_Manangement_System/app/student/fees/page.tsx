'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function StudentFeesPage() {
  const [profile, setProfile] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        if (data?.student?.id) {
          return fetch(`/api/payments?studentId=${data.student.id}`)
            .then(r => r.json())
            .then(p => setPayments(p))
        }
      })
      .catch(() => toast.error('Could not load fee information'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const student = profile?.student
  const latestPayment = payments[0]
  const totalPaid = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + Number(p.amount), 0)
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Fee Information</h1>
        <p className="text-gray-600 mt-2">Track your hostel fee payments and payment history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`border-l-4 ${latestPayment?.status === 'PAID' ? 'border-l-green-500' : 'border-l-orange-500'}`}>
          <CardContent className="pt-6">
            <div className={`text-2xl font-bold ${latestPayment?.status === 'PAID' ? 'text-green-600' : 'text-orange-600'}`}>
              {latestPayment?.status || 'No Record'}
            </div>
            <p className="text-sm text-muted-foreground">Current Status</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">₹{totalPaid.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total Paid</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">₹{totalPending.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Pending Amount</p>
          </CardContent>
        </Card>
      </div>

      {totalPending > 0 && (
        <Card className="border border-orange-200 bg-orange-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-900">Payment Due</p>
                <p className="text-xs text-orange-700">You have ₹{totalPending.toLocaleString()} in pending fees. Please contact your warden.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>All your hostel fee transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No payment records found.</p>
              <p className="text-sm text-muted-foreground mt-1">Contact your warden to add fee records.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.reference}</TableCell>
                    <TableCell>{payment.paymentType}</TableCell>
                    <TableCell className="font-medium">₹{Number(payment.amount).toLocaleString()}</TableCell>
                    <TableCell>{new Date(payment.paymentDate).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge variant={payment.status === 'PAID' ? 'default' : payment.status === 'PENDING' ? 'secondary' : 'destructive'}
                             className={payment.status === 'PAID' ? 'bg-green-600' : ''}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
