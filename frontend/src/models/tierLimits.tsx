export const tierLessonLimits: Record<Tier, number> = {
    Free: 5,
    Professional: 15,
    Ultimate: Number.MAX_SAFE_INTEGER
};

export type Tier = "Free" | "Professional" | "Ultimate";