"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Icon, Chip, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";

export default function CardsPage() {
  // Playground state
  const [pgVariant, setPgVariant] = React.useState<"elevated" | "filled" | "outlined">("elevated");
  const [pgInteractive, setPgInteractive] = React.useState(false);

  const pgCode = `<Card variant="${pgVariant}"${pgInteractive ? " interactive" : ""}>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>Content goes here</CardContent>
</Card>`;

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

      {/* Interactive Playground */}
      <Playground
        title="Playground"
        code={pgCode}
        controls={
          <>
            <div>
              <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Variant</span>
              <div className="flex flex-wrap gap-1">
                {(["elevated", "filled", "outlined"] as const).map((v) => (
                  <Chip key={v} variant="filter" selected={pgVariant === v} onClick={() => setPgVariant(v)}>
                    {v}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Interactive</span>
                <Switch checked={pgInteractive} onCheckedChange={setPgInteractive} />
              </label>
            </div>
          </>
        }
      >
        <Card variant={pgVariant} className="w-72" interactive={pgInteractive}>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">This is the card content area.</p>
          </CardContent>
          <CardFooter>
            <Button variant="text">Action</Button>
          </CardFooter>
        </Card>
      </Playground>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Variants</h2>
        <Showcase title="Elevated Card" code={`<Card variant="elevated">\n  <CardHeader>\n    <CardTitle>Elevated Card</CardTitle>\n  </CardHeader>\n</Card>`}>
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
        <Showcase title="Filled Card" code={`<Card variant="filled">\n  <CardHeader>\n    <CardTitle>Filled Card</CardTitle>\n  </CardHeader>\n</Card>`}>
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
        <Showcase title="Outlined Card" code={`<Card variant="outlined">\n  <CardHeader>\n    <CardTitle>Outlined Card</CardTitle>\n  </CardHeader>\n</Card>`}>
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
        <Showcase title="Clickable Cards" code={`<Card variant="elevated" interactive>\n  <CardHeader>\n    <CardTitle>Interactive Card</CardTitle>\n  </CardHeader>\n</Card>`}>
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
