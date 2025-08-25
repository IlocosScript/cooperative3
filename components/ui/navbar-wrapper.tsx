'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Determine navbar configuration based on current path
  const getNavbarConfig = () => {
    // Don't show navbar on login page
    if (pathname === '/') {
      return null;
    }
    
    // Dashboard page
    if (pathname === '/dashboard') {
      return {
        title: 'Philippine Cooperative',
        subtitle: 'Management System',
        showBackButton: false,
        showLogo: true,
        showUserInfo: true,
        showLogout: true
      };
    }
    
    // Members page
    if (pathname === '/members') {
      return {
        title: 'Member Management',
        showBackButton: true,
        backUrl: '/dashboard',
        showLogo: true,
        showUserInfo: true,
        showLogout: true
      };
    }
    
    // Loans page
    if (pathname === '/loans') {
      return {
        title: 'Loan Management',
        showBackButton: true,
        backUrl: '/dashboard',
        showLogo: true,
        showUserInfo: true,
        showLogout: true
      };
    }
    
    // Savings page
    if (pathname === '/savings') {
      return {
        title: 'Savings Management',
        showBackButton: true,
        backUrl: '/dashboard',
        showLogo: true,
        showUserInfo: true,
        showLogout: true
      };
    }
    
    // Reports page
    if (pathname === '/reports') {
      return {
        title: 'Reports & Analytics',
        showBackButton: true,
        backUrl: '/dashboard',
        showLogo: true,
        showUserInfo: true,
        showLogout: true
      };
    }
    
    // Default configuration for other pages
    return {
      title: 'Cooperative Management',
      showBackButton: true,
      backUrl: '/dashboard',
      showLogo: true,
      showUserInfo: true,
      showLogout: true
    };
  };

  const navbarConfig = getNavbarConfig();

  if (!navbarConfig) {
    return null;
  }

  return <Navbar {...navbarConfig} />;
}
