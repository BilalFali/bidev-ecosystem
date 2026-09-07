import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit, Newspaper, Smartphone, Cpu, Shield, Building2,
  Rocket, Globe, Gamepad2, FlaskConical, Folder, BarChart3, Layers, Briefcase,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "brain-circuit": BrainCircuit,
  "newspaper": Newspaper,
  "smartphone": Smartphone,
  "cpu": Cpu,
  "shield": Shield,
  "building-2": Building2,
  "rocket": Rocket,
  "globe": Globe,
  "gamepad-2": Gamepad2,
  "flask-conical": FlaskConical,
  "bar-chart-3": BarChart3,
  "layers": Layers,
  "briefcase": Briefcase,
};

export function getCategoryIcon(icon: string | null | undefined): LucideIcon {
  return (icon && ICONS[icon]) || Folder;
}
