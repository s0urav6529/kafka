'use client';

import { useState, FormEvent } from 'react';

interface FormData {
    [key: string]: string;
}

interface StatusMessage {
    type: 'success' | 'error' | 'idle';
    message: string;
}

export default function Home() {
    const [orderStatus, setOrderStatus] = useState<StatusMessage>({ type: 'idle', message: '' });
    const [paymentStatus, setPaymentStatus] = useState<StatusMessage>({ type: 'idle', message: '' });
    const [emailStatus, setEmailStatus] = useState<StatusMessage>({ type: 'idle', message: '' });
    const [loading, setLoading] = useState({ order: false, payment: false, email: false });

    const handleOrderSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget; // Store form reference before async operations
        setLoading({ ...loading, order: true });
        setOrderStatus({ type: 'idle', message: '' });

        const formData = new FormData(form);
        const data = {
            orderId: formData.get('orderId') as string,
            customerName: formData.get('customerName') as string,
            productName: formData.get('productName') as string,
            quantity: parseInt(formData.get('quantity') as string) || 1,
            totalAmount: parseFloat(formData.get('totalAmount') as string) || 0,
        };

        try {
            const response = await fetch('/api/order/place', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setOrderStatus({ type: 'success', message: `✓ Order #${data.orderId} placed! Notification sent to Kafka.` });
                form.reset();
            } else {
                setOrderStatus({ type: 'error', message: `✗ ${result.error || 'Failed to place order'}` });
            }
        } catch (error) {
            console.error('Order submission error:', error);
            setOrderStatus({
                type: 'error',
                message: `✗ ${error instanceof Error ? error.message : 'Network error occurred. Please try again.'}`
            });
        } finally {
            setLoading({ ...loading, order: false });
        }
    };

    const handlePaymentSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget; // Store form reference before async operations
        setLoading({ ...loading, payment: true });
        setPaymentStatus({ type: 'idle', message: '' });

        const formData = new FormData(form);
        const data = {
            paymentId: formData.get('paymentId') as string,
            orderId: formData.get('paymentOrderId') as string,
            amount: parseFloat(formData.get('amount') as string) || 0,
            paymentMethod: formData.get('paymentMethod') as string,
        };

        try {
            const response = await fetch('/api/payment/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setPaymentStatus({ type: 'success', message: `✓ Payment #${data.paymentId} completed! Sent to Kafka.` });
                form.reset();
            } else {
                setPaymentStatus({ type: 'error', message: `✗ ${result.error || 'Failed to complete payment'}` });
            }
        } catch (error) {
            console.error('Payment submission error:', error);
            setPaymentStatus({
                type: 'error',
                message: `✗ ${error instanceof Error ? error.message : 'Network error occurred. Please try again.'}`
            });
        } finally {
            setLoading({ ...loading, payment: false });
        }
    };

    const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget; // Store form reference before async operations
        setLoading({ ...loading, email: true });
        setEmailStatus({ type: 'idle', message: '' });

        const formData = new FormData(form);
        const data = {
            emailId: formData.get('emailId') as string,
            recipientEmail: formData.get('recipientEmail') as string,
            subject: formData.get('subject') as string,
            body: formData.get('emailBody') as string,
        };

        try {
            const response = await fetch('/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setEmailStatus({ type: 'success', message: `✓ Email sent to ${data.recipientEmail}! Sent to Kafka.` });
                form.reset();
            } else {
                setEmailStatus({ type: 'error', message: `✗ ${result.error || 'Failed to send email'}` });
            }
        } catch (error) {
            console.error('Email submission error:', error);
            setEmailStatus({
                type: 'error',
                message: `✗ ${error instanceof Error ? error.message : 'Network error occurred. Please try again.'}`
            });
        } finally {
            setLoading({ ...loading, email: false });
        }
    };

    return (
        <div className="min-h-screen p-8 pb-20">
            {/* Header */}
            <header className="max-w-7xl mx-auto mb-12 animate-fade-in">
                <div className="text-center">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Kafka Event Producer
                    </h1>
                    <p className="text-gray-400 text-lg">Event-Driven Architecture with Real-Time Message Publishing</p>
                </div>
            </header>

            {/* Main Grid */}
            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Order Placement Card */}
                <div className="glass-effect rounded-2xl p-8 animate-slide-up hover:glow-effect transition-all duration-300">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Place Order</h2>
                            <p className="text-sm text-gray-400">→ notification topic</p>
                        </div>
                    </div>

                    <form onSubmit={handleOrderSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="orderId" className="block text-sm font-medium text-gray-300 mb-2">Order ID</label>
                            <input
                                type="text"
                                id="orderId"
                                name="orderId"
                                required
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-white"
                                placeholder="ORD-001"
                            />
                        </div>

                        <div>
                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-2">Customer Name</label>
                            <input
                                type="text"
                                id="customerName"
                                name="customerName"
                                required
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-white"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                            <input
                                type="text"
                                id="productName"
                                name="productName"
                                required
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-white"
                                placeholder="Premium Widget"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    min="1"
                                    defaultValue="1"
                                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-300 mb-2">Amount ($)</label>
                                <input
                                    type="number"
                                    id="totalAmount"
                                    name="totalAmount"
                                    min="0"
                                    step="0.01"
                                    defaultValue="99.99"
                                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-white"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading.order}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading.order ? 'Processing...' : 'Place Order'}
                        </button>

                        {orderStatus.message && (
                            <div className={`p-3 rounded-lg text-sm font-medium ${orderStatus.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                {orderStatus.message}
                            </div>
                        )}
                    </form>
                </div>

                {/* Payment Completion Card */}
                <div className="glass-effect rounded-2xl p-8 animate-slide-up hover:glow-effect transition-all duration-300" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
                            <p className="text-sm text-gray-400">→ payments topic</p>
                        </div>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="paymentId" className="block text-sm font-medium text-gray-300 mb-2">Payment ID</label>
                            <input
                                type="text"
                                id="paymentId"
                                name="paymentId"
                                required
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-white"
                                placeholder="PAY-001"
                            />
                        </div>

                        <div>
                            <label htmlFor="paymentOrderId" className="block text-sm font-medium text-gray-300 mb-2">Order ID</label>
                            <input
                                type="text"
                                id="paymentOrderId"
                                name="paymentOrderId"
                                required
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-white"
                                placeholder="ORD-001"
                            />
                        </div>

                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Amount ($)</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                min="0"
                                step="0.01"
                                required
                                defaultValue="99.99"
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-white"
                                placeholder="99.99"
                            />
                        </div>

                        <div>
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
                            <select
                                id="paymentMethod"
                                name="paymentMethod"
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-white"
                            >
                                <option value="credit_card">Credit Card</option>
                                <option value="debit_card">Debit Card</option>
                                <option value="paypal">PayPal</option>
                                <option value="bank_transfer">Bank Transfer</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading.payment}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading.payment ? 'Processing...' : 'Complete Payment'}
                        </button>

                        {paymentStatus.message && (
                            <div className={`p-3 rounded-lg text-sm font-medium ${paymentStatus.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                {paymentStatus.message}
                            </div>
                        )}
                    </form>
                </div>

                {/* Email Sending Card */}
                <div className="glass-effect rounded-2xl p-8 animate-slide-up hover:glow-effect transition-all duration-300" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Send Email</h2>
                            <p className="text-sm text-gray-400">→ emails topic</p>
                        </div>
                    </div>

                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="emailId" className="block text-sm font-medium text-gray-300 mb-2">Email ID</label>
                            <input
                                type="text"
                                id="emailId"
                                name="emailId"
                                required
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-white"
                                placeholder="EMAIL-001"
                            />
                        </div>

                        <div>
                            <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-300 mb-2">Recipient Email</label>
                            <input
                                type="email"
                                id="recipientEmail"
                                name="recipientEmail"
                                required
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-white"
                                placeholder="customer@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                required
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-white"
                                placeholder="Order Confirmation"
                            />
                        </div>

                        <div>
                            <label htmlFor="emailBody" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                            <textarea
                                id="emailBody"
                                name="emailBody"
                                rows={3}
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-white resize-none"
                                placeholder="Your order has been confirmed..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading.email}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading.email ? 'Sending...' : 'Send Email'}
                        </button>

                        {emailStatus.message && (
                            <div className={`p-3 rounded-lg text-sm font-medium ${emailStatus.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                {emailStatus.message}
                            </div>
                        )}
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto mt-16 text-center">
                <div className="glass-effect rounded-xl p-6 inline-block">
                    <p className="text-gray-400 text-sm">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse-slow"></span>
                        Connected to Kafka @ <span className="text-blue-400 font-mono">localhost:9092</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                        Each action triggers its corresponding Kafka topic in real-time
                    </p>
                </div>
            </footer>
        </div>
    );
}
