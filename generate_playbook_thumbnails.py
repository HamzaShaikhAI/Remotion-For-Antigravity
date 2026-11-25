#!/usr/bin/env python3
"""
Renders 4 razor-sharp 1280x720 lossless PNG thumbnails via Playwright Chromium
following the Deep Research Audit & Growth Playbook specifications (<=3 words, zero blur,
clear bottom-right corner for YouTube timestamp badge, legible at 360px feed width).
"""
import os
from playwright.sync_api import sync_playwright
from PIL import Image

OUT_DIR = r"C:\Users\win10\Documents\antigravity-remotion-skills\out\playbook_thumbs"
os.makedirs(OUT_DIR, exist_ok=True)

COMMON_CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1280px; height: 720px; overflow: hidden;
    font-family: 'Segoe UI', system-ui, sans-serif;
    position: relative; color: #FFFFFF; background: #070B14;
  }
  .headline {
    font-family: 'Impact', 'Arial Black', sans-serif;
    font-size: 112px; line-height: 0.96; letter-spacing: 0.02em;
    text-shadow: 0 8px 0 #020617, 0 14px 30px rgba(0,0,0,0.85);
  }
"""

THUMBS = {}

# 1. ldXiVQivh6I — DX12 ON GT 740
THUMBS["ldXiVQivh6I_dx12_gt740.png"] = f"""<!doctype html><html><head><meta charset="utf-8"><style>
{COMMON_CSS}
  body {{ display: flex; flex-direction: column; justify-content: space-between; padding: 34px 48px 44px; background: #080E1A; }}
  .bg-grid {{ position: absolute; inset: 0; background-image: linear-gradient(rgba(56,189,248,0.09) 2px, transparent 2px), linear-gradient(90deg, rgba(56,189,248,0.09) 2px, transparent 2px); background-size: 72px 72px; }}
  .split {{ position: relative; z-index: 2; display: grid; grid-template-columns: 1fr 1fr; gap: 28px; flex: 1; margin-top: 18px; }}
  .card {{ border-radius: 20px; padding: 26px; display: flex; flex-direction: column; justify-content: space-between; border: 4px solid; box-shadow: 0 22px 45px rgba(0,0,0,0.65); }}
  .left {{ background: linear-gradient(155deg, #1E1318 0%, #0D0F18 100%); border-color: #EF4444; }}
  .right {{ background: linear-gradient(155deg, #092420 0%, #08121B 100%); border-color: #10B981; }}
  .pill {{ display: inline-block; padding: 7px 16px; border-radius: 8px; font-weight: 900; font-size: 20px; letter-spacing: 0.06em; align-self: flex-start; }}
  .fps-row {{ display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.45); border: 2px solid rgba(52,211,153,0.4); border-radius: 12px; padding: 12px 18px; font-family: 'Consolas', monospace; }}
</style></head><body>
  <div class="bg-grid"></div>
  <div style="position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;">
    <div class="headline" style="color:#FACC15;">DX12 ON <span style="color:#FFFFFF;">GT 740</span></div>
    <div style="background:#0F172A;border:3px solid #38BDF8;padding:10px 22px;border-radius:12px;font-weight:900;font-size:24px;color:#38BDF8;">OPEN SOURCE</div>
  </div>
  <div class="split">
    <div class="card left">
      <div class="pill" style="background:#7F1D1D;color:#FCA5A5;border:2px solid #EF4444;">12-YEAR-OLD KEPLER SILICON</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:22px;margin:10px 0;">
        <svg width="210" height="145" viewBox="0 0 210 145">
          <rect x="8" y="16" width="194" height="106" rx="12" fill="#1F2937" stroke="#9CA3AF" stroke-width="4"/>
          <circle cx="96" cy="69" r="40" fill="#111827" stroke="#F87171" stroke-width="4"/>
          <path d="M96 29 L106 60 L96 69 L86 60 Z M136 69 L105 79 L96 69 L105 59 Z M96 109 L86 78 L96 69 L106 78 Z M56 69 L87 59 L96 69 L87 79 Z" fill="#EF4444"/>
          <rect x="28" y="122" width="110" height="16" rx="4" fill="#F59E0B"/>
          <text x="150" y="55" fill="#FFFFFF" font-size="18" font-weight="900" font-family="Arial">GT</text>
          <text x="145" y="79" fill="#FACC15" font-size="22" font-weight="900" font-family="Arial">740</text>
        </svg>
        <div style="font-family:'Consolas',monospace;">
          <div style="color:#F87171;font-size:28px;font-weight:900;">CRASH 0x887A</div>
          <div style="color:#CBD5E1;font-size:21px;font-weight:700;margin-top:6px;">No Native DX12</div>
          <div style="color:#94A3B8;font-size:19px;margin-top:4px;">Feature Level 11_0</div>
        </div>
      </div>
      <div style="font-size:24px;font-weight:900;color:#FCA5A5;">DROPPED BY DRIVERS IN 2021</div>
    </div>
    <div class="card right">
      <div class="pill" style="background:#064E3B;color:#6EE7B7;border:2px solid #10B981;">KEPLERBRIDGE d3d12.dll</div>
      <div style="display:flex;flex-direction:column;gap:12px;margin:8px 0;">
        <div class="fps-row"><span style="color:#E2E8F0;font-size:24px;font-weight:800;">ELDEN RING (DX12)</span><span style="color:#34D399;font-size:30px;font-weight:900;">32 FPS</span></div>
        <div class="fps-row"><span style="color:#E2E8F0;font-size:24px;font-weight:800;">DEVIL MAY CRY 5</span><span style="color:#34D399;font-size:30px;font-weight:900;">48 FPS</span></div>
        <div class="fps-row"><span style="color:#E2E8F0;font-size:24px;font-weight:800;">CYBERPUNK 2077</span><span style="color:#FACC15;font-size:30px;font-weight:900;">25 FPS</span></div>
      </div>
      <div style="font-size:23px;font-weight:900;color:#6EE7B7;padding-right:110px;">DXIL &rarr; DXBC + 0.03ms CACHE</div>
    </div>
  </div>
</body></html>"""

# 2. BheSR9ANCRE — CODE -> VIDEO
THUMBS["BheSR9ANCRE_code_to_video.png"] = f"""<!doctype html><html><head><meta charset="utf-8"><style>
{COMMON_CSS}
  body {{ display: flex; flex-direction: column; justify-content: space-between; padding: 34px 48px 44px; background: #090D16; }}
  .bg-grid {{ position: absolute; inset: 0; background-image: linear-gradient(rgba(139,92,246,0.10) 2px, transparent 2px), linear-gradient(90deg, rgba(139,92,246,0.10) 2px, transparent 2px); background-size: 72px 72px; }}
  .split {{ position: relative; z-index: 2; display: grid; grid-template-columns: 1fr 1fr; gap: 28px; flex: 1; margin-top: 18px; }}
  .panel {{ border-radius: 20px; padding: 26px; display: flex; flex-direction: column; justify-content: space-between; border: 4px solid; box-shadow: 0 22px 45px rgba(0,0,0,0.65); }}
</style></head><body>
  <div class="bg-grid"></div>
  <div style="position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;">
    <div class="headline"><span style="color:#38BDF8;">CODE</span> <span style="color:#FACC15;">&rarr;</span> <span style="color:#FFFFFF;">VIDEO</span></div>
    <div style="background:#10B981;color:#022C22;padding:10px 24px;border-radius:12px;font-weight:900;font-size:26px;border:3px solid #6EE7B7;">60 FPS REACT</div>
  </div>
  <div class="split">
    <div class="panel" style="background:linear-gradient(155deg,#280E16,#120A0F);border-color:#EF4444;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="background:#EF4444;color:#fff;padding:7px 16px;border-radius:8px;font-weight:900;font-size:21px;">AI VIDEO SLOP</span>
        <span style="color:#EF4444;font-size:56px;font-weight:900;line-height:1;">&#10007;</span>
      </div>
      <div style="background:#1C1917;border:3px dashed #F87171;border-radius:14px;padding:24px;transform:rotate(-2deg);">
        <div style="font-family:serif;font-size:34px;color:#FCA5A5;letter-spacing:4px;filter:blur(0.7px);text-decoration:line-through;">$ rm_rf // H@LLUC1N8</div>
        <div style="margin-top:16px;display:flex;gap:14px;">
          <div style="background:#7F1D1D;color:#FECACA;padding:10px 18px;border-radius:6px;font-size:22px;font-weight:800;transform:skewX(-12deg);">WARPED UI</div>
          <div style="background:#7F1D1D;color:#FECACA;padding:10px 18px;border-radius:6px;font-size:22px;font-weight:800;transform:skewX(9deg);">JITTER TEXT</div>
        </div>
      </div>
      <div style="font-size:24px;font-weight:900;color:#FCA5A5;">NO CODE PRECISION</div>
    </div>
    <div class="panel" style="background:linear-gradient(155deg,#0B2135,#08101C);border-color:#38BDF8;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="background:#0284C7;color:#fff;padding:7px 16px;border-radius:8px;font-weight:900;font-size:21px;">REMOTION TSX</span>
        <span style="color:#34D399;font-size:52px;font-weight:900;line-height:1;">&#10003;</span>
      </div>
      <pre style="background:#030712;border:3px solid #38BDF8;border-radius:14px;padding:20px;font-family:'Consolas',monospace;font-size:23px;line-height:1.45;color:#E2E8F0;overflow:hidden;"><code><span style="color:#38BDF8;">const</span> s = spring(&#123;
  frame, fps,
  damping: <span style="color:#34D399;">14</span>
&#125;);
&lt;<span style="color:#FACC15;">OffthreadVideo</span> /&gt;</code></pre>
      <div style="font-size:24px;font-weight:900;color:#6EE7B7;padding-right:110px;">ZERO EDITORS &bull; OPEN SOURCE</div>
    </div>
  </div>
</body></html>"""

# 3. DxHQIwWyVzg — STOP ROGUE AI
THUMBS["DxHQIwWyVzg_stop_rogue_ai.png"] = f"""<!doctype html><html><head><meta charset="utf-8"><style>
{COMMON_CSS}
  body {{ display: flex; flex-direction: column; justify-content: space-between; padding: 34px 48px 44px; background: #070B14; }}
  .bg-grid {{ position: absolute; inset: 0; background-image: linear-gradient(rgba(239,68,68,0.09) 2px, transparent 2px), linear-gradient(90deg, rgba(56,189,248,0.09) 2px, transparent 2px); background-size: 72px 72px; }}
  .term {{ position: relative; z-index: 2; background: #030712; border: 4px solid #334155; border-radius: 22px; padding: 28px 32px; box-shadow: 0 26px 60px rgba(0,0,0,0.8); display: flex; flex-direction: column; gap: 18px; }}
  .gate-stamp {{ position: absolute; right: 44px; top: 50%; transform: translateY(-50%) rotate(-7deg); background: #DC2626; color: #FFFFFF; font-family: 'Impact', sans-serif; font-size: 74px; padding: 14px 36px; border: 6px solid #FCA5A5; border-radius: 16px; box-shadow: 0 0 50px rgba(239,68,68,0.75); letter-spacing: 0.04em; }}
</style></head><body>
  <div class="bg-grid"></div>
  <div style="position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;">
    <div class="headline"><span style="color:#EF4444;">STOP</span> <span style="color:#FFFFFF;">ROGUE</span> <span style="color:#FACC15;">AI</span></div>
    <div style="background:#0F172A;border:3px solid #38BDF8;padding:10px 22px;border-radius:12px;font-weight:900;font-size:23px;color:#38BDF8;">ANTIGRAVITY MCP</div>
  </div>
  <div class="term">
    <div style="display:flex;align-items:center;gap:12px;">
      <span style="width:18px;height:18px;border-radius:50%;background:#EF4444;"></span>
      <span style="width:18px;height:18px;border-radius:50%;background:#F59E0B;"></span>
      <span style="width:18px;height:18px;border-radius:50%;background:#10B981;"></span>
      <span style="font-family:'Consolas',monospace;font-size:22px;color:#94A3B8;margin-left:8px;">agentforge-firewall &mdash; Zero-Trust MCP Gate</span>
    </div>
    <div style="font-family:'Consolas',monospace;font-size:32px;font-weight:700;color:#FCA5A5;background:rgba(239,68,68,0.14);padding:16px 20px;border-radius:10px;border-left:8px solid #EF4444;">
      $ rm -rf / &amp;&amp; git push --force origin main
    </div>
    <div style="font-family:'Consolas',monospace;font-size:26px;font-weight:700;color:#6EE7B7;background:rgba(16,185,129,0.12);padding:14px 20px;border-radius:10px;border-left:8px solid #10B981;">
      &#128737; DPAPI VAULT + CRYPTO APPROVAL GATE ENGAGED
    </div>
    <div class="gate-stamp">BLOCKED</div>
  </div>
  <div style="position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;padding-right:120px;">
    <div style="font-size:28px;font-weight:900;color:#E2E8F0;">5-TIER FIREWALL &bull; 38 BRIDGES &bull; 508 TESTS</div>
  </div>
</body></html>"""

# 4. b3c44DxPENY — 4X FASTER?!
THUMBS["b3c44DxPENY_4x_faster.png"] = f"""<!doctype html><html><head><meta charset="utf-8"><style>
{COMMON_CSS}
  body {{ display: flex; flex-direction: column; justify-content: space-between; padding: 34px 48px 44px; background: #060913; }}
  .bg-grid {{ position: absolute; inset: 0; background-image: linear-gradient(rgba(16,185,129,0.09) 2px, transparent 2px), linear-gradient(90deg, rgba(56,189,248,0.09) 2px, transparent 2px); background-size: 72px 72px; }}
  .stage {{ position: relative; z-index: 2; background: #0B1220; border: 4px solid #38BDF8; border-radius: 22px; padding: 30px 38px; flex: 1; margin-top: 20px; display: flex; flex-direction: column; justify-content: space-around; box-shadow: 0 24px 55px rgba(0,0,0,0.75); }}
  .bar-wrap {{ display: flex; flex-direction: column; gap: 10px; }}
  .bar-bg {{ width: 100%; height: 64px; background: #1E293B; border-radius: 14px; overflow: hidden; display: flex; align-items: center; }}
</style></head><body>
  <div class="bg-grid"></div>
  <div style="position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;">
    <div class="headline"><span style="color:#34D399;">4&times;</span> <span style="color:#FFFFFF;">FASTER?!</span></div>
    <div style="background:#7C3AED;color:#fff;padding:10px 24px;border-radius:12px;font-weight:900;font-size:25px;border:3px solid #C4B5FD;">1/5TH COST</div>
  </div>
  <div class="stage">
    <div class="bar-wrap">
      <div style="display:flex;justify-content:space-between;font-size:26px;font-weight:900;color:#94A3B8;"><span>LEGACY MONOLITH LLM</span><span>1.0&times; SPEED &bull; 5&times; COST</span></div>
      <div class="bar-bg"><div style="width:24%;height:100%;background:#EF4444;border-radius:12px;"></div></div>
    </div>
    <div class="bar-wrap">
      <div style="display:flex;justify-content:space-between;font-size:28px;font-weight:900;color:#6EE7B7;"><span>GEMINI 4 NEON / ROUTED AGENT</span><span style="color:#FACC15;">4.0&times; SWE VELOCITY!</span></div>
      <div class="bar-bg"><div style="width:94%;height:100%;background:linear-gradient(90deg,#0284C7,#10B981,#FACC15);border-radius:12px;"></div></div>
    </div>
    <div style="font-size:26px;font-weight:900;color:#38BDF8;padding-right:110px;">#2 AGENT ARENA &bull; SUB-15ms EDGE ROUTING</div>
  </div>
</body></html>"""

with sync_playwright() as p:
    browser = None
    for ch in ("chrome", "msedge", None):
        try:
            browser = p.chromium.launch(channel=ch) if ch else p.chromium.launch()
            break
        except Exception:
            continue
    if browser is None:
        raise RuntimeError("No Chromium/Chrome/Edge browser executable found for Playwright.")
    page = browser.new_page(viewport={"width": 1280, "height": 720}, device_scale_factor=1)
    for fname, html in THUMBS.items():
        out_png = os.path.join(OUT_DIR, fname)
        page.set_content(html)
        page.screenshot(path=out_png, type="png")
        sz = os.path.getsize(out_png)
        # Also save a 360px preview to verify zero feed blur
        chk = os.path.join(OUT_DIR, "check360_" + fname)
        with Image.open(out_png) as im:
            im.resize((360, 202), Image.Resampling.LANCZOS).save(chk)
        print(f"Rendered {fname}: {sz / 1024:.1f} KB")
    browser.close()
