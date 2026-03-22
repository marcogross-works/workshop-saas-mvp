import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { addDays } from "date-fns"

import { TrialBanner } from "./TrialBanner"

const meta = {
  title: "Layout/TrialBanner",
  component: TrialBanner,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TrialBanner>

export default meta
type Story = StoryObj<typeof meta>

export const FullTrial: Story = {
  args: {
    trialEndsAt: addDays(new Date(), 14),
  },
}

export const HalfTrial: Story = {
  args: {
    trialEndsAt: addDays(new Date(), 7),
  },
}

export const AlmostExpired: Story = {
  args: {
    trialEndsAt: addDays(new Date(), 1),
  },
}
