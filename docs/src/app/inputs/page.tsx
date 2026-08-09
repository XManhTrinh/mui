"use client";

import * as React from "react";
import {
  TextField,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Slider,
  Search,
  Icon,
} from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function InputsPage() {
  const [checkboxChecked, setCheckboxChecked] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState("option1");
  const [switchOn, setSwitchOn] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(50);
  const [discreteSlider, setDiscreteSlider] = React.useState(3);
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Inputs
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Input components allow users to enter and edit information in forms and
          interfaces.
        </p>
      </div>

      {/* Text Fields */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">TextField</h2>

        <Showcase title="Outlined TextField">
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <TextField variant="outlined" label="Label" />
            <TextField variant="outlined" label="With Value" defaultValue="Hello world" />
            <TextField variant="outlined" label="Disabled" disabled defaultValue="Disabled" />
          </div>
        </Showcase>

        <Showcase title="Filled TextField">
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <TextField variant="filled" label="Label" />
            <TextField variant="filled" label="With Value" defaultValue="Hello world" />
            <TextField variant="filled" label="Disabled" disabled />
          </div>
        </Showcase>

        <Showcase title="TextField with Icons">
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <TextField
              variant="outlined"
              label="Search"
              leadingIcon={<Icon name="search" />}
            />
            <TextField
              variant="outlined"
              label="Password"
              type="password"
              trailingIcon={<Icon name="visibility_off" />}
            />
            <TextField
              variant="outlined"
              label="Email"
              leadingIcon={<Icon name="mail" />}
              trailingIcon={<Icon name="check_circle" />}
            />
          </div>
        </Showcase>

        <Showcase title="TextField States">
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <TextField
              variant="outlined"
              label="Error State"
              error
              errorText="This field is required"
              defaultValue=""
            />
            <TextField
              variant="outlined"
              label="With Supporting Text"
              supportingText="Enter your full name"
            />
            <TextField
              variant="outlined"
              label="With Prefix"
              prefix="$"
              defaultValue="100.00"
            />
          </div>
        </Showcase>
      </section>

      {/* Checkbox */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Checkbox</h2>

        <Showcase title="Checkbox States">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-1">
              <Checkbox
                checked={checkboxChecked}
                onCheckedChange={(v) => setCheckboxChecked(v === true)}
              />
              <span className="text-sm">Default</span>
            </label>
            <label className="flex items-center gap-1">
              <Checkbox checked={true} />
              <span className="text-sm">Checked</span>
            </label>
            <label className="flex items-center gap-1">
              <Checkbox indeterminate />
              <span className="text-sm">Indeterminate</span>
            </label>
            <label className="flex items-center gap-1">
              <Checkbox disabled />
              <span className="text-sm">Disabled</span>
            </label>
            <label className="flex items-center gap-1">
              <Checkbox disabled checked={true} />
              <span className="text-sm">Disabled Checked</span>
            </label>
          </div>
        </Showcase>
      </section>

      {/* Radio */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Radio &amp; RadioGroup</h2>

        <Showcase title="RadioGroup">
          <RadioGroup value={radioValue} onValueChange={setRadioValue}>
            <label className="flex items-center gap-1">
              <Radio value="option1" />
              <span className="text-sm">Option 1</span>
            </label>
            <label className="flex items-center gap-1">
              <Radio value="option2" />
              <span className="text-sm">Option 2</span>
            </label>
            <label className="flex items-center gap-1">
              <Radio value="option3" />
              <span className="text-sm">Option 3</span>
            </label>
            <label className="flex items-center gap-1">
              <Radio value="option4" disabled />
              <span className="text-sm">Option 4 (disabled)</span>
            </label>
          </RadioGroup>
        </Showcase>
      </section>

      {/* Switch */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Switch</h2>

        <Showcase title="Switch Variants">
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2">
              <Switch
                checked={switchOn}
                onCheckedChange={setSwitchOn}
              />
              <span className="text-sm">Default Switch</span>
            </label>
            <label className="flex items-center gap-2">
              <Switch checked={true} />
              <span className="text-sm">On</span>
            </label>
            <label className="flex items-center gap-2">
              <Switch checked={false} />
              <span className="text-sm">Off</span>
            </label>
            <label className="flex items-center gap-2">
              <Switch disabled />
              <span className="text-sm">Disabled Off</span>
            </label>
            <label className="flex items-center gap-2">
              <Switch disabled checked={true} />
              <span className="text-sm">Disabled On</span>
            </label>
          </div>
        </Showcase>

        <Showcase title="Switch with Icons">
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2">
              <Switch checked={true} showIcons />
              <span className="text-sm">With Icons (On)</span>
            </label>
            <label className="flex items-center gap-2">
              <Switch checked={false} showIcons />
              <span className="text-sm">With Icons (Off)</span>
            </label>
          </div>
        </Showcase>
      </section>

      {/* Slider */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Slider</h2>

        <Showcase title="Continuous Slider">
          <div className="w-full max-w-md space-y-4">
            <div>
              <label className="text-sm text-surface-variant-foreground mb-1 block">
                Volume: {sliderValue}
              </label>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                min={0}
                max={100}
              />
            </div>
          </div>
        </Showcase>

        <Showcase title="Discrete Slider">
          <div className="w-full max-w-md space-y-4">
            <div>
              <label className="text-sm text-surface-variant-foreground mb-1 block">
                Rating: {discreteSlider}
              </label>
              <Slider
                value={discreteSlider}
                onValueChange={setDiscreteSlider}
                min={1}
                max={5}
                step={1}
                showStops
                showValueIndicator
              />
            </div>
          </div>
        </Showcase>
      </section>

      {/* Search */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Search</h2>

        <Showcase title="Search Bar">
          <div className="w-full max-w-md">
            <Search
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Search components..."
            />
          </div>
        </Showcase>
      </section>

      {/* Props Table */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">TextField Props</h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Prop</th>
                <th className="text-left px-4 py-2 font-medium">Type</th>
                <th className="text-left px-4 py-2 font-medium">Default</th>
                <th className="text-left px-4 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr>
                <td className="px-4 py-2 font-mono text-xs">variant</td>
                <td className="px-4 py-2 font-mono text-xs">{`"filled" | "outlined"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"outlined"`}</td>
                <td className="px-4 py-2">Visual variant of the text field</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">label</td>
                <td className="px-4 py-2 font-mono text-xs">string</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Floating label text</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">error</td>
                <td className="px-4 py-2 font-mono text-xs">boolean</td>
                <td className="px-4 py-2 font-mono text-xs">false</td>
                <td className="px-4 py-2">Error state styling</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">errorText</td>
                <td className="px-4 py-2 font-mono text-xs">string</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Error message text</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">supportingText</td>
                <td className="px-4 py-2 font-mono text-xs">string</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Helper text below the field</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">leadingIcon</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Icon displayed before input</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">trailingIcon</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Icon displayed after input</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
