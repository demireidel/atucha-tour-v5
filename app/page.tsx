"use client"

import { Suspense, useMemo, useCallback, memo } from "react"
import dynamic from "next/dynamic"
import { Canvas } from "@react-three/fiber"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Users, Shield, Zap, Building, ArrowLeft } from "lucide-react"
import { useTourStore } from "@/lib/store"

const AtuchaScene = dynamic(() => import("@/components/AtuchaScene"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <div className="animate-pulse">Loading Nuclear Plant...</div>
    </div>
  ),
})

const TOURS = [
  {
    id: "reactor-core" as const,
    title: "Reactor Core Journey",
    description:
      "Walk through the heart of nuclear power generation, exploring the reactor vessel and control systems.",
    duration: "12 minutes",
    highlights: ["Reactor Vessel", "Control Rods", "Steam Generators"] as const,
    icon: Zap,
    difficulty: "Beginner" as const,
  },
  {
    id: "turbine-hall" as const,
    title: "Turbine Hall Experience",
    description: "Discover how nuclear energy transforms into electricity through massive turbine generators.",
    duration: "10 minutes",
    highlights: ["Steam Turbines", "Generator Hall", "Power Conversion"] as const,
    icon: Building,
    difficulty: "Intermediate" as const,
  },
  {
    id: "safety-systems" as const,
    title: "Safety Systems Tour",
    description: "Learn about the multiple layers of safety that protect both workers and the environment.",
    duration: "15 minutes",
    highlights: ["Emergency Systems", "Containment", "Safety Protocols"] as const,
    icon: Shield,
    difficulty: "Advanced" as const,
  },
  {
    id: "control-room" as const,
    title: "Control Room Operations",
    description: "Step into the nerve center where operators monitor and control the entire facility.",
    duration: "8 minutes",
    highlights: ["Control Panels", "Monitoring Systems", "Operations Center"] as const,
    icon: Users,
    difficulty: "Intermediate" as const,
  },
  {
    id: "complete-facility" as const,
    title: "Complete Facility Overview",
    description: "A comprehensive tour covering all major systems and areas of the Atucha II plant.",
    duration: "25 minutes",
    highlights: ["Full Plant Tour", "All Major Systems", "Comprehensive Overview"] as const,
    icon: Play,
    difficulty: "All Levels" as const,
  },
] as const

const TourView = memo(function TourView() {
  const { currentTour, exitTour } = useTourStore()
  const currentTourData = useMemo(() => TOURS.find((tour) => tour.id === currentTour), [currentTour])

  const handleExitTour = useCallback(() => {
    exitTour()
  }, [exitTour])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <Canvas
        shadows
        camera={{ position: [50, 30, 50], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        performance={{ min: 0.5 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <AtuchaScene tourId={currentTour} />
        </Suspense>
      </Canvas>

      <div className="absolute top-4 left-4 z-10">
        <Button onClick={handleExitTour} variant="secondary" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Exit Tour
        </Button>
      </div>

      {currentTourData && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="bg-card/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{currentTourData.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentTourData.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {currentTourData.duration}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
})

const TourCard = memo(function TourCard({ tour }: { tour: (typeof TOURS)[number] }) {
  const { startTour } = useTourStore()
  const IconComponent = tour.icon

  const handleStartTour = useCallback(() => {
    startTour(tour.id)
  }, [tour.id, startTour])

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <IconComponent className="h-6 w-6" />
          </div>
          <Badge variant="secondary">{tour.difficulty}</Badge>
        </div>
        <CardTitle className="text-xl">{tour.title}</CardTitle>
        <CardDescription className="text-base">{tour.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {tour.duration}
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Tour Highlights:</p>
            <div className="flex flex-wrap gap-1">
              {tour.highlights.map((highlight) => (
                <Badge key={highlight} variant="outline" className="text-xs">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>

          <Button className="w-full" onClick={handleStartTour}>
            Start Tour
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

const HeroSection = memo(function HeroSection() {
  const scrollToTours = useCallback(() => {
    document.getElementById("tours")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="absolute inset-0 bg-[url('/atucha-nuclear-power-plant-exterior.png')] bg-cover bg-center opacity-20" />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="font-bold text-5xl md:text-7xl mb-6 text-balance">
          Explore the Engineering Marvel of <span className="text-primary">Atucha II</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty">
          Join our Premium Guided Virtual Tours and discover the cutting-edge technology behind Argentina's most
          advanced nuclear power facility.
        </p>
        <Button size="lg" className="text-lg px-8 py-6" onClick={scrollToTours}>
          Discover Tours
        </Button>
      </div>
    </section>
  )
})

export default function HomePage() {
  const isInTour = useTourStore((state) => state.isInTour)

  if (isInTour) {
    return <TourView />
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />

      <section id="tours" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl mb-4">Premium Virtual Tours</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our expertly crafted tours, each designed to provide deep insights into different aspects of
              nuclear power generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TOURS.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-bold text-3xl mb-6">Safety & Expertise</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our virtual tours are developed in collaboration with nuclear engineers and safety experts, ensuring
            accurate representation of safety protocols and operational procedures. Experience the highest standards of
            nuclear safety education.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Safety First</h3>
              <p className="text-muted-foreground">Multiple safety systems and protocols</p>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Innovation</h3>
              <p className="text-muted-foreground">Cutting-edge nuclear technology</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Expertise</h3>
              <p className="text-muted-foreground">Guided by industry professionals</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
