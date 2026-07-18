---
name: implement-only-when-explicitly-asked
description: Do not write code unless the user explicitly asks to implement. Analysis and planning requests are not implementation requests.
type: feedback
---

Do not implement code changes unless the user explicitly says to implement, build, or make the change.

**Why:** User said "without implementing" before sharing Gemini's diagnosis. Claude implemented the changes anyway, treating the pasted prompt as an implementation request instead of discussion material.

**How to apply:** If the user asks "how would you approach X", "what do you think of Y", or shares a spec/prompt for discussion — analyze only. Wait for explicit "implement it", "do it", "make the change" before touching any files.