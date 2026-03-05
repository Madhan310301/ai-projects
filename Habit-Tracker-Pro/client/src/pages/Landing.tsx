import { Button } from "@/components/ui/button";
import { Target, TrendingUp, ShieldCheck, ArrowRight, BarChart3, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { loginWithGoogle } from "@/lib/firebase";

export function Landing() {
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      // Auth state change in use-auth will handle the redirect
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">FocusFlow</span>
          </div>
          <Button onClick={handleLogin} variant="outline" className="rounded-full px-6">
            Sign In with Google
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div {...fadeInUp} className="mb-6 inline-block">
            <span className="px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium">
              Re-imagine your daily routine
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold font-display leading-tight mb-8 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
          >
            Master your habits,<br />master your life.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            A powerful, intelligent habit tracker designed for high performers. 
            Track progress, visualize consistency, and leverage insights to reach your potential.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button onClick={handleLogin} size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
              Get Started with Google <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-secondary/20 border-y border-border/40">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Visual Calendar",
                desc: "Track your habits on a beautiful calendar. See your streaks and patterns at a glance."
              },
              {
                icon: BarChart3,
                title: "Deep Analytics",
                desc: "Comprehensive charts, trends, and productivity scores to keep you on track."
              },
              {
                icon: ShieldCheck,
                title: "Smart Insights",
                desc: "Get personalized recommendations and pattern analysis to optimize your routine."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/40">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center">
              <Target className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">FocusFlow</span>
          </div>
          <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} FocusFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
