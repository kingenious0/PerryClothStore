import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  const aboutImage = {
    imageUrl: "https://images.unsplash.com/photo-1529612700005-e35372bf1108?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwYXRlbGllcnxlbnwwfHx8fDE3Njk1NzYxNTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "fashion atelier"
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Our Story</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          PerryStore was born from a desire to blend timeless craftsmanship with contemporary design, creating pieces that are both beautiful and enduring.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
        <div className="space-y-6 text-lg leading-relaxed text-foreground/80">
          <p>
            Founded in 2024, PerryStore began as a small atelier with a grand vision: to redefine luxury by focusing on quality, sustainability, and artistic expression. We believe that true style is not about fleeting trends, but about personal expression and pieces that last a lifetime.
          </p>
          <p>
            Our collections are designed in-house and crafted by skilled artisans who share our passion for detail and quality. We source the finest materials from around the world, ensuring that every product we create is a testament to our commitment to excellence.
          </p>
          <p>
            From the initial sketch to the final stitch, every step of our process is infused with care. We invite you to explore our collection and discover the story woven into every thread.
          </p>
        </div>
        <div>
          <Card className="overflow-hidden">
            <CardContent className="p-0 aspect-[4/5] relative">
              <Image
                src={aboutImage.imageUrl}
                alt="PerryStore atelier"
                fill
                className="object-cover"
                data-ai-hint={aboutImage.imageHint}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="mt-24 text-center">
        <h2 className="text-3xl font-bold mb-8">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-card border rounded-lg">
            <h3 className="text-xl font-headline font-semibold mb-2">Craftsmanship</h3>
            <p className="text-muted-foreground">
              Honoring traditional techniques while embracing modern innovation.
            </p>
          </div>
          <div className="p-6 bg-card border rounded-lg">
            <h3 className="text-xl font-headline font-semibold mb-2">Quality</h3>
            <p className="text-muted-foreground">
              Using only the finest, ethically sourced materials for lasting wear.
            </p>
          </div>
          <div className="p-6 bg-card border rounded-lg">
            <h3 className="text-xl font-headline font-semibold mb-2">Design</h3>
            <p className="text-muted-foreground">
              Creating timeless, elegant pieces that transcend seasonal trends.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
