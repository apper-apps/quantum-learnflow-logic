import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Empty from '@/components/ui/Empty'
import { useCart } from '@/hooks/useCart'

const Cart = () => {
  const { 
    items, 
    loading, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartSummary,
    applyDiscount 
  } = useCart()
  
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(null)

  const summary = getCartSummary()

  const handleRemove = (courseId) => {
    removeFromCart(courseId)
  }

  const handleQuantityChange = (courseId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemove(courseId)
    } else {
      updateQuantity(courseId, newQuantity)
    }
  }

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast.error('Please enter a discount code')
      return
    }

    const discount = applyDiscount(discountCode)
    if (discount) {
      setAppliedDiscount(discount)
      setDiscountCode('')
    }
  }

  const calculateDiscountAmount = () => {
    if (!appliedDiscount) return 0
    
    if (appliedDiscount.type === 'percentage') {
      return summary.subtotal * (appliedDiscount.value / 100)
    } else {
      return Math.min(appliedDiscount.value, summary.subtotal)
    }
  }

  const finalTotal = () => {
    const discountAmount = calculateDiscountAmount()
    return Math.max(0, summary.total - discountAmount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <Empty
            title="Your cart is empty"
            message="Looks like you haven't added any courses to your cart yet. Browse our course catalog to find something interesting."
            icon="ShoppingCart"
            actionLabel="Browse Courses"
            onAction={() => window.location.href = '/courses'}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart ({summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'})
          </h1>
          <Button
            variant="outline"
            size="small"
            onClick={clearCart}
            icon="Trash2"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Course Image */}
                      <div className="w-full md:w-32 h-20 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <ApperIcon name="PlayCircle" className="w-8 h-8 text-white" />
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          <Link 
                            to={`/course/${item.Id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {item.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <ApperIcon name="User" className="w-4 h-4 mr-1" />
                            {item.instructor?.name}
                          </span>
                          <span className="flex items-center">
                            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                            {Math.floor(item.duration / 60)}h {item.duration % 60}m
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                            item.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.level}
                          </span>
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.Id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <ApperIcon name="Minus" className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.Id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <ApperIcon name="Plus" className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleRemove(item.Id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from cart"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Discount Code */}
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Discount code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button
                    variant="outline"
                    size="small"
                    onClick={handleApplyDiscount}
                    icon="Tag"
                  >
                    Apply
                  </Button>
                </div>
                {appliedDiscount && (
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-green-600 flex items-center">
                      <ApperIcon name="Check" className="w-4 h-4 mr-1" />
                      {appliedDiscount.description}
                    </span>
                    <button
                      onClick={() => setAppliedDiscount(null)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Summary Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${summary.subtotal.toFixed(2)}</span>
                </div>
                
                {appliedDiscount && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount</span>
                    <span>-${calculateDiscountAmount().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${summary.tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${finalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                as={Link}
                to="/checkout"
                variant="primary"
                size="large"
                className="w-full mb-4"
                icon="CreditCard"
              >
                Proceed to Checkout
              </Button>

              {/* Continue Shopping */}
              <Button
                as={Link}
                to="/courses"
                variant="outline"
                size="large"
                className="w-full"
                icon="ArrowLeft"
              >
                Continue Shopping
              </Button>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ApperIcon name="Shield" className="w-4 h-4 text-green-500" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <ApperIcon name="RotateCcw" className="w-4 h-4 text-blue-500" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart