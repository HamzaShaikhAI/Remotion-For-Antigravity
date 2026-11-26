#!/usr/bin/env python3
"""
Captures authentic interactive browser screencasts via Chrome DevTools Protocol (CDP)
or paced PNG bursts -> H.264 MP4 using Remotion's bundled ffmpeg-static binary.
"""
import os
import time
import shutil
import threading
import subprocess
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from playwright.sync_api import sync_playwright

SITE_DIR = r"C:\Users\win10\develop\hamzashaikhai.com"
OUT_DIR = r"C:\Users\win10\Documents\antigravity-remotion-skills\public\clips\hybrid_captures"
TMP_FRAMES = os.path.join(OUT_DIR, "_tmp_frames")
os.makedirs(OUT_DIR, exist_ok=True)

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

handler = partial(QuietHandler, directory=SITE_DIR)
srv = ThreadingHTTPServer(("127.0.0.1", 0), handler)
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
base_url = f"http://127.0.0.1:{port}"

def launch_browser(p):
    for ch in ("chrome", "msedge", None):
        try:
            return p.chromium.launch(channel=ch) if ch else p.chromium.launch()
        except Exception:
            continue
    raise RuntimeError("No Chromium browser found")

MOBILE_WIDTH = 430
MOBILE_HEIGHT = 932
MOBILE_DPR = 2
OUT_WIDTH = MOBILE_WIDTH * MOBILE_DPR   # 860
OUT_HEIGHT = MOBILE_HEIGHT * MOBILE_DPR # 1864

def capture_sequence(page, name, steps_fn):
    fdir = os.path.join(TMP_FRAMES, name)
    if os.path.exists(fdir):
        shutil.rmtree(fdir)
    os.makedirs(fdir, exist_ok=True)
    idx = [0]

    def snap():
        p = os.path.join(fdir, f"f_{idx[0]:04d}.png")
        page.screenshot(path=p, type="png")
        idx[0] += 1

    # Wrap action callbacks to take real crisp PNG snapshots at 8fps during live interaction
    steps_fn(snap)

    mp4_out = os.path.join(OUT_DIR, f"{name}.mp4")
    # Convert 8fps Retina mobile frames (430x932 @2x = 860x1864) -> crisp 30fps portrait H.264 MP4
    subprocess.run(
        [
            "node", "-e",
            f"const ff=require('ffmpeg-static'); require('child_process').execFileSync(ff,['-y','-framerate','8','-i',{os.path.join(fdir, 'f_%04d.png')!r},'-vf','scale={OUT_WIDTH}:{OUT_HEIGHT}:flags=lanczos,fps=30','-c:v','libx264','-pix_fmt','yuv420p','-crf','18',{mp4_out!r}],{{stdio:'inherit'}});"
        ],
        cwd=r"C:\Users\win10\Documents\antigravity-remotion-skills",
        check=True,
    )
    shutil.rmtree(fdir, ignore_errors=True)
    print(f"Captured {mp4_out} ({OUT_WIDTH}x{OUT_HEIGHT} from 430x932 mobile viewport, {idx[0]} frames)")

def burst(snap, count=14, dt=0.10):
    for _ in range(count):
        snap()
        time.sleep(dt)

with sync_playwright() as p:
    browser = launch_browser(p)
    ctx = browser.new_context(
        viewport={"width": MOBILE_WIDTH, "height": MOBILE_HEIGHT},
        device_scale_factor=MOBILE_DPR,
        is_mobile=True,
        has_touch=True,
    )
    pg = ctx.new_page()

    # 1. KeplerBridge live benchmark explorer interactions at mobile width (430x932)
    pg.goto(f"{base_url}/keplerbridge/", wait_until="networkidle")
    pg.locator("#benchmark-explorer").scroll_into_view_if_needed()
    def step_kepler(snap):
        burst(snap, 16)
        pg.locator(".kb-gpu-btn[data-gpu='gtx750ti']").scroll_into_view_if_needed()
        pg.locator(".kb-gpu-btn[data-gpu='gtx750ti']").click()
        burst(snap, 16)
        pg.locator(".kb-gpu-btn[data-gpu='gtx780ti']").click()
        burst(snap, 16)
        pg.locator("#kbGameFilter").fill("Elden")
        burst(snap, 16)
        pg.locator("#kbGameFilter").fill("Palworld")
        burst(snap, 18)
        pg.locator("#kbGameFilter").fill("")
        burst(snap, 16)
    capture_sequence(pg, "kepler_explorer_capture", step_kepler)

    # 2. REA 1-Click Template Gallery interactions at mobile width (430x932)
    pg.goto(f"{base_url}/remotion/", wait_until="networkidle")
    pg.locator("#rea-gallery").scroll_into_view_if_needed()
    def step_rea(snap):
        burst(snap, 16)
        pg.locator(".rea-filter-btn[data-cat='shorts']").scroll_into_view_if_needed()
        pg.locator(".rea-filter-btn[data-cat='shorts']").click()
        burst(snap, 16)
        pg.locator(".rea-filter-btn[data-cat='hybrid']").click()
        burst(snap, 16)
        pg.locator(".rea-filter-btn[data-cat='all']").click()
        burst(snap, 16)
        pg.locator(".rea-copy-btn").first.scroll_into_view_if_needed()
        pg.locator(".rea-copy-btn").first.click()
        burst(snap, 20)
    capture_sequence(pg, "rea_gallery_capture", step_rea)

    # 3. AgentForge Architecture Portal live scroll capture at mobile width (430x932)
    pg.goto(f"{base_url}/agentforge/", wait_until="networkidle")
    def step_af(snap):
        for y in (0, 260, 560, 880, 1200, 1520):
            pg.evaluate(f"window.scrollTo(0, {y})")
            burst(snap, 14)
    capture_sequence(pg, "agentforge_portal_capture", step_af)

    browser.close()

shutil.rmtree(TMP_FRAMES, ignore_errors=True)
srv.shutdown()
print("Done!")
