import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import { useCart } from '@/hooks/useCart'

const Header = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation()
  const { items } = useCart()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navigation = [
    { name: 'Browse Courses', href: '/courses', icon: 'BookOpen' },
    { name: 'My Learning', href: '/dashboard', icon: 'GraduationCap' },
    { name: 'Teach', href: '/teach', icon: 'Users' },
  ]

  const isActive = (href) => {
    if (href === '/' && location.pathname === '/') return true
    if (href !== '/' && location.pathname.startsWith(href)) return true
    return false
  }

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">LearnFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            >
              <ApperIcon name="Search" className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary transition-colors">
              <ApperIcon name="ShoppingCart" className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent to-warning text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-4 h-4 text-white" />
                </div>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            >
              <ApperIcon name={isMobileMenuOpen ? 'X' : 'Menu'} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {isSearchOpen && (
        <motion.div
          className="md:hidden bg-white border-t border-gray-200 px-4 py-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <SearchBar />
        </motion.div>
      )}

      {/* Mobile Menu */}
      <motion.div
        className={`lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-40 ${
          isMobileMenuOpen ? 'block' : 'hidden'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="px-4 py-6 space-y-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'text-gray-700 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <ApperIcon name={item.icon} className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.header>
  )
}

export default Header