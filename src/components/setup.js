// ── SETUP SCREEN (first-time store name entry) ──
import { t } from '../utils/i18n.js'

export function renderSetupScreen() {
  return `
  <div class="setup-screen">
    <div class="setup-card">
      <div style="font-size:60px;margin-bottom:18px">🏪</div>
      <h1 style="font-size:23px;font-weight:700;margin-bottom:6px;color:var(--text)">${t('setupTitle')}</h1>
      <p style="font-size:14px;color:var(--text3);margin-bottom:22px">${t('setupSub')}</p>
      <input id="sname" class="fi"
        style="text-align:center;font-size:16px;margin-bottom:12px"
        placeholder="${t('setupPh')}"
        autocomplete="organization">
      <button onclick="app.confirmStoreName()" class="pri-btn" style="font-size:15px;padding:13px">
        <i class="ti ti-door-enter" style="font-size:17px;vertical-align:-2px;margin-right:7px"></i>
        ${t('setupBtn')}
      </button>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap">
        <button class="tb-btn" onclick="app.setLang('eng')" style="font-size:13px;padding:7px 14px">🇺🇸 English</button>
        <button class="tb-btn" onclick="app.setLang('fil')" style="font-size:13px;padding:7px 14px">🇵🇭 Filipino</button>
      </div>
    </div>
  </div>`
}
