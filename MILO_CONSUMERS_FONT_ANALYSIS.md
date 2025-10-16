# Milo Consumers - Font Loading Analysis

## 🔍 Are All Milo Consumers Affected?

**TL;DR:** Likely YES - All sites using **Milo's Global Navigation** are probably suffering from the same Phase E font loading violation.

---

## 📋 Known Milo Consumers

### Primary Milo Consumers (Confirmed)
1. **Adobe Express** (`express.adobe.com`)
   - Uses Milo Global Nav
   - TypeKit ID: `oln4yqj.css`
   - **Confirmed:** Font blocks LCP for 2,430ms (80% of LCP)

2. **Adobe.com Main** (`www.adobe.com`)
   - Uses Milo Global Nav
   - Same navigation framework
   - **Status:** Likely affected ⚠️

3. **Adobe Business** (`business.adobe.com`)
   - Uses Milo Global Nav
   - Enterprise-focused site
   - **Status:** Likely affected ⚠️

4. **Adobe Creative Cloud** (`creativecloud.adobe.com`)
   - Uses Milo Global Nav
   - Product marketing site
   - **Status:** Likely affected ⚠️

5. **Adobe Blog** (`blog.adobe.com`)
   - Uses Milo framework
   - May use different nav configuration
   - **Status:** Unknown

---

## 🔬 Evidence for Widespread Issue

### 1. Shared Code Path
All Milo consumers load the same Global Navigation block:
```javascript
// From Milo libs
import { loadBlock } from '/libs/blocks/global-navigation/global-navigation.js';
```

**Implication:** If Global Nav loads TypeKit in Phase E for Express, it loads it in Phase E for ALL consumers.

### 2. Milo Guidelines Are Universal
The E-L-D guidelines (`.cursor/rules/resource-loading-strategy.mdc`) apply to:
- ✅ "EVERY QUERY - CRITICAL PERFORMANCE RULE"
- ✅ Based on [AEM's performance guidelines](https://www.aem.live/developer/keeping-it-100)
- ✅ "Phase E: Fonts MUST be loaded in Phase L, NOT Phase E"

**Implication:** If Express violates these rules, other consumers likely do too (unless they've patched it).

### 3. Same TypeKit Project
Most Adobe sites use the same Adobe Clean font family from TypeKit:
- **Express:** `use.typekit.net/oln4yqj.css`
- **Adobe.com:** Likely same or similar TypeKit project
- **Business:** Likely same TypeKit project

**Implication:** Same font loading behavior across all sites.

---

## 🎯 Why This Hasn't Been Fixed

### Theory 1: Legacy Implementation
- Global Nav was built **before** E-L-D guidelines were established
- Guidelines were written **after** implementation
- No one has gone back to refactor Global Nav

### Theory 2: Brand Requirements Override Performance
- Adobe brand team mandates adobe-clean font
- Loading it early ensures consistent branding
- Performance concerns were deprioritized

### Theory 3: No One Has Measured Impact
- Font render delay is "invisible" in aggregate metrics
- Most teams look at total LCP, not breakdown by phase
- No one has run the detailed analysis we just did

### Theory 4: Different Teams, Siloed Knowledge
- Milo team owns Global Nav
- Express team can't modify Global Nav directly
- Guidelines exist but aren't enforced

---

## 📊 Expected Impact Across Milo Ecosystem

### If ALL Milo Consumers Are Affected

| Site | Current LCP (Est.) | Font Delay (Est.) | Potential LCP | Perf Gain |
|------|-------------------|-------------------|---------------|-----------|
| **Express** | 3.0s | 2,430ms | 0.6s | +6-7 pts |
| **Adobe.com** | 2.5-3.5s | ~2,000ms | 0.5-1.5s | +5-8 pts |
| **Business** | 2.8-3.8s | ~2,200ms | 0.6-1.6s | +5-7 pts |
| **CC Marketing** | 2.5-3.0s | ~2,000ms | 0.5-1.0s | +6-8 pts |

**Total Potential Impact:**
- **~2 seconds** average LCP improvement across all sites
- **5-8 points** Lighthouse score improvement
- **Millions of users** benefit from faster perceived load

---

## 🧪 How to Verify

### Test 1: Check Other Milo Sites
**Manual verification needed:**

1. Open Chrome DevTools → Performance
2. Visit each Milo consumer:
   - `https://www.adobe.com/`
   - `https://business.adobe.com/`
   - `https://creativecloud.adobe.com/`
3. Record page load
4. Check for:
   - TypeKit request timing
   - LCP element render delay
   - Font blocking behavior

**What to look for:**
- Does TypeKit load before LCP?
- What's the LCP breakdown (TTFB, Load Delay, Load Time, Render Delay)?
- Is Render Delay >1,000ms?

---

### Test 2: Check Lighthouse Reports
**Run PageSpeed Insights on:**
```
https://www.adobe.com/
https://business.adobe.com/
https://creativecloud.adobe.com/
https://express.adobe.com/
```

**Compare LCP Breakdowns:**
- If all show high Render Delay, it's widespread
- If Express is unique, it's a local issue

---

### Test 3: Inspect Milo Global Nav Source
**Check the actual Milo implementation:**

```bash
# Clone Milo repo (if we have access)
git clone https://github.com/adobecom/milo.git
cd milo/libs/blocks/global-navigation/

# Search for TypeKit loading
grep -r "typekit" .
grep -r "use.typekit.net" .
grep -r "font" global-navigation.js
```

**What to look for:**
- Where TypeKit is loaded
- Is it in Phase E or Phase L?
- Is there any font optimization?

---

## 💡 What This Means for Express

### If It's Widespread (Most Likely)

**Pros:**
- ✅ Not Express's fault - it's a Milo issue
- ✅ Fixing it for Express can lead Milo team
- ✅ Demonstrates value of performance analysis
- ✅ Can influence Milo roadmap

**Cons:**
- ❌ Express can't fix it in Global Nav directly
- ❌ Requires coordination with Milo team
- ❌ Other teams may resist change

**Strategy:**
1. Implement Express-only override (DOM interception)
2. Measure and document gains
3. Present findings to Milo team
4. Push for Global Nav fix that benefits all consumers

---

### If It's Express-Specific (Less Likely)

**Pros:**
- ✅ Express has control to fix it
- ✅ No dependency on other teams
- ✅ Can implement immediately

**Cons:**
- ❌ Need to investigate why Express is different
- ❌ May indicate other issues

**Strategy:**
1. Investigate Express-specific configuration
2. Check if custom nav overrides exist
3. Fix in Express codebase directly

---

## 🎯 Recommended Next Steps

### Step 1: Quick Verification (1 hour)
Run Lighthouse on 3-5 Milo consumers and compare LCP breakdowns:
```bash
# Express (confirmed)
lighthouse https://express.adobe.com/ --only-categories=performance

# Adobe.com main
lighthouse https://www.adobe.com/ --only-categories=performance

# Business
lighthouse https://business.adobe.com/ --only-categories=performance

# Creative Cloud
lighthouse https://creativecloud.adobe.com/ --only-categories=performance
```

**Look for:** Render Delay in LCP breakdown

---

### Step 2: Document Findings (2 hours)
Create comparison table showing:
- LCP breakdown for each site
- Font load timing
- Performance scores
- Commonalities

---

### Step 3: Reach Out to Milo Team (1 day)
**If widespread:**
- Share analysis
- Propose Phase L font loading
- Offer to help implement
- Request timeline for fix

**If Express-specific:**
- Investigate configuration differences
- Fix in Express codebase

---

### Step 4: Implement Express Override (1 week)
**Don't wait for Milo fix:**
- Implement DOM interception solution
- Test thoroughly
- Deploy to staging
- Measure real-world impact

**Rationale:** Even if it's widespread, Express can lead with a solution and prove the value.

---

## 📝 Questions to Answer

1. **Do all Milo consumers load TypeKit in Phase E?**
   - ⏳ Needs verification via Lighthouse testing

2. **Is there a way to configure Global Nav font loading?**
   - ⏳ Needs Milo documentation review

3. **Have other teams complained about this?**
   - ⏳ Check Milo GitHub issues / Slack channels

4. **Is there a roadmap item to fix this?**
   - ⏳ Contact Milo team directly

5. **Can Express override Global Nav behavior?**
   - ✅ **YES** - via DOM interception (demonstrated in our analysis)

---

## 🚀 Express's Opportunity

### Lead the Fix
**Express can be the first to:**
1. Identify and quantify the problem
2. Implement a working solution
3. Demonstrate 2.4s LCP improvement
4. Share findings with Milo team
5. Influence platform-wide improvement

### Impact
- **Direct:** Fix Express performance (-2.4s LCP)
- **Indirect:** Improve ALL Milo consumers
- **Strategic:** Position Express as performance leader

---

## 📚 Resources for Investigation

### Milo GitHub
- Repo: https://github.com/adobecom/milo
- Issues: Check for font-related issues
- PRs: Look for recent performance work

### AEM/Franklin Docs
- Performance guide: https://www.aem.live/developer/keeping-it-100
- Font loading best practices

### Adobe Internal
- Milo Slack channels
- Performance working groups
- Architecture discussions

---

## 🎓 Key Takeaways

1. **Likely widespread** - All Milo consumers probably affected
2. **Easily verifiable** - Run Lighthouse on 3-5 sites
3. **Express can lead** - Implement override, prove value
4. **Platform opportunity** - Fix benefits entire Adobe web ecosystem
5. **2.4s per page** - Massive UX improvement for millions of users

**Next Action:** Run verification tests on other Milo consumers to confirm hypothesis.

