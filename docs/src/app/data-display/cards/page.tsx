"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function CardsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Cards
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Cards contain content and actions about a single subject. They are
          surfaces that display content and actions on a single topic.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Variants</h2>
        <Showcase title="Elevated Card">
          <Card variant="elevated" className="w-72">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>A card with elevation shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This card uses shadow to create a sense of depth and hierarchy.</p>
            </CardContent>
            <CardFooter>
              <Button variant="text">Learn More</Button>
            </CardFooter>
          </Card>
        </Showcase>
        <Showcase title="Filled Card">
          <Card variant="filled" className="w-72">
            <CardHeader>
              <CardTitle>Filled Card</CardTitle>
              <CardDescription>A card with filled background</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Filled cards use a container color for distinction.</p>
            </CardContent>
            <CardFooter>
              <Button variant="text">Action</Button>
            </CardFooter>
          </Card>
        </Showcase>
        <Showcase title="Outlined Card">
          <Card variant="outlined" className="w-72">
            <CardHeader>
              <CardTitle>Outlined Card</CardTitle>
              <CardDescription>A card with outline border</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Outlined cards use a border for visual separation.</p>
            </CardContent>
            <CardFooter>
              <Button variant="text">Details</Button>
            </CardFooter>
          </Card>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Interactive</h2>
        <Showcase title="Clickable Cards">
          <Card variant="elevated" className="w-72 cursor-pointer" interactive>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>Click or tap this card</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This card responds to hover and press interactions.</p>
            </CardContent>
          </Card>
          <Card variant="filled" className="w-72 cursor-pointer" interactive>
            <CardHeader>
              <CardTitle>Filled Interactive</CardTitle>
              <CardDescription>Hover to see state change</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Filled card with interactive state layer.</p>
            </CardContent>
          </Card>
        </Showcase>
      </section>
    </div>
  );
}
