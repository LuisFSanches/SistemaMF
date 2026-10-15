import styled, { keyframes } from "styled-components";

// Painel de TV: tema escuro, alto contraste, só transições simples
// (o computador da loja é antigo). Cores em hex para funcionar em Chrome antigo.

const popIn = keyframes`
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.main`
    --sp-background: #0f1115;
    --sp-foreground: #f0f2f4;
    --sp-card: #191c21;
    --sp-muted: #202329;
    --sp-muted-foreground: #8f949d;
    --sp-secondary-text: #b4b7bd;
    --sp-border: #2c2f35;
    --sp-primary: #55a9ff;
    --sp-primary-surface: #162c46;
    --sp-amber: #f0b13f;
    --sp-amber-surface: #372912;
    --sp-success: #4ccd8a;
    --sp-success-surface: #172f21;
    --sp-danger: #ff706a;
    --sp-danger-surface: #2f1c1b;
    --sp-danger-border: #653533;
    --sp-danger-badge: #512726;
    --sp-new-surface: #1c3249;
    --sp-header-surface: #121418;
    --sp-item-size: 24px;
    --sp-panel-gap: 20px;
    --sp-card-padding: 20px;

    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    height: 100vh;
    min-height: 660px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--sp-background);
    color: var(--sp-foreground);
    font-family: 'Inter', 'Arial', sans-serif;
    letter-spacing: 0;
    cursor: default;

    * { box-sizing: border-box; }
    h1, h2, h3, p { margin: 0; }
    .svg-inline--fa { flex-shrink: 0; }

    .panel-header { flex-shrink: 0; min-height: 113px; padding: 20px 30px; display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; border-bottom: 1px solid var(--sp-border); background: var(--sp-header-surface); }
    .store-brand { display: flex; align-items: center; gap: 15px; min-width: 0; }
    .brand-mark { color: var(--sp-success); width: 49px; height: 49px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--sp-border); border-radius: 8px; font-size: 24px; flex-shrink: 0; overflow: hidden; }
    .brand-mark img { width: 100%; height: 100%; object-fit: contain; }
    .store-brand h1 { font-size: 27px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .brand-dot { color: var(--sp-success); }
    .store-brand p { font-size: 11px; color: var(--sp-muted-foreground); margin-top: 7px; font-weight: 600; }
    .panel-clock { text-align: center; display: flex; flex-direction: column; gap: 3px; }
    .clock-time { font-size: 48px; font-weight: 650; line-height: 1; font-variant-numeric: tabular-nums; }
    .clock-date { color: var(--sp-secondary-text); font-size: 14px; }
    .header-right { justify-self: end; }
    .summary-counts { display: flex; gap: 27px; }
    .summary-counts > div { display: flex; align-items: center; gap: 10px; }
    .summary-counts span { font-size: 14px; color: var(--sp-secondary-text); }
    .summary-counts strong { font-size: 28px; font-weight: 650; }
    .summary-counts .summary-overdue strong { color: var(--sp-danger); }
    .update-indicator { display: flex; justify-content: flex-end; align-items: center; gap: 6px; font-size: 11px; color: var(--sp-muted-foreground); margin-top: 12px; font-variant-numeric: tabular-nums; }
    .update-indicator.stale { color: var(--sp-danger); font-weight: 700; }
    .connection-dot, .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--sp-success); flex-shrink: 0; }
    .stale .connection-dot { background: var(--sp-danger); }

    .overdue-section { margin: 20px 28px 0; flex-shrink: 0; display: flex; flex-direction: column; max-height: 30vh; min-height: 0; }
    .section-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 13px; flex-shrink: 0; }
    .section-title { display: flex; align-items: center; gap: 10px; color: var(--sp-danger); font-size: 18px; }
    .section-title h2, .today-heading h2 { font-size: 14px; font-weight: 750; }
    .section-count { font-size: 12px; padding: 3px 8px; background: var(--sp-danger-badge); border-radius: 4px; }
    .section-note { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--sp-muted-foreground); }
    .overdue-list { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; align-content: start; }

    .scroll-wrapper { position: relative; min-height: 0; display: flex; flex-direction: column; flex: 1 1 auto; }
    .scroll-area { position: relative; min-height: 0; flex: 1 1 auto; overflow-y: auto; scrollbar-width: none; }
    .scroll-area::-webkit-scrollbar { display: none; }
    .more-badge { position: absolute; right: 8px; bottom: 8px; z-index: 2; font-size: 12px; font-weight: 700; padding: 5px 9px; border-radius: 4px; background: var(--sp-muted); color: var(--sp-secondary-text); border: 1px solid var(--sp-border); pointer-events: none; }

    .order-card { border: 1px solid var(--sp-border); border-radius: 7px; background: var(--sp-card); padding: var(--sp-card-padding); flex-shrink: 0; transition: background-color .5s, border-color .5s; }
    .order-heading { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 15px; }
    .order-code { font-size: 23px; line-height: 1; font-weight: 750; }
    .order-origin { font-size: 11px; color: var(--sp-muted-foreground); }
    .order-items { list-style: none; padding: 0; margin: 0; font-size: var(--sp-item-size); line-height: 1.4; font-weight: 600; display: flex; flex-direction: column; gap: 4px; overflow-wrap: anywhere; }
    .order-details { display: flex; align-items: center; flex-wrap: wrap; gap: 9px 12px; margin-top: 18px; }
    .fulfillment { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 650; padding: 5px 7px; border: 1px solid var(--sp-border); border-radius: 4px; background: var(--sp-muted); color: var(--sp-secondary-text); }
    .fulfillment.pickup { background: transparent; }
    .neighborhood { display: flex; align-items: center; gap: 5px; font-size: 14px; color: var(--sp-secondary-text); }
    .neighborhood .svg-inline--fa { color: var(--sp-muted-foreground); }
    .overdue-card { background: var(--sp-danger-surface); border-color: var(--sp-danger-border); padding: 16px 18px; }
    .overdue-card .order-heading { margin-bottom: 13px; }
    .overdue-card .order-details { margin-top: 14px; }
    .late-badge { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 650; color: var(--sp-danger); background: var(--sp-danger-badge); padding: 5px 7px; border-radius: 4px; white-space: nowrap; }
    .new-order { border-color: var(--sp-primary); background: var(--sp-new-surface); }
    .new-badge { display: flex; align-items: center; gap: 4px; color: var(--sp-primary); font-size: 10px; font-weight: 700; white-space: nowrap; }

    .today-section { padding: 23px 28px 0; min-height: 0; flex: 1; display: flex; flex-direction: column; }
    .today-heading { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .today-heading > span { color: var(--sp-muted-foreground); font-size: 12px; }
    .today-line { height: 1px; background: var(--sp-border); flex: 1; }
    .workday-status { display: flex; align-items: center; gap: 7px; }
    .production-board { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--sp-panel-gap); min-height: 0; flex: 1; }
    .production-column { --status-color: var(--sp-primary); --status-surface: var(--sp-primary-surface); --status-soft: rgba(85, 169, 255, 0.15); display: flex; flex-direction: column; min-height: 0; min-width: 0; }
    .status-production { --status-color: var(--sp-amber); --status-surface: var(--sp-amber-surface); --status-soft: rgba(240, 177, 63, 0.15); }
    .status-delivery { --status-color: var(--sp-success); --status-surface: var(--sp-success-surface); --status-soft: rgba(76, 205, 138, 0.15); }
    .column-heading { display: flex; align-items: center; gap: 10px; color: var(--status-color); background: var(--status-surface); padding: 15px 17px; border-top: 2px solid var(--status-color); border-radius: 5px 5px 0 0; flex-shrink: 0; font-size: 18px; }
    .column-heading h3 { font-size: 14px; font-weight: 700; }
    .column-count { margin-left: auto; min-width: 25px; height: 25px; padding: 0 6px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 14px; background: var(--status-soft); }
    .column-list { display: flex; flex-direction: column; gap: 12px; padding-top: 12px; padding-bottom: 2px; }
    .column-bottom { margin-top: auto; padding: 12px 3px 14px; display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--sp-muted-foreground); flex-shrink: 0; }
    .column-bottom > span:last-child { margin-left: auto; }
    .status-dot { background: var(--status-color); width: 5px; height: 5px; }
    .empty-list { padding: 20px; color: var(--sp-muted-foreground); display: flex; align-items: center; gap: 10px; }

    .events-section { flex-shrink: 0; border-top: 1px solid var(--sp-border); padding: 16px 28px 20px; background: var(--sp-header-surface); }
    .events-heading { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; color: var(--sp-muted-foreground); font-size: 15px; }
    .events-heading h2 { font-size: 11px; font-weight: 650; color: var(--sp-secondary-text); }
    .events-list { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); min-height: 38px; }
    .event { display: flex; align-items: flex-start; gap: 10px; padding: 0 17px; border-right: 1px solid var(--sp-border); min-width: 0; }
    .event:first-child { padding-left: 0; }
    .event:last-child { border-right: 0; padding-right: 0; }
    .event-icon { color: var(--sp-primary); background: var(--sp-primary-surface); width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-size: 13px; flex-shrink: 0; }
    .event-payment .event-icon { color: var(--sp-amber); background: var(--sp-amber-surface); }
    .event-done .event-icon { color: var(--sp-success); background: var(--sp-success-surface); }
    .event time { font-size: 10px; color: var(--sp-muted-foreground); font-variant-numeric: tabular-nums; }
    .event p { margin-top: 4px; font-size: 12px; color: var(--sp-secondary-text); line-height: 1.5; }
    .events-empty { color: var(--sp-muted-foreground); font-size: 12px; }

    @media (min-width: 1600px) and (min-height: 950px) {
        --sp-card-padding: 22px 24px;
        --sp-panel-gap: 24px;
        .panel-header { min-height: 126px; padding: 20px 36px; }
        .store-brand h1 { font-size: 32px; }
        .brand-mark { width: 55px; height: 55px; }
        .clock-time { font-size: 56px; }
        .clock-date { font-size: 16px; }
        .summary-counts { gap: 36px; }
        .summary-counts span { font-size: 16px; }
        .summary-counts strong { font-size: 32px; }
        .update-indicator { font-size: 12px; }
        .overdue-section { margin: 24px 36px 0; }
        .overdue-card { padding: 20px 22px; }
        .section-title h2, .today-heading h2 { font-size: 16px; }
        .today-section { padding: 27px 36px 0; }
        .order-code { font-size: 26px; }
        .order-heading { margin-bottom: 17px; }
        .order-details { margin-top: 20px; }
        .order-items { line-height: 1.45; }
        .fulfillment { font-size: 11px; }
        .neighborhood { font-size: 16px; }
        .column-heading { padding: 17px 20px; }
        .column-heading h3 { font-size: 16px; }
        .column-list { gap: 14px; padding-top: 14px; }
        .events-section { padding: 18px 36px 23px; }
        .event p { font-size: 14px; }
        .event time, .events-heading h2 { font-size: 12px; }
    }

    @media (max-height: 850px) {
        --sp-item-size: 19px;
        --sp-card-padding: 16px 18px;
        --sp-panel-gap: 16px;
        .panel-header { min-height: 96px; padding: 14px 24px; }
        .clock-time { font-size: 42px; }
        .overdue-section { margin: 16px 24px 0; }
        .today-section { padding: 18px 24px 0; }
        .order-code { font-size: 21px; }
        .order-heading { margin-bottom: 10px; }
        .order-details { margin-top: 12px; }
        .events-section { padding: 13px 24px 15px; }
        .column-heading { padding: 12px 15px; }
        .column-bottom { padding: 9px 3px; }
    }

    @media (max-width: 1100px) {
        .summary-counts { gap: 15px; }
        .summary-counts > div { gap: 6px; }
        .summary-counts span { font-size: 12px; }
        .store-brand h1 { font-size: 23px; }
        .overdue-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .overdue-card .order-items { font-size: 17px; }
        .overdue-card { padding: 12px 14px; }
        .overdue-card .order-details { margin-top: 8px; }
        .event { padding: 0 9px; gap: 6px; }
    }

    @media (prefers-reduced-motion: reduce) {
        .order-card { transition: none; }
    }
`;

// Pop-up do alerta: um por vez, canto superior direito
export const AlertPopup = styled.div`
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 30;
    width: 440px;
    max-width: calc(100vw - 48px);
    display: flex;
    gap: 18px;
    align-items: flex-start;
    padding: 20px 22px;
    border-radius: 10px;
    background: #191c21;
    border: 2px solid var(--alert-color);
    border-left-width: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    color: #f0f2f4;
    animation: ${popIn} .25s ease-out;

    &.alert-new { --alert-color: #55a9ff; }
    &.alert-payment { --alert-color: #f0b13f; }
    &.alert-done { --alert-color: #4ccd8a; }

    .alert-icon {
        width: 56px;
        height: 56px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: var(--alert-color);
        background: #202329;
        flex-shrink: 0;
    }

    .alert-body { min-width: 0; flex: 1; }
    .alert-title { font-size: 15px; font-weight: 800; color: var(--alert-color); letter-spacing: 0.5px; }
    .alert-code { font-size: 40px; font-weight: 800; line-height: 1.1; margin-top: 4px; }
    .alert-detail { font-size: 17px; color: #b4b7bd; margin-top: 6px; overflow-wrap: anywhere; }

    .alert-queue {
        position: absolute;
        top: -12px;
        right: -10px;
        font-size: 13px;
        font-weight: 800;
        padding: 5px 10px;
        border-radius: 12px;
        background: #ff706a;
        color: #0f1115;
    }
`;

// Faixa de som bloqueado / sem atualização
export const SoundBlockedBanner = styled.button`
    position: fixed;
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%);
    z-index: 40;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 28px;
    border: 0;
    border-radius: 8px;
    background: #ff706a;
    color: #0f1115;
    font-family: 'Inter', 'Arial', sans-serif;
    font-size: 20px;
    font-weight: 800;
    cursor: pointer;
`;

export const StartScreen = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 24px;
    background: #0f1115;
    color: #f0f2f4;
    font-family: 'Inter', 'Arial', sans-serif;
    text-align: center;

    .start-mark {
        width: 84px;
        height: 84px;
        border-radius: 14px;
        border: 1px solid #2c2f35;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 42px;
        color: #4ccd8a;
        overflow: hidden;
    }

    .start-mark img { width: 100%; height: 100%; object-fit: contain; }

    h1 { font-size: 34px; margin: 0; }
    p { font-size: 18px; color: #b4b7bd; margin: 0; max-width: 560px; line-height: 1.5; }

    button {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px 44px;
        border: 0;
        border-radius: 10px;
        background: #EC4899;
        color: white;
        font-family: inherit;
        font-size: 24px;
        font-weight: 800;
        cursor: pointer;
    }

    .start-hint { font-size: 14px; color: #8f949d; }
`;
