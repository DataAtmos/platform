"use client"

import { CpuIcon } from "@/components/icons/cpu"
import { FlameIcon } from "@/components/icons/flame"
import { LayersIcon } from "@/components/icons/layers"
import { RollerCoasterIcon } from "@/components/icons/roller-coaster"

export function MarketingContent() {
  const features = [
    {
      icon: LayersIcon,
      text: "**Control plane** spins up any datastore in a VPC-peered cluster for **OLTP**; platform-agnostic—bring your own, use ours, or migrate yours seamlessly; **24/7 DBA support**",
    },
    {
      icon: RollerCoasterIcon,
      text: "**CDC streams** auto-lake every write for true **millisecond OLAP** with built-in engines or external connectors—**no pipeline upkeep**",
    },
    {
      icon: FlameIcon,
      text: "**AI agents** for managing database **performance tuning**, governance, reporting, and **cost optimization** by learning workload patterns to preempt issues",
    },
    {
      icon: CpuIcon,
      text: "**Modular GPU pods** mount **zero-copy data** (internal or external) so you can train, customize, and deploy **AI models end-to-end privately**",
    },
  ]

  const formatText = (text: string) => {
    return text.split("**").map((part, index) =>
      index % 2 === 1 ? (
        <span key={index} className="font-medium text-foreground/90">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto z-10">
      <div className="space-y-4 sm:space-y-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon
          return (
            <div key={index} className="flex gap-3 sm:gap-4 items-start">
              <div className="mt-0.5 flex-shrink-0">
                <IconComponent
                  size={16}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                />
              </div>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">{formatText(feature.text)}</p>
            </div>
          )
        })}

        <div className="pt-3 sm:pt-4 border-t border-border/40">
          <p className="font-mono text-xs text-muted-foreground leading-relaxed text-center">
            DataOps orchestration just got simpler—and your{" "}
            costs just got a whole lot smaller.
          </p>
        </div>
      </div>
    </div>
  )
}
