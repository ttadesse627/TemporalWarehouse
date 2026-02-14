'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Bell, User, Search,
  Package, Box, BarChart3, ShoppingCart, Building2,
  ChevronDown, LogOut, Settings, UserCircle, LayoutDashboard, ChevronRight
} from 'lucide-react';

interface HeaderProps {
  title?: string;
  userName?: string;
  userRole?: string;
  children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title = 'Temporal Warehouse',
  userName = 'Admin User',
  userRole = 'Administrator',
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/warehouse', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Inventory', href: '/inventory', icon: Box },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Suppliers', href: '/suppliers', icon: Building2 },
  ];

  const userActions = [
    { name: 'Profile', href: '/profile', icon: UserCircle },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Logout', href: '/logout', icon: LogOut },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/warehouse') {
      return pathname === '/warehouse' || pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (pathname === '/login') {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white
          transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          shadow-2xl
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold truncate">{title}</h2>
              <p className="text-xs text-slate-400 truncate">Enterprise Edition</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Main Menu</p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'hover:bg-white/10 text-slate-200'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  <span className="flex-1">{item.name}</span>
                  <ChevronRight className={`w-4 h-4 transition-opacity ${isActive ? 'text-white opacity-100' : 'text-slate-500 group-hover:text-white opacity-0 group-hover:opacity-100'}`} />
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-slate-400 truncate">{userRole}</p>
            </div>
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <header className="fixed top-0 right-0 left-0 lg:left-72 z-30 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl">
        {isSearchOpen && (
          <div className="lg:hidden fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products, inventory..."
                  className="w-full bg-white/10 text-white placeholder-slate-400 pl-10 pr-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-3 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden lg:flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight truncate">{title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <div className="hidden lg:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 bg-white/10 text-white placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                className="relative p-2.5 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-800" />
              </button>

              <div className="hidden lg:block relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-2 pr-3 rounded-xl hover:bg-white/10 transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-slate-200">
                      {userActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <Link
                            key={action.name}
                            href={action.href}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Icon className="w-4 h-4" />
                            {action.name}
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border-t border-white/10">
          <div className="px-4 py-2.5">
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Operational
              </div>
              <span className="text-slate-300">1,245 Products</span>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-[106px] lg:ml-72 min-h-screen">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
};

export default Header;
