function renderRegisterPage() {
    document.getElementById('app').innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

            .ems-auth * {
                box-sizing: border-box; margin: 0; padding: 0;
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
                display: flex; align-items: center; justify-content: center;
                padding: 20px;
                background:
                    radial-gradient(ellipse 70% 60% at 15% 85%, rgba(245,199,34,0.16) 0%, transparent 55%),
                    radial-gradient(ellipse 55% 45% at 85% 10%, rgba(215,210,195,0.18) 0%, transparent 50%),
                    linear-gradient(148deg, #faf7ef 0%, #f4eed8 30%, #eeeeee 70%, #e7e7e7 100%);
            }

            /* CARD */
            .ems-card {
                width: 100%; max-width: 980px; min-height: 590px;
                display: flex;
                background: var(--surface);
                backdrop-filter: blur(28px) saturate(160%);
                -webkit-backdrop-filter: blur(28px) saturate(160%);
                border-radius: var(--radius-card);
                overflow: hidden;
                box-shadow: var(--shadow-card);
                border: 1px solid rgba(255,255,255,0.62);
                animation: rAuthIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
            }

            @keyframes rAuthIn {
                from { opacity:0; transform: translateY(22px) scale(0.985); }
                to   { opacity:1; transform: translateY(0) scale(1); }
            }

            /* LEFT PANEL */
            .ems-form-panel {
                flex: 0 0 44%; padding: 48px 46px;
                display: flex; flex-direction: column;
                justify-content: space-between;
                background: rgba(255,255,255,0.80);
                position: relative;
            }

            .ems-form-panel::after {
                content: '';
                position: absolute; top: 0; left: 46px; right: 46px;
                height: 2px;
                background: linear-gradient(90deg, transparent 0%, var(--yellow) 50%, transparent 100%);
                border-radius: 0 0 2px 2px;
                animation: rLineIn 0.9s 0.35s var(--ease) both;
            }

            @keyframes rLineIn {
                from { opacity:0; transform: scaleX(0.3); }
                to   { opacity:1; transform: scaleX(1); }
            }

            /* BRAND */
            .ems-brand {
                display: inline-flex; align-items: center; gap: 9px;
                background: #fff;
                border: 1px solid var(--ink-06);
                border-radius: 50px;
                padding: 7px 16px 7px 8px;
                width: fit-content;
                box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                animation: rFadeUp 0.45s 0.10s both;
            }

            .ems-brand-mark {
                width: 28px; height: 28px;
                background: var(--yellow); border-radius: 10px;
                display: flex; align-items: center; justify-content: center;
                font-weight: 800; font-size: 13px; color: var(--ink);
                letter-spacing: -0.3px;
                box-shadow: 0 2px 10px var(--yellow-glow);
            }

            .ems-brand-name {
                font-size: 13.5px; font-weight: 700;
                color: var(--ink); letter-spacing: -0.3px;
            }

            /* FORM BODY */
            .ems-form-body { animation: rFadeUp 0.45s 0.18s both; }

            .ems-title {
                font-family: 'Instrument Serif', serif;
                font-size: 33px; font-weight: 400;
                color: var(--ink); letter-spacing: -0.8px; line-height: 1.15;
                margin-bottom: 8px;
            }

            .ems-title em { font-style: italic; color: var(--yellow-deep); }

            .ems-subtitle {
                font-size: 13.5px; color: var(--ink-40);
                font-weight: 400; line-height: 1.6;
                letter-spacing: 0.05px; margin-bottom: 24px;
            }

            /* ERROR */
            .ems-error {
                display: none; align-items: center; gap: 9px;
                background: rgba(254,242,242,0.90);
                border: 1px solid rgba(239,68,68,0.22);
                color: #b91c1c; padding: 11px 14px;
                border-radius: 12px; font-size: 13px;
                font-weight: 500; margin-bottom: 14px;
                letter-spacing: 0.05px; line-height: 1.4;
            }

            .ems-error.on { display: flex; animation: rErrIn 0.25s var(--ease); }

            @keyframes rErrIn {
                from { opacity:0; transform: translateY(-4px); }
                to   { opacity:1; transform: translateY(0); }
            }

            /* FIELDS */
            .ems-field { margin-bottom: 14px; }

            .ems-label {
                display: flex; align-items: center; gap: 6px;
                font-size: 11px; font-weight: 700;
                color: var(--ink-70);
                margin-bottom: 7px; letter-spacing: 0.55px;
                text-transform: uppercase;
            }

            .ems-label-pip {
                width: 5px; height: 5px;
                background: var(--yellow); border-radius: 50%; flex-shrink: 0;
            }

            .ems-input-wrap { position: relative; }

            .ems-input {
                width: 100%; padding: 14px 18px;
                background: rgba(255,255,255,0.90);
                border: 1.5px solid rgba(15,15,16,0.09);
                border-radius: var(--radius-input);
                font-size: 14.5px;
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-weight: 400; color: var(--ink);
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
                border-color: var(--yellow); background: #fff;
                box-shadow: 0 0 0 4px var(--yellow-soft), 0 4px 16px rgba(0,0,0,0.06);
            }

            .ems-eye-btn {
                position: absolute; right: 14px; top: 50%;
                transform: translateY(-50%);
                background: none; border: none;
                cursor: pointer; padding: 6px;
                color: var(--ink-40); font-size: 15px; line-height: 1;
                border-radius: 8px;
                transition: background 0.16s, color 0.16s;
            }

            .ems-eye-btn:hover { background: var(--ink-06); color: var(--ink); }

            /* SUBMIT */
            .ems-submit {
                width: 100%; padding: 15.5px 24px;
                background: var(--yellow); border: none;
                border-radius: 50px;
                font-size: 14.5px; font-weight: 700;
                font-family: 'Plus Jakarta Sans', sans-serif;
                color: var(--ink); cursor: pointer;
                margin-top: 18px;
                transition: background 0.20s, transform 0.16s, box-shadow 0.20s;
                box-shadow: var(--shadow-btn);
                letter-spacing: 0.1px; position: relative; overflow: hidden;
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
                animation: rSpinA 0.65s linear infinite;
                display: none; flex-shrink: 0;
            }

            .loading .ems-spin { display: block; }

            @keyframes rSpinA { to { transform: rotate(360deg); } }

            /* DIVIDER */
            .ems-divider {
                display: flex; align-items: center; gap: 12px;
                margin: 16px 0;
            }

            .ems-div-line { flex: 1; height: 1px; background: rgba(15,15,16,0.08); }

            .ems-div-txt {
                font-size: 11.5px; color: rgba(15,15,16,0.32);
                font-weight: 600; letter-spacing: 0.5px;
                text-transform: uppercase;
            }

            /* SOCIAL ROW */
            .ems-social { display: flex; gap: 10px; }

            .ems-soc-btn {
                flex: 1; padding: 12px 14px;
                background: rgba(255,255,255,0.90);
                border: 1.5px solid rgba(15,15,16,0.09);
                border-radius: 50px;
                font-size: 13px; font-weight: 600;
                font-family: 'Plus Jakarta Sans', sans-serif;
                color: var(--ink); cursor: pointer;
                display: flex; align-items: center; justify-content: center; gap: 8px;
                transition: background 0.18s, box-shadow 0.18s, transform 0.16s;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                letter-spacing: 0.05px;
            }

            .ems-soc-btn:hover {
                background: #fff;
                box-shadow: 0 6px 18px rgba(0,0,0,0.09);
                transform: translateY(-1px);
            }

            /* FOOTER */
            .ems-foot {
                display: flex; justify-content: space-between;
                align-items: center; flex-wrap: wrap; gap: 8px;
                animation: rFadeUp 0.45s 0.30s both;
            }

            .ems-foot-text { font-size: 12.5px; color: var(--ink-40); font-weight: 400; }

            .ems-link {
                color: var(--ink); font-weight: 700;
                text-decoration: none;
                border-bottom: 1.5px solid var(--yellow);
                padding-bottom: 1px;
                transition: color 0.16s, border-color 0.16s;
            }

            .ems-link:hover { color: var(--yellow-deep); border-color: var(--yellow-deep); }

            .ems-link-mute {
                font-size: 12px; color: rgba(15,15,16,0.32);
                text-decoration: none; letter-spacing: 0.1px;
                transition: color 0.16s;
            }

            .ems-link-mute:hover { color: var(--ink-70); }

            /* ──────────── RIGHT PHOTO ──────────── */
            .ems-photo {
                flex: 1; position: relative; overflow: hidden;
                border-radius: 0 calc(var(--radius-card) - 1px) calc(var(--radius-card) - 1px) 0;
            }

            .ems-photo-bg {
                position: absolute; inset: 0;
                background-image: url('../assets/auth-panel.jpg');
                background-size: cover; background-position: center 20%;
                animation: rZoom 9s ease-out both;
            }

            @keyframes rZoom {
                from { transform: scale(1.06); }
                to   { transform: scale(1); }
            }

            .ems-photo-overlay {
                position: absolute; inset: 0;
                background: linear-gradient(to bottom,
                    rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.04) 35%,
                    rgba(0,0,0,0.28) 72%, rgba(0,0,0,0.52) 100%);
            }

            .ems-photo-overlay::after {
                content: ''; position: absolute; inset: 0;
                background: radial-gradient(ellipse 80% 35% at 50% 108%, rgba(245,199,34,0.16) 0%, transparent 60%);
            }

            .ems-x-btn {
                position: absolute; top: 18px; right: 18px;
                width: 36px; height: 36px;
                background: rgba(255,255,255,0.16); backdrop-filter: blur(14px);
                border: 1px solid rgba(255,255,255,0.26);
                border-radius: 50%; color: rgba(255,255,255,0.90);
                font-size: 14px; font-weight: 300; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                transition: background 0.18s, transform 0.18s;
                z-index: 10; font-family: 'Plus Jakarta Sans', sans-serif;
            }

            .ems-x-btn:hover { background: rgba(255,255,255,0.26); transform: scale(1.07); }

            /* Floating cards */
            @keyframes rFUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
            @keyframes rFloat{ 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-7px)} }

            .rfc { position: absolute; z-index: 5; }

            /* Yellow task card */
            .rfc-task {
                top: 46px; left: 50%; transform: translateX(-50%);
                background: var(--yellow); border-radius: 18px;
                padding: 13px 18px 14px; min-width: 230px;
                box-shadow: 0 14px 40px rgba(245,199,34,0.48), 0 4px 14px rgba(0,0,0,0.10);
                animation: rFUp 0.65s 0.60s both, rFloat 5s 1.25s ease-in-out infinite;
            }

            .rfc-task-row { display:flex; align-items:center; justify-content:space-between; gap:10px; }
            .rfc-task-name { font-size:13px; font-weight:700; color:var(--ink); line-height:1.3; letter-spacing:-0.1px; }
            .rfc-task-dot { width:8px; height:8px; background:rgba(15,15,16,0.70); border-radius:50%; flex-shrink:0; }
            .rfc-task-time { font-size:11px; color:rgba(15,15,16,0.55); margin-top:4px; font-weight:500; letter-spacing:0.1px; }
            .rfc-task-echo {
                position:absolute; bottom:-26px; left:50%; transform:translateX(-50%);
                font-size:10px; color:rgba(255,255,255,0.40); white-space:nowrap;
                font-weight:500; letter-spacing:0.3px; font-family:'Plus Jakarta Sans',sans-serif;
            }

            /* Calendar */
            .rfc-cal {
                bottom: 170px; left: 50%; transform: translateX(-50%);
                display: flex; gap: 18px;
                animation: rFUp 0.65s 0.85s both, rFloat 5s 1.5s ease-in-out infinite;
            }

            .rfc-cal-col { text-align: center; }
            .rfc-cal-label { display:block; font-size:9.5px; font-weight:600; color:rgba(255,255,255,0.42); text-transform:uppercase; letter-spacing:0.7px; margin-bottom:5px; }
            .rfc-cal-num   { display:block; font-size:19px; font-weight:700; color:rgba(255,255,255,0.82); letter-spacing:-0.4px; line-height:1; }
            .rfc-cal-col.hi .rfc-cal-label { color:var(--yellow); }
            .rfc-cal-col.hi .rfc-cal-num   { color:var(--yellow); }

            /* Hatch */
            .rfc-hatch { bottom:138px; right:9%; width:68px; height:76px; z-index:4; opacity:0.42; animation:rFUp 0.65s 1.0s both; }

            /* White meeting card */
            .rfc-meet {
                bottom: 46px; left: 38px;
                background: rgba(255,255,255,0.95);
                backdrop-filter: blur(18px);
                border: 1px solid rgba(255,255,255,0.72);
                border-radius: 18px; padding: 15px 17px 14px; min-width: 218px;
                box-shadow: 0 18px 52px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.10);
                animation: rFUp 0.65s 1.05s both, rFloat 5s 1.7s ease-in-out infinite;
            }

            .rfc-meet-dot { width:9px; height:9px; background:var(--yellow); border-radius:50%; position:absolute; top:15px; right:15px; box-shadow:0 0 10px var(--yellow-glow); }
            .rfc-meet-title { font-size:13px; font-weight:700; color:var(--ink); letter-spacing:-0.1px; }
            .rfc-meet-time  { font-size:11px; color:var(--ink-40); margin-top:3px; font-weight:500; }
            .rfc-avs { display:flex; margin-top:10px; }
            .rfc-av { width:27px; height:27px; border-radius:50%; border:2.5px solid #fff; margin-left:-7px; font-size:9.5px; font-weight:700; display:flex; align-items:center; justify-content:center; color:#fff; box-shadow:0 2px 6px rgba(0,0,0,0.15); }
            .rfc-av:first-child { margin-left:0; }
            .rv1{background:#e17055;} .rv2{background:#6c5ce7;} .rv3{background:#00b894;} .rv4{background:#0984e3;}

            /* Person circles */
            .rfc-person { position:absolute; border-radius:50%; border:2.5px solid rgba(255,255,255,0.55); overflow:hidden; z-index:6; box-shadow:0 6px 22px rgba(0,0,0,0.28); }
            .rp1 { width:52px; height:52px; top:37%; right:20%; background:linear-gradient(148deg,#deb887,#8b6340); animation:rFUp 0.65s 0.68s both,rFloat 6s 1.33s ease-in-out infinite; }
            .rp2 { width:44px; height:44px; top:51%; right:10%; background:linear-gradient(148deg,#c9a882,#7a5535); animation:rFUp 0.65s 0.82s both,rFloat 6s 1.47s ease-in-out infinite; }
            .rfc-p-inner { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; color:rgba(255,255,255,0.85); }

            /* Keyframes */
            @keyframes rFadeUp {
                from { opacity:0; transform: translateY(13px); }
                to   { opacity:1; transform: translateY(0); }
            }

            /* ══ MOBILE ══ */
            @media (max-width: 768px) {
                .ems-auth {
                    padding: 0; min-height: 100%; min-height: -webkit-fill-available;
                    align-items: stretch;
                    background:
                        radial-gradient(ellipse 100% 55% at 5% 95%, rgba(245,199,34,0.22) 0%, transparent 52%),
                        radial-gradient(ellipse 65% 45% at 95% 5%,  rgba(215,210,195,0.18) 0%, transparent 48%),
                        linear-gradient(155deg, #faf8f0 0%, #f3ecdc 38%, #eaeaea 100%);
                }

                .ems-card {
                    border-radius: 0; flex-direction: column;
                    box-shadow: none; background: transparent;
                    backdrop-filter: none; -webkit-backdrop-filter: none;
                    border: none; min-height: 100vh; min-height: -webkit-fill-available;
                    animation: rMobIn 0.42s cubic-bezier(0.22,1,0.36,1) both;
                }

                @keyframes rMobIn {
                    from { opacity:0; transform: translateY(14px); }
                    to   { opacity:1; transform: translateY(0); }
                }

                .ems-form-panel {
                    flex: 1; padding: 58px 28px 44px;
                    background: transparent;
                    justify-content: flex-start; gap: 28px;
                }

                .ems-form-panel::after { left: 28px; right: 28px; }
                .ems-photo { display: none; }

                .ems-title { font-size: 34px; }
                .ems-subtitle { font-size: 14.5px; margin-bottom: 20px; }

                .ems-input {
                    padding: 15.5px 18px;
                    font-size: 15.5px; border-radius: 16px;
                }

                .ems-submit {
                    padding: 17px 24px; font-size: 15.5px;
                    border-radius: 18px; margin-top: 16px;
                }

                .ems-soc-btn { padding: 13px 14px; font-size: 14px; }
                .ems-foot { margin-top: 0; }
                .ems-brand-name { font-size: 14px; }
            }

            @media (max-width: 400px) {
                .ems-form-panel { padding: 50px 22px 36px; }
                .ems-title { font-size: 30px; }
            }

            @media (prefers-reduced-motion: reduce) {
                .ems-card,.ems-brand,.ems-form-body,.ems-foot,
                .rfc-task,.rfc-cal,.rfc-meet,.rp1,.rp2,.ems-photo-bg,
                .ems-form-panel::after { animation:none!important; opacity:1!important; transform:none!important; }
                .rfc-task { top:46px; transform:translateX(-50%)!important; }
                .rfc-cal  { transform:translateX(-50%)!important; }
            }
        </style>

        <div class="ems-auth">
            <div class="ems-card">

                <!-- ══ LEFT: REGISTER FORM ══ -->
                <div class="ems-form-panel">

                    <div class="ems-brand">
                        <div class="ems-brand-mark">E</div>
                        <span class="ems-brand-name">EMS Portal</span>
                    </div>

                    <div class="ems-form-body">
                        <h1 class="ems-title">Create an <em>account</em></h1>
                        <p class="ems-subtitle">Sign up and start your 30-day free trial today.</p>

                        <div id="reg-error" class="ems-error" role="alert"></div>

                        <div class="ems-field">
                            <label class="ems-label" for="rg-name">
                                <span class="ems-label-pip"></span>Full Name
                            </label>
                            <div class="ems-input-wrap">
                                <input type="text" id="rg-name" class="ems-input"
                                    placeholder="Amélie Laurent" autocomplete="name" />
                            </div>
                        </div>

                        <div class="ems-field">
                            <label class="ems-label" for="rg-email">
                                <span class="ems-label-pip"></span>Email Address
                            </label>
                            <div class="ems-input-wrap">
                                <input type="email" id="rg-email" class="ems-input"
                                    placeholder="you@company.com"
                                    autocomplete="email" inputmode="email" />
                            </div>
                        </div>

                        <div class="ems-field">
                            <label class="ems-label" for="rg-pass">
                                <span class="ems-label-pip"></span>Password
                            </label>
                            <div class="ems-input-wrap">
                                <input type="password" id="rg-pass" class="ems-input"
                                    placeholder="Min. 8 characters"
                                    autocomplete="new-password"
                                    style="padding-right:48px;"
                                    onkeydown="if(event.key==='Enter') handleRegisterSubmit()" />
                                <button type="button" class="ems-eye-btn"
                                    onclick="emsToggle('rg-pass',this)" aria-label="Toggle password">👁</button>
                            </div>
                        </div>

                        <button class="ems-submit" id="reg-btn" onclick="handleRegisterSubmit()">
                            <div class="ems-spin"></div>
                            <span id="reg-btn-txt">Submit</span>
                        </button>

                        <div class="ems-divider">
                            <div class="ems-div-line"></div>
                            <span class="ems-div-txt">or</span>
                            <div class="ems-div-line"></div>
                        </div>

                        <div class="ems-social">
                            <button class="ems-soc-btn" onclick="showToast('Apple Sign-In not available','warning')">
                                <span style="font-size:15px;">&#63743;</span> Apple
                            </button>
                            <button class="ems-soc-btn" onclick="showToast('Google Sign-In not available','warning')">
                                <svg width="15" height="15" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                        </div>
                    </div>

                    <div class="ems-foot">
                        <p class="ems-foot-text">
                            Have an account?&nbsp;<a href="#/login" class="ems-link">Sign in</a>
                        </p>
                        <a href="#" class="ems-link-mute">Terms &amp; Conditions</a>
                    </div>

                </div>

                <!-- ══ RIGHT: PHOTO ══ -->
                <div class="ems-photo" aria-hidden="true">

                    <div class="ems-photo-bg"></div>
                    <div class="ems-photo-overlay"></div>

                    <button class="ems-x-btn" onclick="window.location.hash='#/login'" aria-label="Back">✕</button>

                    <div class="rfc-person rp1"><div class="rfc-p-inner">S</div></div>
                    <div class="rfc-person rp2"><div class="rfc-p-inner">A</div></div>

                    <!-- Yellow task card -->
                    <div class="rfc rfc-task">
                        <div class="rfc-task-row">
                            <span class="rfc-task-name">Task Review With Team</span>
                            <span class="rfc-task-dot"></span>
                        </div>
                        <div class="rfc-task-time">09:30am – 10:00am</div>
                        <div class="rfc-task-echo">09:30am – 10:00am</div>
                    </div>

                    <!-- Calendar -->
                    <div class="rfc rfc-cal">
                        ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i)=>`
                        <div class="rfc-cal-col ${i===2?'hi':''}">
                            <span class="rfc-cal-label">${d}</span>
                            <span class="rfc-cal-num">${22+i}</span>
                        </div>`).join('')}
                    </div>

                    <!-- Hatch -->
                    <svg class="rfc rfc-hatch" viewBox="0 0 68 76" fill="none">
                        <defs>
                            <pattern id="ht-r" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                                <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.38)" stroke-width="1.8"/>
                            </pattern>
                        </defs>
                        <rect width="68" height="76" rx="10" fill="url(#ht-r)"/>
                    </svg>

                    <!-- White meeting card -->
                    <div class="rfc rfc-meet">
                        <div class="rfc-meet-dot"></div>
                        <div class="rfc-meet-title">Daily Meeting</div>
                        <div class="rfc-meet-time">12:00pm – 01:00pm</div>
                        <div class="rfc-avs">
                            <div class="rfc-av rv1">R</div>
                            <div class="rfc-av rv2">S</div>
                            <div class="rfc-av rv3">A</div>
                            <div class="rfc-av rv4">K</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;
}

/* ─── shared utilities (also defined in login.js — safe if either loads first) ─── */
if (typeof emsToggle === 'undefined') {
    function emsToggle(id, btn) {
        const el = document.getElementById(id);
        if (!el) return;
        el.type = el.type === 'password' ? 'text' : 'password';
        btn.textContent = el.type === 'password' ? '👁' : '🙈';
    }
}

if (typeof emsErrShow === 'undefined') {
    function emsErrShow(boxId, text) {
        const el = document.getElementById(boxId);
        if (!el) return;
        el.textContent = text;
        el.classList.add('on');
    }
}

if (typeof emsErrClear === 'undefined') {
    function emsErrClear(boxId) {
        const el = document.getElementById(boxId);
        if (el) el.classList.remove('on');
    }
}

if (typeof emsSetLoading === 'undefined') {
    function emsSetLoading(btnId, txtId, loading, label) {
        const btn = document.getElementById(btnId);
        const txt = document.getElementById(txtId);
        if (!btn) return;
        btn.disabled = loading;
        loading ? btn.classList.add('loading') : btn.classList.remove('loading');
        if (txt) txt.textContent = loading ? 'Please wait…' : label;
    }
}

/* ─── Register handler ─── */
async function handleRegisterSubmit() {
    emsErrClear('reg-error');

    const userName = document.getElementById('rg-name')?.value.trim();
    const email    = document.getElementById('rg-email')?.value.trim();
    const password = document.getElementById('rg-pass')?.value;

    if (!userName || !email || !password) {
        emsErrShow('reg-error', 'Please fill in all fields.');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emsErrShow('reg-error', 'Please enter a valid email address.');
        document.getElementById('rg-email')?.focus();
        return;
    }

    if (password.length < 8) {
        emsErrShow('reg-error', 'Password must be at least 8 characters long.');
        document.getElementById('rg-pass')?.focus();
        return;
    }

    emsSetLoading('reg-btn', 'reg-btn-txt', true);

    try {
        await register(userName, email, password);
    } catch (err) {
        emsErrShow('reg-error', err.message || 'Registration failed — please try again.');
        emsSetLoading('reg-btn', 'reg-btn-txt', false, 'Submit');
    }
}

/* legacy alias */
function toggleRegPassword(btn) { emsToggle('rg-pass', btn); }
