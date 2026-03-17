function renderLoginPage() {
    document.getElementById('app').innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

            .ems-auth * {
                box-sizing: border-box;
                margin: 0; padding: 0;
                font-family: 'Plus Jakarta Sans', sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            .ems-auth {
                --yellow:       #F5C722;
                --yellow-deep:  #E8B800;
                --yellow-glow:  rgba(245,199,34,0.22);
                --yellow-soft:  rgba(245,199,34,0.11);
                --ink:          #0F0F10;
                --ink-70:       rgba(15,15,16,0.70);
                --ink-40:       rgba(15,15,16,0.40);
                --ink-15:       rgba(15,15,16,0.12);
                --ink-06:       rgba(15,15,16,0.06);
                --white:        #ffffff;
                --surface:      rgba(255,255,255,0.74);
                --radius-card:  28px;
                --radius-input: 14px;
                --shadow-card:  0 32px 80px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.07);
                --shadow-input: 0 2px 10px rgba(0,0,0,0.05);
                --shadow-btn:   0 6px 28px rgba(245,199,34,0.48);
                --ease:         cubic-bezier(0.4,0,0.2,1);
            }

            /* PAGE */
            .ems-auth {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background:
                    radial-gradient(ellipse 70% 60% at 15% 85%, rgba(245,199,34,0.16) 0%, transparent 55%),
                    radial-gradient(ellipse 55% 45% at 85% 10%, rgba(215,210,195,0.18) 0%, transparent 50%),
                    linear-gradient(148deg, #faf7ef 0%, #f4eed8 30%, #eeeeee 70%, #e7e7e7 100%);
            }

            /* CARD */
            .ems-card {
                width: 100%;
                max-width: 980px;
                min-height: 560px;
                display: flex;
                background: var(--surface);
                backdrop-filter: blur(28px) saturate(160%);
                -webkit-backdrop-filter: blur(28px) saturate(160%);
                border-radius: var(--radius-card);
                overflow: hidden;
                box-shadow: var(--shadow-card);
                border: 1px solid rgba(255,255,255,0.62);
                animation: authCardIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
            }

            @keyframes authCardIn {
                from { opacity:0; transform: translateY(22px) scale(0.985); }
                to   { opacity:1; transform: translateY(0) scale(1); }
            }

            /* LEFT PANEL */
            .ems-form-panel {
                flex: 0 0 44%;
                padding: 50px 46px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background: rgba(255,255,255,0.80);
                position: relative;
            }

            .ems-form-panel::after {
                content: '';
                position: absolute;
                top: 0; left: 46px; right: 46px;
                height: 2px;
                background: linear-gradient(90deg, transparent 0%, var(--yellow) 50%, transparent 100%);
                border-radius: 0 0 2px 2px;
                animation: authLineIn 0.9s 0.35s var(--ease) both;
            }

            @keyframes authLineIn {
                from { opacity:0; transform: scaleX(0.3); }
                to   { opacity:1; transform: scaleX(1); }
            }

            /* BRAND */
            .ems-brand {
                display: inline-flex;
                align-items: center;
                gap: 9px;
                background: #fff;
                border: 1px solid var(--ink-06);
                border-radius: 50px;
                padding: 7px 16px 7px 8px;
                width: fit-content;
                box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                animation: authFadeUp 0.45s 0.10s both;
            }

            .ems-brand-mark {
                width: 28px; height: 28px;
                background: var(--yellow);
                border-radius: 10px;
                display: flex; align-items: center; justify-content: center;
                font-weight: 800; font-size: 13px; color: var(--ink);
                letter-spacing: -0.3px;
                box-shadow: 0 2px 10px var(--yellow-glow);
            }

            .ems-brand-name {
                font-size: 13.5px;
                font-weight: 700;
                color: var(--ink);
                letter-spacing: -0.3px;
            }

            /* FORM BODY */
            .ems-form-body { animation: authFadeUp 0.45s 0.18s both; }

            .ems-title {
                font-family: 'Instrument Serif', serif;
                font-size: 33px;
                font-weight: 400;
                color: var(--ink);
                letter-spacing: -0.8px;
                line-height: 1.15;
                margin-bottom: 8px;
            }

            .ems-title em {
                font-style: italic;
                color: var(--yellow-deep);
            }

            .ems-subtitle {
                font-size: 13.5px;
                color: var(--ink-40);
                font-weight: 400;
                line-height: 1.6;
                letter-spacing: 0.05px;
                margin-bottom: 30px;
            }

            /* ERROR */
            .ems-error {
                display: none;
                align-items: center;
                gap: 9px;
                background: rgba(254,242,242,0.90);
                border: 1px solid rgba(239,68,68,0.22);
                color: #b91c1c;
                padding: 11px 14px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 500;
                margin-bottom: 16px;
                letter-spacing: 0.05px;
                line-height: 1.4;
            }

            .ems-error.on { display: flex; animation: authErrIn 0.25s var(--ease); }

            @keyframes authErrIn {
                from { opacity:0; transform: translateY(-4px); }
                to   { opacity:1; transform: translateY(0); }
            }

            /* FIELDS */
            .ems-field { margin-bottom: 16px; }

            .ems-label {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 11px;
                font-weight: 700;
                color: var(--ink-70);
                margin-bottom: 8px;
                letter-spacing: 0.55px;
                text-transform: uppercase;
            }

            .ems-label-pip {
                width: 5px; height: 5px;
                background: var(--yellow);
                border-radius: 50%;
                flex-shrink: 0;
            }

            .ems-input-wrap { position: relative; }

            .ems-input {
                width: 100%;
                padding: 14px 18px;
                background: rgba(255,255,255,0.90);
                border: 1.5px solid rgba(15,15,16,0.09);
                border-radius: var(--radius-input);
                font-size: 14.5px;
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-weight: 400;
                color: var(--ink);
                outline: none;
                transition: border-color 0.20s, box-shadow 0.20s, background 0.20s;
                box-shadow: var(--shadow-input);
                letter-spacing: 0.05px;
            }

            .ems-input::placeholder { color: rgba(15,15,16,0.27); font-weight: 400; }

            .ems-input:hover {
                border-color: rgba(15,15,16,0.17);
                box-shadow: 0 4px 16px rgba(0,0,0,0.07);
            }

            .ems-input:focus {
                border-color: var(--yellow);
                background: #fff;
                box-shadow: 0 0 0 4px var(--yellow-soft), 0 4px 16px rgba(0,0,0,0.06);
            }

            .ems-eye-btn {
                position: absolute;
                right: 14px; top: 50%;
                transform: translateY(-50%);
                background: none; border: none;
                cursor: pointer; padding: 6px;
                color: var(--ink-40);
                font-size: 15px; line-height: 1;
                border-radius: 8px;
                transition: background 0.16s, color 0.16s;
            }

            .ems-eye-btn:hover { background: var(--ink-06); color: var(--ink); }

            /* SUBMIT */
            .ems-submit {
                width: 100%;
                padding: 15.5px 24px;
                background: var(--yellow);
                border: none;
                border-radius: 50px;
                font-size: 14.5px;
                font-weight: 700;
                font-family: 'Plus Jakarta Sans', sans-serif;
                color: var(--ink);
                cursor: pointer;
                margin-top: 22px;
                transition: background 0.20s, transform 0.16s, box-shadow 0.20s;
                box-shadow: var(--shadow-btn);
                letter-spacing: 0.1px;
                position: relative;
                overflow: hidden;
                display: flex; align-items: center; justify-content: center; gap: 9px;
            }

            .ems-submit::before {
                content: '';
                position: absolute; inset: 0;
                background: linear-gradient(135deg, rgba(255,255,255,0.20) 0%, transparent 55%);
                pointer-events: none;
            }

            .ems-submit:hover:not(:disabled) {
                background: var(--yellow-deep);
                box-shadow: 0 12px 36px rgba(245,199,34,0.55);
                transform: translateY(-2px);
            }

            .ems-submit:active:not(:disabled) { transform: translateY(0); }

            .ems-submit:disabled { opacity: 0.72; cursor: not-allowed; transform: none !important; }

            .ems-spin {
                width: 16px; height: 16px;
                border: 2.5px solid rgba(15,15,16,0.22);
                border-top-color: var(--ink);
                border-radius: 50%;
                animation: emsSpinAnim 0.65s linear infinite;
                display: none; flex-shrink: 0;
            }

            .loading .ems-spin { display: block; }

            @keyframes emsSpinAnim { to { transform: rotate(360deg); } }

            /* FOOTER */
            .ems-foot {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 8px;
                animation: authFadeUp 0.45s 0.30s both;
            }

            .ems-foot-text {
                font-size: 12.5px;
                color: var(--ink-40);
                font-weight: 400;
                line-height: 1.5;
            }

            .ems-link {
                color: var(--ink);
                font-weight: 700;
                text-decoration: none;
                border-bottom: 1.5px solid var(--yellow);
                padding-bottom: 1px;
                transition: color 0.16s, border-color 0.16s;
            }

            .ems-link:hover { color: var(--yellow-deep); border-color: var(--yellow-deep); }

            .ems-link-mute {
                font-size: 12px;
                color: rgba(15,15,16,0.32);
                text-decoration: none;
                letter-spacing: 0.1px;
                transition: color 0.16s;
            }

            .ems-link-mute:hover { color: var(--ink-70); }

            /* ──────────── RIGHT PHOTO PANEL ──────────── */
            .ems-photo {
                flex: 1;
                position: relative;
                overflow: hidden;
                border-radius: 0 calc(var(--radius-card) - 1px) calc(var(--radius-card) - 1px) 0;
            }

            .ems-photo-bg {
                position: absolute; inset: 0;
                background-image: url('../assets/auth-panel.jpg');
                background-size: cover;
                background-position: center 20%;
                animation: authZoom 9s ease-out both;
            }

            @keyframes authZoom {
                from { transform: scale(1.06); }
                to   { transform: scale(1); }
            }

            /* Cinematic overlay */
            .ems-photo-overlay {
                position: absolute; inset: 0;
                background: linear-gradient(
                    to bottom,
                    rgba(0,0,0,0.06) 0%,
                    rgba(0,0,0,0.04) 35%,
                    rgba(0,0,0,0.28) 72%,
                    rgba(0,0,0,0.52) 100%
                );
            }

            .ems-photo-overlay::after {
                content: '';
                position: absolute; inset: 0;
                background: radial-gradient(ellipse 80% 35% at 50% 108%, rgba(245,199,34,0.16) 0%, transparent 60%);
            }

            /* Close btn */
            .ems-x-btn {
                position: absolute;
                top: 18px; right: 18px;
                width: 36px; height: 36px;
                background: rgba(255,255,255,0.16);
                backdrop-filter: blur(14px);
                border: 1px solid rgba(255,255,255,0.26);
                border-radius: 50%;
                color: rgba(255,255,255,0.90);
                font-size: 14px; font-weight: 300;
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                transition: background 0.18s, transform 0.18s;
                z-index: 10;
                font-family: 'Plus Jakarta Sans', sans-serif;
            }

            .ems-x-btn:hover { background: rgba(255,255,255,0.26); transform: scale(1.07); }

            /* ── Floating cards ── */
            @keyframes authFloatUp {
                from { opacity:0; transform: translateY(18px); }
                to   { opacity:1; transform: translateY(0); }
            }
            @keyframes authFloat {
                0%, 100% { transform: translateY(0px); }
                50%       { transform: translateY(-7px); }
            }

            .auth-fc { position: absolute; z-index: 5; }

            /* Yellow task card */
            .afc-task {
                top: 46px; left: 50%;
                transform: translateX(-50%);
                background: var(--yellow);
                border-radius: 18px;
                padding: 13px 18px 14px;
                min-width: 230px;
                box-shadow: 0 14px 40px rgba(245,199,34,0.48), 0 4px 14px rgba(0,0,0,0.10);
                animation: authFloatUp 0.65s 0.60s both, authFloat 5s 1.25s ease-in-out infinite;
            }

            .afc-task-row {
                display: flex; align-items: center;
                justify-content: space-between; gap: 10px;
            }

            .afc-task-name {
                font-size: 13px; font-weight: 700;
                color: var(--ink); line-height: 1.3;
                letter-spacing: -0.1px;
            }

            .afc-task-dot {
                width: 8px; height: 8px;
                background: rgba(15,15,16,0.70);
                border-radius: 50%; flex-shrink: 0;
            }

            .afc-task-time {
                font-size: 11px; color: rgba(15,15,16,0.55);
                margin-top: 4px; font-weight: 500;
                letter-spacing: 0.1px;
            }

            .afc-task-echo {
                position: absolute;
                bottom: -26px; left: 50%;
                transform: translateX(-50%);
                font-size: 10px; color: rgba(255,255,255,0.40);
                white-space: nowrap; font-weight: 500;
                letter-spacing: 0.3px;
                font-family: 'Plus Jakarta Sans', sans-serif;
            }

            /* Calendar */
            .afc-cal {
                bottom: 170px; left: 50%;
                transform: translateX(-50%);
                display: flex; gap: 18px;
                animation: authFloatUp 0.65s 0.85s both, authFloat 5s 1.5s ease-in-out infinite;
            }

            .afc-cal-col { text-align: center; }

            .afc-cal-label {
                display: block;
                font-size: 9.5px; font-weight: 600;
                color: rgba(255,255,255,0.42);
                text-transform: uppercase; letter-spacing: 0.7px;
                margin-bottom: 5px;
            }

            .afc-cal-num {
                display: block;
                font-size: 19px; font-weight: 700;
                color: rgba(255,255,255,0.82);
                letter-spacing: -0.4px; line-height: 1;
            }

            .afc-cal-col.hi .afc-cal-label { color: var(--yellow); }
            .afc-cal-col.hi .afc-cal-num   { color: var(--yellow); }

            /* Hatch */
            .afc-hatch {
                bottom: 138px; right: 9%;
                width: 68px; height: 76px;
                z-index: 4; opacity: 0.42;
                animation: authFloatUp 0.65s 1.0s both;
            }

            /* White meeting card */
            .afc-meet {
                bottom: 46px; left: 38px;
                background: rgba(255,255,255,0.95);
                backdrop-filter: blur(18px);
                border: 1px solid rgba(255,255,255,0.72);
                border-radius: 18px;
                padding: 15px 17px 14px;
                min-width: 218px;
                box-shadow: 0 18px 52px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.10);
                animation: authFloatUp 0.65s 1.05s both, authFloat 5s 1.7s ease-in-out infinite;
            }

            .afc-meet-dot {
                width: 9px; height: 9px;
                background: var(--yellow);
                border-radius: 50%;
                position: absolute; top: 15px; right: 15px;
                box-shadow: 0 0 10px var(--yellow-glow);
            }

            .afc-meet-title { font-size: 13px; font-weight: 700; color: var(--ink); letter-spacing: -0.1px; }
            .afc-meet-time  { font-size: 11px; color: var(--ink-40); margin-top: 3px; font-weight: 500; }

            .afc-avs { display: flex; margin-top: 10px; }

            .afc-av {
                width: 27px; height: 27px;
                border-radius: 50%;
                border: 2.5px solid #fff;
                margin-left: -7px;
                font-size: 9.5px; font-weight: 700;
                display: flex; align-items: center; justify-content: center;
                color: #fff;
                box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            }

            .afc-av:first-child { margin-left: 0; }
            .afc-c1 { background: #e17055; }
            .afc-c2 { background: #6c5ce7; }
            .afc-c3 { background: #00b894; }
            .afc-c4 { background: #0984e3; }

            /* Person circles */
            .afc-person {
                position: absolute;
                border-radius: 50%;
                border: 2.5px solid rgba(255,255,255,0.55);
                overflow: hidden; z-index: 6;
                box-shadow: 0 6px 22px rgba(0,0,0,0.28);
            }

            .afc-p1 {
                width: 52px; height: 52px; top: 37%; right: 20%;
                background: linear-gradient(148deg, #deb887, #8b6340);
                animation: authFloatUp 0.65s 0.68s both, authFloat 6s 1.33s ease-in-out infinite;
            }

            .afc-p2 {
                width: 44px; height: 44px; top: 51%; right: 10%;
                background: linear-gradient(148deg, #c9a882, #7a5535);
                animation: authFloatUp 0.65s 0.82s both, authFloat 6s 1.47s ease-in-out infinite;
            }

            .afc-p-inner {
                width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
                font-size: 14px; font-weight: 800;
                color: rgba(255,255,255,0.85);
            }

            /* ── SHARED KEYFRAMES ── */
            @keyframes authFadeUp {
                from { opacity:0; transform: translateY(13px); }
                to   { opacity:1; transform: translateY(0); }
            }

            /* ══════════ MOBILE ══════════ */
            @media (max-width: 768px) {

                .ems-auth {
                    padding: 0;
                    min-height: 100%;
                    min-height: -webkit-fill-available;
                    align-items: stretch;
                    background:
                        radial-gradient(ellipse 100% 55% at 5% 95%, rgba(245,199,34,0.22) 0%, transparent 52%),
                        radial-gradient(ellipse 65% 45% at 95% 5%,  rgba(215,210,195,0.18) 0%, transparent 48%),
                        linear-gradient(155deg, #faf8f0 0%, #f3ecdc 38%, #eaeaea 100%);
                }

                .ems-card {
                    border-radius: 0;
                    flex-direction: column;
                    box-shadow: none;
                    background: transparent;
                    backdrop-filter: none;
                    -webkit-backdrop-filter: none;
                    border: none;
                    min-height: 100vh;
                    min-height: -webkit-fill-available;
                    animation: authMobileIn 0.42s cubic-bezier(0.22,1,0.36,1) both;
                }

                @keyframes authMobileIn {
                    from { opacity:0; transform: translateY(14px); }
                    to   { opacity:1; transform: translateY(0); }
                }

                .ems-form-panel {
                    flex: 1;
                    padding: 60px 28px 44px;
                    background: transparent;
                    justify-content: flex-start;
                    gap: 36px;
                }

                .ems-form-panel::after { left: 28px; right: 28px; }

                .ems-photo { display: none; }

                .ems-title { font-size: 36px; }
                .ems-subtitle { font-size: 14.5px; margin-bottom: 24px; }

                .ems-input {
                    padding: 15.5px 18px;
                    font-size: 15.5px;
                    border-radius: 16px;
                }

                .ems-submit {
                    padding: 17px 24px;
                    font-size: 15.5px;
                    border-radius: 18px;
                    margin-top: 24px;
                }

                .ems-foot { margin-top: 0; }

                .ems-brand {
                    padding: 8px 18px 8px 10px;
                }

                .ems-brand-name { font-size: 14px; }
            }

            @media (max-width: 400px) {
                .ems-form-panel { padding: 52px 22px 38px; }
                .ems-title { font-size: 31px; }
            }

            @media (prefers-reduced-motion: reduce) {
                .ems-card, .ems-brand, .ems-form-body, .ems-foot,
                .afc-task, .afc-cal, .afc-meet, .afc-p1, .afc-p2, .ems-photo-bg,
                .ems-form-panel::after { animation: none !important; opacity: 1 !important; transform: none !important; }
                .afc-task  { top: 46px; transform: translateX(-50%) !important; }
                .afc-cal   { transform: translateX(-50%) !important; }
            }
        </style>

        <div class="ems-auth">
            <div class="ems-card">

                <!-- ══ LEFT: LOGIN FORM ══ -->
                <div class="ems-form-panel">

                    <div class="ems-brand">
                        <div class="ems-brand-mark">E</div>
                        <span class="ems-brand-name">EMS Portal</span>
                    </div>

                    <div class="ems-form-body">
                        <h1 class="ems-title">Welcome <em>back</em></h1>
                        <p class="ems-subtitle">Sign in to your workspace and manage your team.</p>

                        <div id="login-error" class="ems-error" role="alert"></div>

                        <div class="ems-field">
                            <label class="ems-label" for="li-email">
                                <span class="ems-label-pip"></span>Email Address
                            </label>
                            <div class="ems-input-wrap">
                                <input type="email" id="li-email" class="ems-input"
                                    placeholder="you@company.com"
                                    autocomplete="email" inputmode="email" />
                            </div>
                        </div>

                        <div class="ems-field">
                            <label class="ems-label" for="li-pass">
                                <span class="ems-label-pip"></span>Password
                            </label>
                            <div class="ems-input-wrap">
                                <input type="password" id="li-pass" class="ems-input"
                                    placeholder="Min. 8 characters"
                                    autocomplete="current-password"
                                    style="padding-right:48px;"
                                    onkeydown="if(event.key==='Enter') handleLoginClick()" />
                                <button type="button" class="ems-eye-btn"
                                    onclick="emsToggle('li-pass',this)" aria-label="Toggle password">👁</button>
                            </div>
                        </div>

                        <button class="ems-submit" id="login-btn" onclick="handleLoginClick()">
                            <div class="ems-spin"></div>
                            <span id="login-btn-txt">Sign In</span>
                        </button>
                    </div>

                    <div class="ems-foot">
                        <p class="ems-foot-text">
                            No account?&nbsp;<a href="#/register" class="ems-link">Register here</a>
                        </p>
                        <a href="#" class="ems-link-mute">Terms &amp; Conditions</a>
                    </div>

                </div>

                <!-- ══ RIGHT: PHOTO ══ -->
                <div class="ems-photo" aria-hidden="true">

                    <div class="ems-photo-bg"></div>
                    <div class="ems-photo-overlay"></div>

                    <button class="ems-x-btn" onclick="return false;" aria-label="Close">✕</button>

                    <div class="afc-person afc-p1"><div class="afc-p-inner">S</div></div>
                    <div class="afc-person afc-p2"><div class="afc-p-inner">A</div></div>

                    <!-- Yellow task card -->
                    <div class="auth-fc afc-task">
                        <div class="afc-task-row">
                            <span class="afc-task-name">Task Review With Team</span>
                            <span class="afc-task-dot"></span>
                        </div>
                        <div class="afc-task-time">09:30am – 10:00am</div>
                        <div class="afc-task-echo">09:30am – 10:00am</div>
                    </div>

                    <!-- Calendar -->
                    <div class="auth-fc afc-cal">
                        ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => `
                        <div class="afc-cal-col ${i === 2 ? 'hi' : ''}">
                            <span class="afc-cal-label">${d}</span>
                            <span class="afc-cal-num">${22 + i}</span>
                        </div>`).join('')}
                    </div>

                    <!-- Hatch -->
                    <svg class="auth-fc afc-hatch" viewBox="0 0 68 76" fill="none">
                        <defs>
                            <pattern id="ht-l" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                                <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.38)" stroke-width="1.8"/>
                            </pattern>
                        </defs>
                        <rect width="68" height="76" rx="10" fill="url(#ht-l)"/>
                    </svg>

                    <!-- White meeting card -->
                    <div class="auth-fc afc-meet">
                        <div class="afc-meet-dot"></div>
                        <div class="afc-meet-title">Daily Meeting</div>
                        <div class="afc-meet-time">12:00pm – 01:00pm</div>
                        <div class="afc-avs">
                            <div class="afc-av afc-c1">R</div>
                            <div class="afc-av afc-c2">S</div>
                            <div class="afc-av afc-c3">A</div>
                            <div class="afc-av afc-c4">K</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;
}

/* ─────── Shared Utilities ─────── */

function emsToggle(id, btn) {
    const el = document.getElementById(id);
    if (!el) return;
    el.type = el.type === 'password' ? 'text' : 'password';
    btn.textContent = el.type === 'password' ? '👁' : '🙈';
}

function emsErrShow(boxId, text) {
    const el = document.getElementById(boxId);
    if (!el) return;
    el.textContent = text;
    el.classList.add('on');
}

function emsErrClear(boxId) {
    const el = document.getElementById(boxId);
    if (el) el.classList.remove('on');
}

function emsSetLoading(btnId, txtId, loading, label) {
    const btn = document.getElementById(btnId);
    const txt = document.getElementById(txtId);
    if (!btn) return;
    btn.disabled = loading;
    loading ? btn.classList.add('loading') : btn.classList.remove('loading');
    if (txt) txt.textContent = loading ? 'Please wait…' : label;
}

/* ─────── Login Handler ─────── */

async function handleLoginClick() {
    emsErrClear('login-error');

    const email = document.getElementById('li-email')?.value.trim();
    const password = document.getElementById('li-pass')?.value;

    if (!email || !password) {
        emsErrShow('login-error', 'Please fill in both fields.');
        document.getElementById(!email ? 'li-email' : 'li-pass')?.focus();
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emsErrShow('login-error', 'Please enter a valid email address.');
        document.getElementById('li-email')?.focus();
        return;
    }

    emsSetLoading('login-btn', 'login-btn-txt', true);

    try {
        await login(email, password);
    } catch (err) {
        emsErrShow('login-error', err.message || 'Login failed — please try again.');
        emsSetLoading('login-btn', 'login-btn-txt', false, 'Sign In');
    }
}

/* legacy alias */
function toggleLoginPassword(btn) { emsToggle('li-pass', btn); }
