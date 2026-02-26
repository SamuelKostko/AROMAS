'use client';

import { motion } from 'framer-motion';
import { Home, Grid, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { icon: Home, label: 'Inicio', href: '/' },
  { icon: Grid, label: 'Catálogo', href: '/' },
  { icon: Heart, label: 'Favoritos', href: '#' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-t border-neutral-200 lg:hidden"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={`${item.label}-${item.href}`} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center justify-center min-w-[60px] py-1"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    isActive ? 'bg-foreground' : ''
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-background' : 'text-neutral-600'
                    }`}
                  />
                </motion.div>
                <span
                  className={`text-xs mt-1 font-sans ${
                    isActive ? 'text-foreground font-medium' : 'text-neutral-600'
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
