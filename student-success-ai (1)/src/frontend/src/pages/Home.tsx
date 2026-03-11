import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Map as MapIcon,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const fields = [
  "Web Development",
  "Data Science",
  "AI / Machine Learning",
  "Cybersecurity",
  "Cloud Computing",
  "Mobile Development",
  "DevOps / SRE",
  "Blockchain",
  "Game Development",
  "Embedded Systems",
];

const features = [
  {
    icon: MapIcon,
    title: "Personalized Roadmap",
    desc: "Get a custom, phase-by-phase career roadmap tailored to your goal and domain — with tools, skills, and timelines.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: BookOpen,
    title: "12-Week Study Plan",
    desc: "A concrete weekly schedule with tasks, resources, and milestones to keep you on track and consistently progressing.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: TrendingUp,
    title: "Career Guidance",
    desc: "Job market insights, portfolio ideas, interview tips, salary expectations, and networking strategies from an AI coach.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
];

const stats = [
  { icon: Zap, value: "10x", label: "Faster Planning" },
  { icon: Users, value: "50k+", label: "Students Helped" },
  { icon: Star, value: "4.9", label: "Average Rating" },
];

export default function Home() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [field, setField] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || !field) return;
    navigate({
      to: "/generate",
      search: { goal: goal.trim(), field },
    } as any);
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <section className="relative container mx-auto px-4 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Gemini AI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
        >
          Your AI-Powered Path <br />
          <span className="text-gradient">to Success</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-xl mx-auto mb-10"
        >
          Generate a personalized career roadmap, study plan, and expert
          guidance — tailored to your engineering goals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-8 mb-12"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="font-display text-2xl font-bold text-foreground">
                {s.value}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="max-w-xl mx-auto glass-card border-border/60 shadow-2xl shadow-primary/5">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 text-left">
                  <Label
                    htmlFor="goal"
                    className="text-sm text-muted-foreground"
                  >
                    Career Goal
                  </Label>
                  <Input
                    id="goal"
                    placeholder="e.g. Full Stack Developer, Data Scientist, DevOps Engineer"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    data-ocid="home.goal.input"
                    className="bg-background/50 border-border/60 focus:border-primary/60 placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <Label className="text-sm text-muted-foreground">
                    Field / Domain
                  </Label>
                  <Select value={field} onValueChange={setField}>
                    <SelectTrigger
                      data-ocid="home.field.select"
                      className="bg-background/50 border-border/60 focus:border-primary/60"
                    >
                      <SelectValue placeholder="Select your domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={!goal.trim() || !field}
                  data-ocid="home.generate.primary_button"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate My Roadmap
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Three AI-powered tools that give you the full picture of your career
            journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="glass-card border-border/40 hover:border-border/70 transition-all duration-300 h-full group">
                <CardContent className="p-6">
                  <div
                    className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
