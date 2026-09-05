---
name: shadcn
description: Official shadcn/ui AI skill for managing, styling, and composing accessible UI components with Tailwind CSS and Radix UI primitives, subordinated strictly to REMOTFIX Master Specifications and ADR-0004.
---

# shadcn/ui (Official AI Skill)

Framework guidance for building UI, components, and design systems. Components are added as source code to the project via the CLI.

> [!IMPORTANT]
> **REMOTFIX Governance Subordination:**
> - This skill is strictly subordinated to `docs/MASTER-SPEC-001-002.md` Section 4 (Design Tokens, Color Palettes, Wireframes) and approved ADR-0004 (Tailwind CSS + shadcn/ui).
> - **Current Repository Constraint:** `C:\SURAJ\Remotfix` currently has no application scaffold or `components.json`. Do NOT run `shadcn init` or scaffold dummy components in Phase 2. This skill serves as an authoritative pattern and composition reference until `apps/web` is formally created in subsequent implementation phases.

---

## Core Principles

1. **Use existing components first:** Check registries and installed components before writing custom UI.
2. **Compose, don't reinvent:** Settings page = Tabs + Card + form controls. Dashboard = Sidebar + Card + Chart + Table.
3. **Use built-in variants before custom styles:** Prefer `variant="outline"`, `size="sm"`, etc.
4. **Use semantic colors:** Use tokens such as `bg-primary`, `text-muted-foreground` — never raw arbitrary colors like `bg-blue-500`.

---

## Critical Rules

### 1. Styling & Tailwind
- **`className` for layout, not overriding styling:** Do not arbitrarily override base component colors or typography scales.
- **No `space-x-*` or `space-y-*`:** Use `flex` with `gap-*`. For vertical stacks, use `flex flex-col gap-*`.
- **Use `size-*` when width and height are equal:** Use `size-10` instead of `w-10 h-10`.
- **Use `truncate` shorthand:** Avoid `overflow-hidden text-ellipsis whitespace-nowrap`.
- **No manual `dark:` color overrides:** Rely on semantic CSS variable tokens (`bg-background`, `text-muted-foreground`).
- **Use `cn()` for conditional classes:** Do not construct manual template literal ternaries.
- **No manual `z-index` on overlay components:** Dialog, Sheet, Popover handle their own stacking contexts.

### 2. Forms & Inputs
- **Forms use `FieldGroup` + `Field`:** Never use raw `div` with `space-y-*` or `grid gap-*` for form layout.
- **`InputGroup` uses `InputGroupInput` / `InputGroupTextarea`:** Never raw `Input`/`Textarea` inside `InputGroup`.
- **Buttons inside inputs use `InputGroup` + `InputGroupAddon`.**
- **Option sets (2–7 choices) use `ToggleGroup`:** Avoid looping `Button` with manual active state.
- **`FieldSet` + `FieldLegend` for grouping related checkboxes/radios.**
- **Field validation uses `data-invalid` + `aria-invalid`:** `data-invalid` on `Field`, `aria-invalid` on the control. For disabled state: `data-disabled` on `Field`, `disabled` on the control.

### 3. Component Structure & Accessibility
- **Items always inside their Group:** `SelectItem` → `SelectGroup`. `DropdownMenuItem` → `DropdownMenuGroup`. `CommandItem` → `CommandGroup`.
- **Use `asChild` (Radix UI) for custom triggers.**
- **Dialog, Sheet, and Drawer always need a Title:** `DialogTitle`, `SheetTitle`, `DrawerTitle` are mandatory for WCAG accessibility. Use `className="sr-only"` if visually hidden.
- **Use full Card composition:** `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`.
- **Buttons do not use `isPending` / `isLoading` props:** Compose with a spinner icon, `data-icon`, and `disabled`.
- **`TabsTrigger` must reside inside `TabsList`:** Never render triggers directly in `Tabs`.
- **`Avatar` always requires `AvatarFallback`.**

### 4. Semantic Primitives
- **Callouts use `Alert`:** Avoid custom styled container divs.
- **Empty states use `Empty`.**
- **Dividers use `Separator`:** Avoid `<hr>` or `<div className="border-t">`.
- **Loading states use `Skeleton`:** Avoid custom `animate-pulse` divs.
- **Tags/Pills use `Badge`:** Avoid custom styled `<span>` tags.

### 5. Icons
- **Icons in `Button` use `data-icon`:** `data-icon="inline-start"` or `data-icon="inline-end"`.
- **No sizing classes on icons inside components:** Components handle icon sizing via CSS.
- **Pass icons as components/objects:** `icon={CheckIcon}`, never as string lookups.

---

## Standard Composition Pattern Examples

```tsx
// 1. Form layout with accessible validation
<FieldGroup>
  <Field data-invalid={Boolean(errors.email)}>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" aria-invalid={Boolean(errors.email)} />
    {errors.email && <FieldDescription>{errors.email.message}</FieldDescription>}
  </Field>
</FieldGroup>

// 2. Icon button composition
<Button variant="outline">
  <SearchIcon data-icon="inline-start" />
  Search Services
</Button>

// 3. Accessible Dialog Trigger
<Dialog>
  <DialogTrigger asChild>
    <Button>Request Immediate Session</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Technician Authorization Required</DialogTitle>
      <DialogDescription>
        Consent must be explicitly recorded before remote session initiation.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```
