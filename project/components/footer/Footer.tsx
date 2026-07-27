import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-950 py-8 text-slate-300 border-t border-slate-800/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5 items-center">
          
         {/* Brand Column */}
          <div className="flex flex-col sm:flex-row items-center md:items-center gap-4 md:col-span-2 text-center md:text-left">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/icon.png"
                alt="Projectnify"
                width={104}
                height={104}
                className="h-24 w-auto object-contain sm:h-28"
                priority
              />
            </Link>
            <div className="flex flex-col justify-center">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    Projectnify
                </span>
              <p className="text-xs text-slate-400 mt-1">
                Modern project management for high-performing teams.
              </p>
            </div>
          </div>

          {/* Quick Links Group */}
          <div className="md:col-span-3 grid grid-cols-3 gap-4 text-xs sm:text-sm text-center md:text-right">
            <div>
              <h4 className="font-semibold text-white mb-2">Product</h4>
              <ul className="space-y-1.5">
                <li><Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Features</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Company</h4>
              <ul className="space-y-1.5">
                <li><Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">About</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Support</h4>
              <ul className="space-y-1.5">
                <li><Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Help</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Contact</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">API</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Projectnify. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link href="#" className="hover:text-cyan-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-cyan-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}