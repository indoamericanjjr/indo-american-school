import { Skeleton } from "@/components/ui/skeleton";

// Hero Slider Skeleton
export function HeroSkeleton() {
  return (
    <section className="relative h-[100svh] min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Skeleton */}
      <Skeleton className="absolute inset-0 w-full h-full" />

      {/* Gradient overlays (invisible but maintain structure) */}
      <div className="absolute inset-0 bg-gradient-to-r from-school-navy/95 via-primary/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-school-navy/60 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-school-navy/30 to-transparent h-40" />

      {/* Content Skeleton */}
      <div className="relative h-full container-custom flex items-center">
        <div className="max-w-3xl space-y-6">
          {/* Accent Badge */}
          <Skeleton className="h-12 w-48 rounded-full" />

          {/* Subtitle */}
          <Skeleton className="h-8 w-64" />

          {/* Title */}
          <Skeleton className="h-16 w-full max-w-2xl" />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-14 w-48 rounded-full" />
            <Skeleton className="h-14 w-40 rounded-full" />
          </div>
        </div>

        {/* Quick Stats Skeleton (Desktop) */}
        <div className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2">
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-16 h-16 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Skeleton className="hidden md:flex absolute left-8 top-1/2 w-14 h-14 rounded-full" />
      <Skeleton className="hidden md:flex absolute right-8 top-1/2 w-14 h-14 rounded-full" />

      {/* Bottom Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
        <Skeleton className="w-11 h-11 rounded-full" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-1.5 w-8 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-4 w-12" />
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent" />
    </section>
  );
}

// About Section Skeleton
export function AboutSkeleton() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-full max-w-lg" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Image Side */}
          <div className="relative">
            <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
            <Skeleton className="absolute -bottom-4 -left-4 w-24 h-16 rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Stats Section Skeleton
export function StatsSkeleton() {
  return (
    <section className="py-12 bg-muted">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 -mt-8 md:-mt-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card p-4 md:p-6 rounded-2xl shadow-sm border border-border">
              <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Gallery Section Skeleton
export function GallerySkeleton() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <Skeleton className="h-6 w-32 mx-auto mb-4" />
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl">
              <Skeleton className="w-full aspect-[4/3]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Skeleton className="h-12 w-40 mx-auto rounded-full" />
        </div>
      </div>
    </section>
  );
}

// Testimonials Section Skeleton
export function TestimonialsSkeleton() {
  return (
    <section className="section-padding bg-muted">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <Skeleton className="h-6 w-40 mx-auto mb-4" />
          <Skeleton className="h-12 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card p-6 rounded-2xl shadow-sm border border-border">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Skeleton key={star} className="w-4 h-4 mr-1" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section Skeleton
export function ContactSkeleton() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-20 w-full" />

            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              ))}
            </div>

            <Skeleton className="w-full h-64 rounded-2xl" />
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-64 mb-6" />

            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-12 w-full" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

